# ScreenFlows 网页采集 SDK（sf.js）

一行脚本接入，自动记录页面浏览（含单页应用的 `pushState` / `replaceState` / `popstate` / `hashchange`）：

```html
<script defer src="https://screenflows.dev/sdk/v1/sf.js" data-key="sfp_…"></script>
```

## API

```js
screenflows.track(name, props)   // 自定义事件，如 track('add_to_cart', { sku: 'A1001' })
screenflows.identify(id)         // 关联登录用户（请传站内匿名/哈希后的 id，不要传手机号、邮箱）
screenflows.page()               // 手动触发一次页面浏览（自动采集已覆盖 SPA 路由，一般不需要）
screenflows.consent(true|false)  // 配合 data-consent="required" 使用
screenflows.optOut()             // 访客选择退出（写入 sf_optout，不再采集）
screenflows.optIn()              // 取消退出
```

页面未加载完之前调用的 API 会进入队列，SDK 就绪后自动补执行。

## script 标签属性

| 属性 | 默认 | 说明 |
|---|---|---|
| `data-key` | 必填 | 网页密钥（`sfp_…`，在 ScreenFlows 后台「数据接入」创建，只接受填写的来源域名） |
| `data-host` | script 所在域名 | 上报地址，默认与 script 同源 |
| `data-consent` | 关闭 | 设为 `"required"` 时先征得访客同意再采集（配合 `screenflows.consent(true)`） |
| `data-respect-dnt` | `"true"` | 是否尊重 DNT / GPC |
| `data-auto-pageview` | `"true"` | 是否自动记录页面浏览 |

## 行为细节

- 匿名访客 id 存在本站 `localStorage`（`sf_uid`），会话 30 分钟无操作后结束
- 事件每 5 秒或页面隐藏时批量发送（`sendBeacon` 优先）
- 单个事件属性最多 20 个，只保留 string / number / boolean

## 隐私

- 默认尊重浏览器的「请勿跟踪」（DNT）与全局隐私控制（GPC）
- 不读取表单内容，不设置第三方 Cookie，不保存访客 IP
- `identify` 请传匿名或哈希后的 id，不要传手机号、邮箱等个人信息
