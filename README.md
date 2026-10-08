# dingxinglizi

> AI 分身：以我为原型的 AI Agent，帮我想方案、做决定、陪我思考、起草回复，并且不断成长。详见 [产品简报](docs/product-brief.md)。

## 快速开始

待确定技术栈后补充：环境要求、安装依赖、本地运行、运行测试。

## 目录结构

```
.
├── .editorconfig    # 编辑器统一格式（编码、换行、缩进）
├── .gitattributes   # Git 换行符与二进制文件处理
├── .gitignore       # 忽略系统文件、编辑器配置、依赖与构建产物、本地密钥、个人数据
├── CLAUDE.md        # 给 Claude 的项目上下文与硬性规则
├── docs/            # 产品文档（产品简报等）
├── LICENSE          # MIT 许可证
└── README.md
```

## 开发约定

- `main` 为主分支，新功能和修复在独立分支上开发，通过 Pull Request 合并。
- 提交信息写清楚改了什么、为什么改。
- 文件统一使用 UTF-8 编码、LF 换行，缩进规则见 `.editorconfig`。
- 本地密钥、令牌等写在 `.env` 中（已被忽略），需要共享的变量名放在 `.env.example` 里。
- **本仓库是公开的**：聊天记录、自我档案等个人数据只能放在 `private/` 或 `data/`（已被忽略），绝不提交。

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。
