import test from 'node:test';
import assert from 'node:assert/strict';
import {blank,normalize,validate,handoff,brief,AI_DECIDES} from '../web/model.mjs';

const base=over=>({...blank(),types:['web'],depth:'prototype',goal:'给门店老板看每天的预约',...over});

test('已停用的选项只移除该项，其余内容保留', () => {
  const issues=[];
  const d=normalize({types:['web','removed'],depth:'gone',goal:'目标',name:'x'.repeat(150),answers:{example:'答复',bad:3}},issues);
  assert.deepEqual(d.types,['web']);
  assert.equal(d.depth,'');
  assert.equal(d.goal,'目标');
  assert.equal(d.name.length,100);
  assert.deepEqual(d.answers,{example:'答复'});
  assert.equal(issues.length,3);
});

test('旧草稿没有新字段时正常读取', () => {
  const d=normalize({types:['web'],depth:'demo',goal:'目标'});
  assert.equal(d.pages,'');
  assert.deepEqual(d.answers,{});
});

test('必填项随交付目标变化', () => {
  const ids=d=>validate(d).map(e=>e.id);
  assert.deepEqual(ids(base({})),['flow','pages']);
  assert.deepEqual(ids(base({depth:'demo'})),['flow','entities','acceptance']);
  assert.deepEqual(ids(base({depth:'launch'})),['flow','entities','rules','example','acceptance']);
  assert.deepEqual(ids(base({depth:'advice'})),[]);
  assert.deepEqual(ids({...blank()}),['types','depth','goal']);
});

test('待推荐交给 AI，待定要人决定，作答后归入人已决定', () => {
  let h=handoff(base({flow:'a',pages:'b',hosting:'suggest',audience:['unsure']}));
  assert.ok(h.ai.includes('运行环境：由 AI 推荐'));
  const q=h.open.find(x=>x.id==='field:audience');
  assert.ok(q);
  assert.equal(h.ready,false);
  h=handoff(base({flow:'a',pages:'b',audience:['unsure'],answers:{'field:audience':'门店老板',example:AI_DECIDES}}));
  assert.deepEqual(h.settled.map(x=>x.answer),['门店老板']);
  assert.ok(h.ai.some(s=>s.includes('典型输入')));
  assert.equal(h.open.length,0);
  assert.equal(h.ready,true);
});

test('同一事项不重复提问', () => {
  const h=handoff(base({types:['agent'],flow:'a',pages:'b',autonomy:'unsure',knowledge:['unsure']}));
  assert.equal(h.questions.filter(q=>q.id==='agent-autonomy'||q.id==='field:autonomy').length,1);
  assert.equal(h.questions.filter(q=>q.id==='agent-knowledge'||q.id==='field:knowledge').length,1);
});

test('上线版本列出需要人准备的账号，原型不列', () => {
  const launch=handoff(base({types:['mini'],depth:'launch',features:['payment'],hosting:'cloud'}));
  assert.ok(launch.prepare.some(s=>s.includes('AppID')));
  assert.ok(launch.prepare.some(s=>s.includes('商户号')));
  assert.equal(handoff(base({types:['mini'],features:['payment']})).prepare.length,0);
});

test('开发阶段按交付目标与产品类型安排', () => {
  assert.equal(handoff(base({types:['agent'],depth:'demo'})).phases[0].title,'Agent 效果验证');
  const titles=handoff(base({types:['admin'],depth:'launch'})).phases.map(x=>x.title);
  assert.ok(!titles.includes('真实服务接入'));
  assert.equal(titles.at(-1),'上线验证');
});

test('简报包含交接各部分与 AI 工作规则', () => {
  const md=brief(base({flow:'客户预约 → 店长确认',pages:'预约列表\n预约详情'}));
  for(const s of ['## 人已决定','## 交给 AI 决定','## 还没决定','## 需要人准备','## 开发阶段','## 给 AI 的工作规则'])assert.ok(md.includes(s),s);
  assert.ok(md.includes('- 页面清单：预约列表\n  预约详情'));
});
