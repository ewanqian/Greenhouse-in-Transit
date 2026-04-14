# Vision Pro 技术选型与制作路线

更新时间：2026-04-14

## 1. 这份文档解决什么问题

你当前最需要的不是“所有技术都能做”，而是判断：

- 首版 demo 应该压在哪条最稳的路线
- 哪些技术是现在就能用的
- 哪些技术应该先降级处理
- 什么该放到第二阶段

## 2. 结论先行

### 2.1 当前最稳路线

首版最稳的是：

- Blender 手 K 动画资产
- USDZ / Reality Composer Pro / Xcode 原生组合
- 必要时用视频补足 showoff

也就是说，首版的主目标不是实时引擎炫技，而是：

> 用最少的交互，完成一次高质量、空间成立、风格独特的展开体验。

### 2.2 当前不该押注的路线

- 把首版主体验建立在 PLY 高斯点云实时渲染上
- 指望单一 WebXR 方案统一兼容手机和 Vision Pro
- 一开始就做复杂的箱体自动识别和精细 AR 追踪

## 3. Apple 原生路线判断

### 3.1 USDZ 是当前最稳的 3D 资产格式

Apple 官方对 Quick Look、RealityKit、Model3D、visionOS 资产展示的主路径都围绕 USD / USDZ 展开。这意味着：

- 如果你的 Blender 资产能稳定进入 USDZ
- 首版就已经有了一个非常清晰的交付格式

适合作为首版内容的资产：

- 线框壳体
- 几何支架
- 圆环与坐标杆
- 简化植物
- 箱体内部结构
- 可循环的动画对象

### 3.2 Reality Composer Pro / Xcode 适合做组装和原型

对当前项目来说，它更像一个：

- 资产编排层
- 演示场景层
- 原生体验包装层

而不是你所有复杂动画都必须在里面做完。最优策略依然是：

- 复杂节奏在 Blender 里先做好
- 原生层只负责装配、触发、摆放、播放

### 3.3 透明视频理论可行，但必须做真机验证

Apple 官方有 HEVC with Alpha 的支持路径。这意味着：

- 如果你想用透明视频做气氛层或局部显影层
- 技术上不是完全没路

但这里要注意：

- 在你具体的 Vision Pro 播放链路里，是否能按预期叠加到你要的空间呈现方式，必须真机验证
- 所以透明视频适合做“增强层”，不适合在当前阶段当唯一核心方案

建议用法：

- 做雾、花园残影、粒子幕、薄纱式层叠
- 不要拿它承担全部空间逻辑

## 4. 360 视频判断

### 4.1 可以作为一个备选 showoff 手段

如果你已经擅长做高质量动画和录屏，那 360 / 空间视频可以作为：

- 氛围展示
- 环境包裹
- 预渲染高质量 showoff 版本

### 4.2 但它不该替代“箱中空间”

《箱中温室》的关键不是“观众看一个全景片”，而是：

- 一个现实里的箱子
- 激活后有空间从箱中展开

如果只做 360 视频，作品容易变成“看一个漂亮环境”，而不是“箱体成为入口”。

所以更适合的关系是：

- 3D / USDZ 资产负责入口成立
- 视频负责提高密度和美感

## 5. PLY / 高斯 / Gaussian Splatting 判断

### 5.1 当前不要把首版压在 PLY 上

我这轮没有找到 Apple 官方把 PLY 作为 visionOS 原生主显示格式的稳定路线。对当前首版来说，这意味着：

- PLY 不适合作为必须交付的基础格式
- 高斯植物更适合作为研究线和第二阶段升级方向

### 5.2 更现实的做法

把高斯效果拆成三种使用方式：

1. 静态参考图或渲染图
2. 预渲染视频层
3. 简化后的代理模型 / 点云风格资产

也就是说：

- 先保留“高斯气质”
- 不强求首版“原生实时高斯”

## 6. WebAR / WebXR 判断

### 6.1 GitHub Pages 完全可以做入口页

这件事很稳：

- GitHub Pages 可以承载项目主页
- 可以承载档案页
- 可以承载“在 iPhone 上点击查看 AR”的入口页

### 6.2 iPhone 路线更适合围绕 USDZ / Quick Look

对 Apple 设备最现实的网页 AR 路线，仍然是：

- 网页里放项目说明
- 在 iPhone / iPad 上通过 AR Quick Look 打开 USDZ

这比“纯 WebXR 跨平台全自动沉浸体验”更稳。

### 6.3 WebXR 适合做扩展，不适合做首版唯一入口

原因很简单：

- 设备兼容性复杂
- 浏览器能力不完全一致
- 你当前最重要的是确保现场能稳定展示

所以首版建议：

- Web：说明、引导、归档、AR 跳转
- Vision Pro：完整 showoff

## 7. 推荐的首版技术分层

### A 层：必须稳定

- GitHub Pages 项目页
- 箱体二维码入口
- USDZ 资产链路
- Vision Pro 原生演示壳

### B 层：提升完成度

- 透明视频叠加
- 高质量预渲染视频
- 更细的灯光与空间 cue

### C 层：第二阶段研究

- PLY / 高斯实时显示
- 更复杂的 AR 锚定
- 原生粒子 / 更强交互

## 8. Blender 到 Vision Pro 的建议流程

1. 在 Blender 里做 3 到 4 个核心状态
2. 用最少资产完成 60–90 秒结构展开
3. 把难做的气氛层单独输出为视频
4. 能稳定导出 USDZ 的物体优先走模型路线
5. 原生层只做播放、触发、摆放和简单节奏控制

## 9. 首版推荐资产包

- 箱体扫描或简化模型
- 线框球壳
- 圆形轨道
- 坐标杆
- 温室骨架
- 半透明圆盘
- 少量植物代理模型
- 1 到 2 层视频残影

## 10. 你该怎么判断“这个方案够了”

不是看功能多少，而是看这四件事是否成立：

1. 观众能理解箱子是入口
2. 视觉语言足够独特
3. Vision Pro 里那 60–90 秒足够打人
4. 后续高斯 / WebAR / 原生升级都还能接进来

只要这四条成立，首版就是成功的。

## 11. 建议的下一轮验证

### 验证 1：原生最小链路

- 一个最简单的 USDZ 动画资产
- 一个最简单的 Vision Pro 场景
- 验证导入、摆放、播放

### 验证 2：透明视频

- 输出一段很短的透明视频
- 真机测试它在你的实际场景中的显示方式

### 验证 3：网页入口

- GitHub Pages 项目页加一个“在 iPhone 中查看 AR”按钮
- 用一份最简单的 USDZ 跑通 Quick Look

### 验证 4：高斯替代方案

- 选择一组高斯植物画面
- 先做成静帧、视频、代理模型三种版本
- 对比哪种最适合首版

## 12. 参考链接

以下是这轮判断依赖的主要资料：

- Apple AVFoundation：HEVC with Alpha  
  https://developer.apple.com/documentation/avfoundation/using-hevc-video-with-alpha
- Apple Quick Look / AR Quick Look  
  https://developer.apple.com/augmented-reality/quick-look/
- Apple SwiftUI `Model3D`  
  https://developer.apple.com/documentation/swiftui/model3d
- Apple RealityKit stereoscopic / spatial video 相关资料  
  https://developer.apple.com/documentation/realitykit/rendering-stereoscopic-video-with-realitykit
- Apple Movie Profiles for Spatial and Immersive Video  
  https://developer.apple.com/av-foundation/Apple-Movie-Profiles.pdf

说明：

- 关于 PLY / Gaussian Splatting，这轮没有找到 Apple 官方明确给出“可直接作为 visionOS 原生主显示格式”的稳定路径，因此本文件把它归为第二阶段研究方向。
