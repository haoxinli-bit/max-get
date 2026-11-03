# Maxget 产品工作台

Maxget 是面向产品经理的轻量工作台 MVP，覆盖需求收集、需求分析、低保真原型、PRD 文档和 GitHub Copilot 产品顾问对话。

## 功能

- **需求池**：创建、搜索、筛选需求，并推进需求状态。
- **钉钉文档导入**：从钉钉导出 DOCX、PDF、TXT、Markdown 或 CSV 后上传；Copilot 提取需求标题、摘要、优先级、主题标签，并建立需求记录。
- **Copilot 分析**：围绕产品形态、用户问题、UI/UX、功能范围、部署集成、技术可行性、市场假设、风险和成功指标生成结构化建议。
- **Copilot 对话和反馈**：基于选中的需求继续对话；每条回答可标记“有帮助”或“需要调整”，将反馈交给 Copilot 继续修订。
- **原型工作台**：根据需求生成低保真产品概念稿，并切换桌面/移动端预览。
- **PRD 文档**：编辑文档章节、自动保存到当前浏览器，并导出 Markdown。

AI 分析基于用户当前可用的 GitHub Copilot 模型。模型不联网进行市场研究，不会自动验证竞品、规模或技术事实；需要把这些结论当作假设并进一步核实。

## 连接 GitHub Copilot

1. 在 Maxget 中选择“连接 Copilot”。
2. 使用**你自己的**、已开通 Copilot 的 GitHub 账号令牌。Copilot CLI 支持 OAuth token（`gho_`）、拥有 Copilot Requests 权限的个人 fine-grained PAT（`github_pat_`）以及 GitHub App user-to-server token（`ghu_`）。经典 PAT（`ghp_`）不支持。
3. 连接成功后，选择账号当前可用的 Copilot 模型并开始对话或上传文档。

可在 [GitHub Copilot CLI 认证说明](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli) 查看支持的令牌类型和授权条件。Maxget 不提供 Copilot 订阅，也不把部署者的模型额度共享给访客。

## 本地运行与测试

需要 Node.js 22.x。Copilot 对话和文档导入依赖 Vercel Node 函数，不能只通过双击 `index.html` 或 Python 静态服务器运行。仓库根目录执行：

```sh
npm install
npm test
npx vercel dev
```

随后打开 Vercel CLI 显示的本地地址。未连接 Copilot 时，需求池、规则模板分析、原型和 PRD 仍可使用。

## 部署到 Vercel

在仓库根目录执行 `npx vercel` 完成项目关联，然后运行：

```sh
npx vercel --prod
```

`api/copilot.js` 通过 GitHub Copilot SDK 调用 Copilot CLI runtime；`vercel.json` 为文档分析和对话配置最长 60 秒的函数运行时间。需要为模型实际响应留出足够的 Vercel Function 执行时间。

## 数据与安全说明

- Copilot 令牌仅保存在当前页面的 JavaScript 内存中；刷新页面或断开连接后需要重新连接。令牌通过 HTTPS 的 `Authorization` 请求头发送给同源 Maxget API，不写入 `localStorage`、URL、服务端配置或日志。
- 每个模型会话均使用请求携带的用户令牌，SDK 禁用主机已登录账号回退、对话历史存储、遥测和所有工具权限。
- 对话历史仅保存在当前页面内存。用户选择的需求及其 Copilot 分析仍按 MVP 原有设计保存在浏览器 `localStorage`。
- 上传文档仅在 API 请求期间放在服务器临时目录/内存中；只支持最大 4 MB 的单个文件，提取的文本最多发送 12,000 字符，服务完成后清理临时文件。PDF 扫描件需要先 OCR。
- 用户主动上传的文档内容会发送到 GitHub Copilot 用于分析。请勿上传你无权分享的资料。PDF/DOCX 解析只抽取文本，不执行宏或嵌入内容。
- 浏览器端 Copilot AI 功能需要在 Vercel 部署版或 `vercel dev` 中使用，因为纯静态文件服务器不提供 `/api/copilot`。

## 实现参考

- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [GitHub Copilot CLI 认证](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli)
