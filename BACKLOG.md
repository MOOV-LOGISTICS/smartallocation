# Smart Allocation Phase 2 — Backlog

> Ideas and features discussed but not yet implemented.
> Read this file when asked "backlog 上有什么".

---

## BL-001 批量运行预检弹窗

**描述：** Run All 时先做快速预检，收集所有 Step 1（CRD > FOB）冲突，统一弹出列表让用户批量处理后再继续运行。
**背景：** 目前单条 Run 已有拦截弹窗，批量 Run 保持原逻辑（直接标记 Exception）。此功能为批量场景的体验优化。
**设计方案：** 见对话记录——Option B 方案，含"修改并运行全部"/"全部保持原日期"/"逐条决定"三个操作。

---

## BL-002 AI 排船推荐（多方案选择）

**描述：** Pre-Assign 运行后不直接写入 ASSIGNED，而是展示 2–3 个候选方案供用户选择。
**方案维度：**
- ⚡ 最快：ETD 最早 + ETA 最早
- 🛡 最稳：风险分最低 + 承运商优先级最高
- 🌿 最绿：按航线距离 + 船型估算碳排放最低
- ⭐ 推荐：综合评分加权最高

**背景：** 与目前全自动化流程有冲突，待全自动流程稳定后再叠加此功能。
**依赖：** 模块三（AI 风险预测）完成后更有意义，因为"最稳"方案需要风险分数据。

---
