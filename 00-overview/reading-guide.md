# 阅读指南

## 阅读顺序

如果你是第一次接触这个项目，建议按以下顺序阅读：

### 第一层：快速理解（对外）
1. **[project-summary.md](./project-summary.md)** —— 项目一句话+长短摘要，先看这个
2. **[world-overview.md](./world-overview.md)** —— 世界观整体框架
3. 访问网页 [project.html](../project.html) —— 对外项目主页，有图片

### 第二层：深入世界观（对内）
1. **[naming-system.md](./naming-system.md)** —— 统一名称表，避免混淆
2. 进入 `02-lore-database/` 按分类查看具体词条
   - 组织机构 → `organizations/`
   - 地点 → `locations/`
   - 物件 → `objects/`
   - 系统 → `systems/`
   - 事件 → `events/`

### 第三层：体验流程（现场执行）
1. **[visitor-journey.md](../03-experience-flow/visitor-journey.md)** —— 完整用户路径
2. **[mobile-experience-flow.md](../03-experience-flow/mobile-experience-flow.md)** —— 手机扫码流程

## 三类用户对应三条路径

### 用户 A：策展人 / 合作方
- 目标：快速理解项目
- 入口：[project.html](../project.html) → 项目主页
- 关心：这是什么？怎么展？为什么成立？和过往创作是什么关系？

### 用户 B：普通现场观众
- 目标：进入体验
- 入口：箱体 → 扫码 → 手机
- 关心：我该看什么？我该扫什么？这个箱子到底怎么回事？

### 用户 C：重度世界观用户
- 目标：深挖设定
- 入口：[archive.html](../archive.html) → 档案查看器
- 关心：组织有哪些？地点是什么？物件有什么？系统规则是什么？

## 编辑原则

- 保持保守，不完整的地方保留开放
- 每张词条遵循统一模板
- 关联词条用链接互相指向
- 图片说明放在 `images-caption-list.md`（在 `01-project-site/`）
