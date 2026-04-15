# Blender Shot Sheet 与首版资产制作表

更新时间：2026-04-16

## 1. 用途

这份表不是讲概念，而是直接服务首版制作：

- 给 Blender 动画搭 blocking
- 给资产命名和导出做统一规则
- 给后续 USDZ / Xcode 接入减少混乱

## 2. 首版资产包

首版只做 8 类资产，不扩。

| 资产名 | 数量 | 作用 | 首版是否必须 | 备注 |
| --- | --- | --- | --- | --- |
| `CaseProxy` | 1 | 箱体占位和空间入口锚点 | 必须 | 只要轮廓、扣件、标签位 |
| `ShellWire` | 1 | 边界球壳 / 系统显影 | 必须 | 可双层，但先做一层 |
| `OrbitRing` | 2-3 | 轨道和节奏骨架 | 必须 | 大小和方向错开 |
| `CoordPole` | 6-10 | 测绘杆 / 坐标语言 | 必须 | 从箱边或壳体边缘升起 |
| `GreenhouseFrame` | 1 组 | 温室骨架主角 | 必须 | 分段打开，不做复杂 rig |
| `IridescentDisk` | 3-5 | 光感控制面 | 建议 | 慢转，不抢戏 |
| `PlantGhost` | 3 套 | 植物记忆层 | 必须 | solid / sparse / card-cloud 三层代理 |
| `FogResidueLayer` | 1-2 | 雾和残影增强 | 可选 | alpha 视频或平面贴图 |

## 3. 四态制作原则

所有资产统一走四态，不单独发明规则：

- `State A / Dormant`
- `State B / Awake`
- `State C / Deploy`
- `State D / Residue`

每个对象只围绕这 5 类参数做关键帧：

- `Location`
- `Rotation`
- `Scale`
- `Alpha / Emission`
- `Visibility / Geometry Switch`

## 4. 四幕时间表

总时长建议：`88 秒`

### 幕 1：误投唤醒（0–12s）

目标：

- 先让箱子成立
- 先建立“异常物件”感

画面：

- 箱体静置
- 标签、编号、灯点轻微苏醒
- 一点极弱呼吸感

技术承担：

- `CaseProxy`
- 少量发光材质

### 幕 2：边界显影（12–28s）

目标：

- 让观众知道里面压缩着一个系统

画面：

- 线框球壳出现
- 轨道展开
- 坐标杆升起
- 一两片虹彩圆盘轻转

技术承担：

- `ShellWire`
- `OrbitRing`
- `CoordPole`
- `IridescentDisk`

### 幕 3：结构展开（28–58s）

目标：

- 真正的“温室从箱中生长”

画面：

- 温室骨架分段打开
- 支架、薄片、结构件往外生长
- 数据残影和空间层次同步增加

技术承担：

- `GreenhouseFrame`
- `OrbitRing`
- `IridescentDisk`

### 幕 4：植物记忆 / 停留 / 回收（58–88s）

目标：

- 先到最美，再轻回收

画面：

- 植物代理分层显影
- 雾和残影局部叠加
- 空间停留 6–8 秒
- 最后开始衰减，但不完全清空

技术承担：

- `PlantGhost`
- `FogResidueLayer`
- 局部 `ShellWire / GreenhouseFrame` 衰减

## 5. 按对象的关键帧建议

### `CaseProxy`

- `0s` 静置
- `4s` 标签或灯点第一次轻微发亮
- `10s` 完成唤醒态
- 全程不做大位移

### `ShellWire`

- `12s` 从近不可见进入
- `18s` 放大到 `1.02`
- `24s` settle 回 `1.0`
- `70s` 后开始轻微衰减

建议参数：

- `Scale`
- `Alpha`
- `Emission`

### `OrbitRing_A`

- `13s` 出现
- `16s` 开始慢转
- 贯穿第二幕到第四幕

建议参数：

- `Rotation Z`
- `Scale`

### `OrbitRing_B`

- 比 `A` 慢半拍进入
- 方向相反
- 节奏更慢

### `CoordPole_01...08`

- 每根错开 `6–12` 帧启动
- 用 `Scale Z` 从 `0.01` 拉到 `1.0`
- 不做太多横向漂移

### `GreenhouseFrame_Root`

- `28s` 主展开开始
- 拆成 `6–12` 段件
- 每段先旋开，再轻微位移到位
- `58s` 前完成主结构成型

### `IridescentDisk_A...C`

- 只做慢转和轻微显隐
- 不做高速旋转
- 作用是打光感和层次

### `PlantGhost_A`

- 第四幕最先出现
- 更像 solid 或 dense 的植物轮廓

### `PlantGhost_B`

- 比 `A` 晚半拍
- 更 sparse
- 更像记忆碎片

### `PlantGhost_C`

- 最后出现
- 用 card-cloud 或点状平面制造轻盈感

### `FogResidueLayer`

- 第四幕进入
- 不覆盖全屏
- 只在局部边缘和前景打层

## 6. 节奏规则

### 必须遵守

- 不允许所有物体同时启动
- 同类物体至少错开 `6–12` 帧
- 每一幕只允许一类主角
- 任何增强层都不能压过 `GreenhouseFrame`

### 视觉判断标准

如果画面看起来像：

- 舞台 cue
- 温室显影
- 结构在呼吸

说明方向是对的。

如果画面看起来像：

- HUD 爆屏
- 科技展模板
- 满屏乱闪

说明要减。

## 7. 导出建议

### 7.1 导出版本

每次导出建议做两版：

- `all-in-one`：方便首测
- `split-assets`：方便换件和排错

### 7.2 文件命名

```text
case_proxy_v001
shell_wire_v001
orbit_ring_a_v001
orbit_ring_b_v001
coord_pole_set_v001
greenhouse_frame_v001
plant_ghost_a_v001
plant_ghost_b_v001
plant_ghost_c_v001
fog_alpha_v001
```

### 7.3 版本原则

- 只增不改名
- 显著结构变化才升版本
- 测试失败不覆盖旧版

## 8. 72 小时制作顺序

### 第 1 段

- 先做 `CaseProxy`
- 再做 `ShellWire`
- 再做 `OrbitRing`

这三类先跑通，第二幕就成立了。

### 第 2 段

- 搭 `GreenhouseFrame`
- 不做复杂细节
- 先把主结构打开逻辑做顺

### 第 3 段

- 加 `PlantGhost`
- 加 `FogResidueLayer`
- 做第四幕最美的停留

## 9. 最低交付判断

首版 blocking 成功的标准不是精度，而是：

1. 只看灰模也能看懂四幕结构
2. 只看 silhouette 也能感知温室展开
3. 去掉雾层后主戏仍然成立
4. 去掉植物层后结构仍然成立

只要这四条成立，就可以进入 USDZ 测试。
