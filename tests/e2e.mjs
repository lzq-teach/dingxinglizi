// 浏览器端到端检查：启动本机服务，用 Playwright 走一遍关键流程。
// 运行：node tests/e2e.mjs
// 需要 Playwright（npm i -D playwright），或用 PLAYWRIGHT_MODULE 指向已安装的 playwright/index.mjs。
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const port = Number(process.env.KICKOFF_E2E_PORT || 8790);
const PAGE = `http://127.0.0.1:${port}/`;
const server = spawn('python3', ['server.py'], { cwd: root, env: { ...process.env, KICKOFF_PORT: String(port) }, stdio: 'ignore' });

let failures = 0;
const check = (name, ok) => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); };

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(PAGE)).ok) return; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('本机服务没有启动');
}

async function fillPrototype(page, goal) {
  await page.click('[data-choice="types"][data-value="agent"]');
  await page.click('[data-choice="depth"][data-value="prototype"]');
  await page.fill('#field-goal', goal);
  await page.click('[data-next]');
  await page.fill('#field-flow', '上传 → 汇总');
  await page.fill('#field-pages', '上传页；日报页');
}

const browser = await chromium.launch({ env: { ...process.env, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' } });
try {
  await waitForServer();
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const open = async () => {
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => m.type() === 'error' && !m.text().includes('404') && errors.push(m.text()));
    await p.goto(PAGE);
    return p;
  };
  const stored = p => p.evaluate(() => JSON.parse(localStorage.getItem('kickoff.projects.v1')));

  // 两个标签页编辑不同草稿，互不覆盖
  const a = await open(); await a.fill('#field-name', '项目甲');
  const b = await open(); await a.click('#newBtn'); await a.fill('#field-name', '项目乙');
  await b.fill('#field-name', '项目甲（另一页修改）');
  const names = (await stored(a)).projects.map(p => p.data.name);
  check('两个标签页的草稿都保留', names.includes('项目乙') && names.includes('项目甲（另一页修改）'));

  // 空白项目上重复点「新项目」不会堆出空白草稿
  const c = await open(); const before = (await stored(c)).projects.length;
  await c.click('#newBtn'); await c.click('#newBtn');
  check('连点新项目只多一份空白草稿', (await stored(c)).projects.length === before + 1);

  // 侧栏不能跳过第 1 步的必填
  await c.click('[data-step="2"]');
  check('侧栏跳步被拦回第 1 步', (await c.textContent('#formView h1')) === '产品定位');

  // 步骤写进地址：后退、刷新
  await fillPrototype(c, '测试后退');
  check('第 2 步地址为 #2', c.url().endsWith('#2'));
  check('输入时底部计数更新', (await c.textContent('#footerMeta')).startsWith('2 / 4'));
  await c.goBack();
  check('后退回到第 1 步', (await c.textContent('#formView h1')) === '产品定位');
  await c.goForward(); await c.reload();
  check('刷新后停在第 2 步', (await c.textContent('#formView h1')) === '业务与功能');

  // 多选可以同时选具体项和「待定」
  await c.click('[data-choice="audience"][data-value="team"]');
  await c.click('[data-choice="audience"][data-value="unsure"]');
  check('多选里具体项和「待定」同时选中', (await c.locator('[data-choice="audience"].selected').count()) === 2);
  await c.click('[data-choice="audience"][data-value="team"]');

  // 简报页：作答、交给 AI、撤回
  await c.click('[data-result]');
  await c.fill('[data-answer="field:audience"]', '门店老板');
  await c.click('[data-delegate="field:audience"]');
  check('交给 AI 后焦点仍在按钮上', await c.evaluate(() => document.activeElement?.dataset?.delegate === 'field:audience'));
  await c.click('[data-delegate="field:audience"]');
  check('撤回后原答复恢复', (await c.inputValue('[data-answer="field:audience"]')) === '门店老板');

  // 改回「待定」时旧答复不复活
  await c.click('[data-step="1"]');
  await c.click('[data-choice="audience"][data-value="unsure"]'); await c.click('[data-choice="audience"][data-value="unsure"]');
  await c.click('[data-result]');
  check('改回待定后答复为空', (await c.inputValue('[data-answer="field:audience"]')) === '');
  check('生成 AGENTS.md 不可用时提前说明', (await c.textContent('#agentsStatus')).length > 0 && await c.isDisabled('#generateAgents'));

  // 导出再导入：草稿完整，夹带的 AGENTS.md 被丢弃
  const [dl] = await Promise.all([c.waitForEvent('download'), c.click('#exportJson')]);
  const backup = JSON.parse(await readFile(await dl.path(), 'utf8'));
  backup.project.agents = { markdown: '# 夹带的内容', input: 'x' };
  await c.click('#draftsBtn');
  await c.setInputFiles('#importFile', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await c.click('[data-result]');
  check('导入后草稿内容完整', (await c.inputValue('[data-answer="field:audience"]')) === '');
  check('导入的备份不带 AGENTS.md 草案', await c.isHidden('#agentsText'));
  await c.click('#draftsBtn');
  await c.setInputFiles('#importFile', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('hello') });
  check('导入非 JSON 显示中文提示', (await c.textContent('#toast')).includes('不是有效的 JSON'));
  check('提示不拦截点击', (await c.evaluate(() => getComputedStyle(document.querySelector('#toast')).pointerEvents)) === 'none');
  let message = ''; c.once('dialog', d => { message = d.message(); d.dismiss(); });
  await c.click('[data-delete-draft]');
  check('删除确认写出草稿名', message.includes('「'));

  // 手机宽度：不横向滚动，当前步骤可见，长项目名不撑开页面
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  m.on('pageerror', e => errors.push(e.message));
  await m.goto(PAGE);
  await m.fill('#field-name', 'https://example.com/' + 'abcdefghij'.repeat(8));
  await fillPrototype(m, '手机测试');
  await m.click('[data-result]');
  check('手机上不横向滚动', await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  check('手机上当前步骤在步骤条可见范围内', await m.evaluate(() => {
    const nav = document.querySelector('#steps'), a = nav.querySelector('.step.active').getBoundingClientRect(), n = nav.getBoundingClientRect();
    return a.left >= n.left - 1 && a.right <= n.right + 1;
  }));

  check('没有页面脚本错误', errors.length === 0);
  if (errors.length) console.log(errors);
} finally {
  await browser.close();
  server.kill();
}
process.exitCode = failures ? 1 : 0;
