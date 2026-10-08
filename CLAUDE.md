# 项目说明（给 Claude 的上下文）

## 项目

开项 · 项目启动表单：用户选择产品定位、业务与功能等，生成项目简报；可选调用本机 Codex 生成 `AGENTS.md`。用法见 `README.md`。

- `web/model.mjs`：所有字段、显示条件、校验、协作建议（`recommend`）和简报文本（`brief`）。改表单内容主要改这里。
- `web/app.js`：渲染、交互、localStorage 草稿、导入导出。
- `server.py`：只监听 127.0.0.1，校验 Host/Origin，调用 Codex CLI。

## 关于仓库主人

- 跨专业的产品经理，零代码基础。
- 主人负责需求、取舍和验收；技术选型、编码、测试、部署由 Claude 完成。
- 沟通用中文，技术概念用大白话解释，说明做了什么、为什么。

## 规则

- 本仓库是公开的，不提交密钥或个人数据。
- 改动后运行 `python3 -m unittest discover -s tests -v`，并在浏览器里走一遍五个步骤。
