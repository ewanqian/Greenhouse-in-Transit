# visionOS 原生壳实现规格

更新时间：2026-04-16

## 1. 目标

这一版原生壳只解决一件事：

> 让《Greenhouse in Transit》具备一个可自动播放、可录屏、可现场演示的 visionOS 最小原生入口。

不追求完整交互，不追求复杂识别，不追求实时高斯，只追求把这条链稳定跑通：

`开始按钮 -> ImmersiveSpace -> 场景加载 -> USDZ 自动展开 -> alpha 视频局部增强 -> 停留 / 回收`

## 2. 工程范围

### 2.1 本轮必须有

- 一个 `WindowGroup` 启动页
- 一个 `ImmersiveSpace`
- 一个 `RealityView`
- 一组可命名、可替换的 USDZ 资产
- 自动播放逻辑
- 可选的一层 `alpha` 视频雾效或残影层

### 2.2 本轮明确不做

- object tracking
- 图片识别或箱体识别
- 手势驱动的逐段交互
- 多个沉浸场景切换
- 实时 PLY / Gaussian Splatting
- 远程资源下载
- 场景内 UI 面板系统

## 3. 建议目录结构

工程建议先作为本地私有工程存在，仓库只同步文档和稳定结论。

```text
GreenhouseDemo/
├── GreenhouseDemoApp.swift
├── StartView.swift
├── ImmersiveGreenhouseView.swift
├── GreenhousePlaybackController.swift
├── RealityKitContent/
│   ├── Package.realitycomposerpro
│   └── Sources/RealityKitContent/RealityKitContent.rkassets
├── Assets/
│   ├── case_proxy.usdz
│   ├── shell_wire.usdz
│   ├── greenhouse_frame.usdz
│   ├── plant_ghost.usdz
│   └── fog_alpha.mov
└── README-local.md
```

## 4. 核心界面结构

### 4.1 `StartView`

负责三件事：

- 显示项目标题
- 显示一句最短说明
- 提供一个 `开始展开` 按钮

可选补充：

- 一个 `重播说明` 文本
- 一个 `如果失败请返回重试` 的轻提示

不要加太多说明文字，不要把这个界面做成项目介绍页。

### 4.2 `ImmersiveGreenhouseView`

负责：

- 加载 `RealityKitContent` 中命名为 `Immersive` 的场景
- 将场景摆放在用户前方固定范围内
- 递归播放所有预设动画
- 单独叠加一层透明视频平面
- 可选在结束后触发轻微回收或淡出

## 5. 沉浸样式

首版固定使用：

- `.mixed`

原因：

- 作品的成立依赖真实箱体和现实环境
- 用户不需要大范围走动
- 更适合“站在箱前观看展开”

默认场景摆位：

- 前方 `0.8m - 1.0m`
- 高度中心约 `1.1m - 1.25m`
- 横向居中

## 6. 资产命名规范

场景里所有对象名称必须稳定，后续替换资产时不改接口名。

```text
CaseRoot
ShellWire_A
OrbitRing_A
OrbitRing_B
CoordPole_01
CoordPole_02
CoordPole_03
CoordPole_04
CoordPole_05
CoordPole_06
CoordPole_07
CoordPole_08
GreenhouseFrame_Root
IridescentDisk_A
IridescentDisk_B
IridescentDisk_C
PlantGhost_A
PlantGhost_B
PlantGhost_C
FogPlane_A
```

## 7. 资源加载规则

### 7.1 优先级

首版资源优先级固定为：

1. `USDZ` 动画资产
2. `alpha MOV` 增强层
3. 音效

### 7.2 失败降级

- 如果 `fog_alpha.mov` 加载失败，主场景仍然必须能正常播放
- 如果个别装饰资产缺失，核心展开仍然必须成立
- 如果某一组动画无法自动播放，至少要能显示静态场景用于排查

## 8. 播放控制

### 8.1 自动播放策略

进入 `ImmersiveSpace` 后：

- 自动加载场景
- 自动播放所有可用动画
- 自动播放 `fog_alpha.mov`

默认不需要手动点击二次开始。

### 8.2 重播策略

首版最简单方案：

- 退出再重进即重播

如果要做本地重播按钮，只允许：

- 停止当前场景
- 重新实例化场景

不在首版里做复杂时间轴回退。

## 9. Reality Composer Pro 的责任边界

`Reality Composer Pro` 只承担：

- 场景结构整理
- 资产摆位
- 少量灯光
- 少量时间线
- 音效 cue

不要把全部复杂动画硬塞进 RCP。

更适合放在 Blender 完成的内容：

- 主体展开节奏
- 结构生长
- 大块位移与旋转
- 分层出现的核心动画

## 10. 最小代码职责拆分

### `GreenhouseDemoApp.swift`

- 配置 `WindowGroup`
- 配置 `ImmersiveSpace`

### `StartView.swift`

- 标题
- 按钮
- 调用 `openImmersiveSpace`

### `ImmersiveGreenhouseView.swift`

- `RealityView`
- 资产加载
- 场景位置与缩放
- 视频平面叠加

### `GreenhousePlaybackController.swift`

- 播放状态
- 重播逻辑
- 可选的结束回收 hook

## 11. 最低验收标准

只要以下 6 件事成立，这个壳就算第一版成功：

1. 工程能稳定启动
2. 点击 `开始展开` 能进入 `ImmersiveSpace`
3. 场景能加载出至少一套可见资产
4. USDZ 动画能自动播放
5. 去掉 alpha 视频后主逻辑不崩
6. 可以录出一条完整的 60–90 秒演示视频

## 12. 后续扩展接口

虽然首版不做，但接口名和结构要给未来留口：

- `ObjectAnchor` 入口
- `AR Quick Look` 配套资产包
- 更复杂的音效状态机
- 高斯替代资产的插槽
- 多版本场景切换

原则是：

> 首版不实现，但不把结构做死。
