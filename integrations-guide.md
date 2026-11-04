# ScreenFlows × AI 编码工具（MCP 与 Skill）

ScreenFlows 提供远程 MCP 服务，让 Claude Code、Cursor 等工具直接调用平台的分析能力；在此之上提供 5 个 Skill，把常用的分析与优化流程固化下来。

- **MCP 地址**：`https://screenflows.dev/mcp`（Streamable HTTP，无状态）
- **鉴权**：`Authorization: Bearer <个人令牌>`。令牌在网页右上角「MCP 令牌」中生成，只显示一次；可设有效期、随时吊销，网页会显示最近使用时间。
- **租户隔离**：令牌代表你的账号，工具只能访问你所在组织的项目（`list_projects` 只返回这些项目）。
- **权限**：第一版工具全部只读。令牌分「只读分析 / 管理」两级，管理级只有组织管理员能创建，为后续管理类工具预留。

## 接入

### Claude Code：插件（推荐，含 Skill）

```bash
export SCREENFLOWS_TOKEN=sfk_xxx   # 写进 ~/.zshrc 等，让 Claude Code 能读到
```

然后在 Claude Code 中添加插件市场并安装：

```
/plugin marketplace add corlin/screenflows-sdk
/plugin install screenflows@screenflows-marketplace
```

插件来自公开仓库 [corlin/screenflows-sdk](https://github.com/corlin/screenflows-sdk)。插件会注册 `screenflows` MCP 服务（令牌从 `SCREENFLOWS_TOKEN` 读取），并安装下面的 Skill。

### Claude Code：只接 MCP

```bash
claude mcp add --transport http screenflows https://screenflows.dev/mcp \
  --header "Authorization: Bearer sfk_xxx"
```

### Cursor

在项目的 `.cursor/mcp.json`（或全局 `~/.cursor/mcp.json`）中加入：

```json
{
  "mcpServers": {
    "screenflows": {
      "url": "https://screenflows.dev/mcp",
      "headers": { "Authorization": "Bearer sfk_xxx" }
    }
  }
}
```

### 其他工具

任何支持「远程 MCP + 自定义请求头」的客户端都可以接入：URL 填上面的地址，传输方式选 Streamable HTTP，请求头加 `Authorization: Bearer <令牌>`。各工具的配置写法以其官方文档为准。

`skills/*/SKILL.md` 是通用的 Markdown 指令；不支持 Skill 的工具可以把内容作为规则或提示词使用。

## 工具（全部只读）

| 工具 | 作用 |
|---|---|
| `list_projects` | 项目、转化目标、数据日期范围（「近 N 天」以数据最后一天为准） |
| `list_segments` | 可用的业务分群（`segment` 参数取值） |
| `get_overview` | 关键指标；`compare_previous` 对比等长上期 |
| `get_funnel` | 有序漏斗、分群完成率、流失去向、结论与建议 |
| `get_flow` | 页面流转网络；`compare` 支持转化 vs 未转化、本期 vs 上期 |
| `get_step_timing` | 页面在会话中出现的时机 |
| `get_journey` | 旅程阶段的触点、痛点与建议 |
| `diagnose_page` | 单页诊断与干预方案 |
| `simulate_intervention` | 降低某页离开率后的转化推演（模型估算） |
| `get_behavior` | 访问时段 / 入口来源 / 新用户逐周 / 板块占比 / 典型路径 |
| `get_lifecycle` | 用户停在哪一步：沿漏斗按用户统计最远步骤、停留人数、仍活跃 / 已沉默、停留天数与停下前的动作（回答「注册后卡在哪一步」） |
| `get_import_spec` | 数据接入规范：离线文件的字段、列名别名、时间格式、隐私规则与示例模板，实时接入的用法，以及推荐事件规范（标准事件名、中文名、所属环节、身份合并与命名规则） |
| `list_imports` | 所在组织最近的离线导入与状态（待确认 / 已导入 / 失败原因） |

所有分析工具都支持 `from` / `to`（YYYY-MM-DD，按会话开始日期）与 `segment`；结果附带 `dataQuality`，样本不足时不应下结论。

## Skill

| Skill | 用途 | 适合谁 |
|---|---|---|
| `screenflows-review` | 周期复盘（本期 vs 上期），输出带证据的结论与建议 | 产品 / 运营 / 管理员 |
| `screenflows-page-optimize` | 诊断页面 → 在产品代码库定位实现 → 经确认后实现带开关的改动 → 给出验证方案 | 开发人员 |
| `screenflows-release-impact` | 以上线日为界对比前后窗口，判断改版影响与可信度 | 开发 / 产品 |
| `screenflows-data-health` | 数据时效、样本、页面字典覆盖、漏斗配置体检，给出页面字典补充建议 | 平台管理员 |
| `screenflows-import` | 把埋点 / 日志 / 第三方导出整理成离线导入文件，本地校验、去除个人信息，指导上传并跟进结果 | 开发 / 数据工程 |

用自然语言触发即可，例如「看看电商示例上个月的转化复盘」「根据数据优化购物车页面」「评估 10 月 20 日改版的影响」「检查一下平台数据有没有问题」「把这份埋点日志整理成可以导入 ScreenFlows 的文件」。

## 安全

- 令牌等同于你的账号的只读权限，不要提交到代码仓库；用环境变量或工具的密钥管理保存。
- 吊销令牌、删除账号后最多 30 秒内失效；删除账号时会一并删除其令牌。
- `/mcp` 拒绝来自其他网站的浏览器请求（校验 Origin），只接受带令牌的客户端请求。
