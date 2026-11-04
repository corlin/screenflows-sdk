---
name: screenflows-data-health
description: ScreenFlows 数据与配置体检（面向平台管理员）：检查各项目的数据时效、样本量、单页会话比例、页面字典覆盖（未配置名称的页面）、漏斗步骤是否都有数据、会话是否过短，输出问题清单和修复建议（含可直接粘贴的页面字典行）。适用于"检查一下平台数据有没有问题""为什么某个项目看不出东西""帮我补页面字典"这类请求。
---

# 数据与配置体检

依赖 `screenflows` MCP 服务（只读）。本 Skill 只检查和给出建议，不直接修改配置；修改请管理员在 ScreenFlows「业务语义配置」中完成。

## 检查项

对 `list_projects` 返回的每个项目（或用户指定的项目）：

1. **数据时效**：`dataRange.to` 距今天数。超过 3 天提示数据可能未同步：内置示例项目不同步，属正常；在线同步或实时接入的项目每小时更新，滞后说明接入可能中断。
2. **样本与会话质量**：`get_overview` 的 `dataQuality`（样本等级、会话数）；`get_step_timing` 的 `medianSessionLength` 与 `shortSessionsNote`。一半以上会话只有 1 步时，说明路径类分析参考价值有限，可能是埋点只记录了落地页，或会话切分过细。
3. **页面字典覆盖**：`get_flow`（`max_edges: 5`）中 `label` 与 `page` 相同、看起来像原始路由或事件名（如 `/xxx/123`、英文事件名）的页面，通常是页面字典没有配置。按访问量排序列出。
4. **漏斗配置**：`get_funnel` 报错"步骤在数据中不足"时，列出缺失的步骤，提示核对 `project.json` 的 `funnel.steps` 与实际埋点名称。
5. **转化目标**：`get_overview` 的 `convertedSessions` 为 0 或极少时，提示核对 `goal.page` 是否与实际事件一致。
6. **入口合理性**：`get_behavior`（`analysis: "entry"`）中，如果大量会话从深层页面或异常页面开始，提示可能存在埋点缺失（落地页没记录）。

## 输出格式

```
## ScreenFlows 数据体检（<日期>）
| 项目 | 数据截至 | 会话数 | 样本 | 会话中位步数 | 未配置页面 | 漏斗 | 结论 |
### 问题与修复建议（按严重程度）
### 页面字典补充建议
（CSV 行，列与 pages.csv 一致：route_pattern,page_name,feature,section,stage,touchpoint_type；stage 取项目已有的阶段 id，touchpoint_type 为 system / interactive / human；名称根据路由与页面内容推断时请标注「待确认」）
```

## 原则

- 只根据工具返回的数据下判断；推断的页面名称必须标注「待确认」，由管理员核对。
- 不要尝试调用不存在的写入类工具。
