# 项目说明（给 Claude 的上下文）

## 项目

开项 · 项目启动表单。目的：把人和 AI 要做的事分开。人在表单里定下产品定位、业务与功能等，生成项目简报交给 AI 开发；可选调用本机 Codex 生成 `AGENTS.md`。用法见 `README.md`。

- `web/model.mjs`：字段、显示条件、必填规则（`REQUIRED_BY_DEPTH`）、协作建议（`recommend`）、人机交接（`handoff`）和简报文本（`brief`）。改表单内容主要改这里。
  - 选项标签「待推荐 / 待估」= 交给 AI；「待定 / 待确认」= 人还没决定（`intentOf`）。
  - 简报页问题的答复存在 `data.answers`，键为问题 id。
- `web/app.js`：渲染、交互、localStorage 草稿、导入导出。
- `server.py`：只监听 127.0.0.1，校验 Host/Origin，调用 Codex CLI。

## 关于仓库主人

- 跨专业的产品经理，零代码基础。
- 主人负责需求、取舍和验收；技术选型、编码、测试、部署由 Claude 完成。
- 沟通用中文，技术概念用大白话解释，说明做了什么、为什么。

## 规则

- 本仓库是公开的，不提交密钥或个人数据。
- 改动后运行 `node --test tests/model.test.mjs` 和 `python3 -m unittest discover -s tests -v`，并在浏览器里走一遍五个步骤。
- 调整选项时不要复用已停用选项的 value；旧草稿里认不出的选项会被移除。
