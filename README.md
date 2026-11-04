# screenflows-sdk

> ScreenFlows · 看见客户旅程，找到最值得改的那一步

[ScreenFlows](https://screenflows.dev) 是企业级客户旅程分析 SaaS：把散落的行为数据变成一张会流动的旅程图——从哪来、在哪犹豫、为什么没有走到最后，以及先改哪里最值。

本仓库是 ScreenFlows 的**公开部分**：网页采集 SDK 与 AI 编码工具集成（MCP + Skill）。分析引擎与应用本体保持私有。

## 本仓库内容

| 目录 | 说明 |
|---|---|
| `sdk/` | 网页采集脚本 `sf.js` 源码与使用文档（一行 script 接入，自动记录页面浏览与自定义事件） |
| `skills/` | 5 个 Claude Code Skill：周期复盘、页面诊断优化、改版影响评估、数据体检、埋点整理 |
| `.claude-plugin/plugin.json` + `.mcp.json` | Claude Code 插件清单与 MCP 服务配置 |
| `integrations-guide.md` | MCP / Skill 完整接入指南 |

## 快速开始

**网页采集**（`sdk/` 有完整文档）：

```html
<script defer src="https://screenflows.dev/sdk/v1/sf.js" data-key="sfp_…"></script>
<script>
  screenflows.track('add_to_cart', { sku: 'A1001' });
  screenflows.identify('u_8f3a2c');
</script>
```

**Claude Code 插件**（含 5 个 Skill + MCP）：

```bash
export SCREENFLOWS_TOKEN=<你的个人令牌>  # 在 screenflows.dev 右上角「MCP 令牌」生成
```

```
/plugin marketplace add corlin/screenflows-sdk
/plugin install screenflows@screenflows-marketplace
```

或只接 MCP，见 `integrations-guide.md`。

## 隐私

SDK 默认尊重 DNT / GPC，不读取表单内容，不设第三方 Cookie，不保存访客 IP；疑似个人信息的列默认不导入。详见 `sdk/README.md`。

## License

MIT — 详见 [LICENSE](./LICENSE)。
