# MultiDatePicker

多日期选择组件，支持受控与非受控两种用法，基于 AntD v3 视觉与交互。

## 基本使用

受控模式：

```jsx
import MultiDatePicker from './MultiDatePicker';

function Demo() {
  const [val, setVal] = React.useState(["2024-01-10", "2024-01-12"]);
  return (
    <MultiDatePicker
      value={val}
      onChange={(dates, strings) => setVal(strings || [])}
    />
  );
}
```

非受控模式：

```jsx
<MultiDatePicker
  defaultValue={["2024-01-10"]}
  onChange={(dates, strings) => {
    console.log('changed', dates, strings);
  }}
/>
```

## Props（属性）

以下为组件可配置的全部属性，类型与行为与源码一致（`src/components/MultiDatePicker/index.jsx`）。

| 名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string[] | Moment[] | string | Moment` | 无 | 否 | 受控模式的选中值。传入即切为受控模式，由外部驱动。字符串按 `dateFormat` 解析。为空时传 `null` 给回调。|
| `defaultValue` | 同 `value` | 无 | 否 | 非受控模式初始值，仅首次渲染生效；后续不会覆盖用户交互产生的内部状态。|
| `onChange` | `(dates: Moment[] | null, strings: string[] | null) => void` | 无 | 否 | 选中变更回调；在单选/多选/区间选择、清空、点击预设后触发。受控模式下需在该回调中更新 `value`。|
| `mode` | `'single' | 'multiple' | 'range'` | `'multiple'` | 否 | 选择模式：单选/多选/区间。区间模式将自动填充开始到结束间的所有日期。|
| `disabledDate` | `(d: Moment) => boolean` | 无 | 否 | 禁用日期的判定函数；为 `true` 的日期不可选。异常将被安全捕获并视为未禁用。|
| `dateFormat` | `string` | `'YYYY-MM-DD'` | 否 | 值解析与输出格式；`value/defaultValue` 的字符串按照此格式解析；`onChange` 第二参数也按此格式输出。|
| `displayFormat` | `string` | `'MM-DD'` | 否 | 输入内标签与外部标签的展示格式。|
| `placeholder` | `string` | `'请选择日期'` | 否 | 输入框占位文本。|
| `presets` | `{ label: React.ReactNode, value: string[] | Moment[] | string | Moment | (() => any) }[]` | 无 | 否 | 预设列表；`value` 可为静态值或函数（返回值将被解析为日期集合）。被禁用的日期将被过滤。|
| `renderButton` | `(preset, onClick: () => void, index: number) => React.ReactNode` | 无 | 否 | 预设项自定义渲染。若提供则用于渲染预设按钮，`onClick` 为应用预设的回调。|
| `renderExtraFooter` | `() => React.ReactNode` | 无 | 否 | 在面板底部渲染额外内容。|
| `locale` | `string` | 无 | 否 | 透传给 `moment` 的语言环境（影响星期排序与本地化）。|
| `weekdayFormat` | `'short' | 'zhou' | 'xingqi'` | `'zhou'` | 否 | 星期头显示格式：`short` 显示 `日/一/...`，`zhou` 显示 `周日/周一/...`，`xingqi` 显示 `星期日/...`。|
| `maxTagCount` | `number` | `2` | 否 | 输入框内展示的日期标签数量上限，超出部分以 `+N` 显示。|
| `yearRange` | `[number, number]` | `当前年±10` | 否 | 年份选择范围（闭区间）。传入非法范围时回退为默认。|

特殊属性使用示例：

- 预设与自定义按钮：

```jsx
const presets = [
  { label: '本周', value: () => [moment().startOf('week'), moment().endOf('week')] },
  { label: '今天', value: moment() },
];

<MultiDatePicker
  mode="range"
  presets={presets}
  renderButton={(preset, onClick) => (
    <button className="ant-btn ant-btn-sm" onClick={onClick}>
      {preset.label}
    </button>
  )}
/>
```

## 方法（对外暴露）

组件未通过 `ref` 暴露实例方法；当前版本不提供对外可调用的方法接口。

## 事件（回调）

| 事件名 | 触发条件 | 回调参数 |
| --- | --- | --- |
| `onChange` | 选择或取消选择日期；点击清空按钮；应用预设；在单选/多选/区间模式下的任意变更 | `(dates: Moment[] | null, strings: string[] | null)`：分别为选中日期的 `Moment` 数组与按 `dateFormat` 格式化后的字符串数组；当无选中时传 `null` |

## 模式切换说明

- 传入 `value` 时进入受控模式；由外部状态驱动 UI
- 未传入 `value` 时为非受控模式；内部维护自身状态
- `defaultValue` 仅在非受控模式首次渲染时应用，后续不会覆盖交互产生的内部状态
- 两种模式可平滑切换，互不影响

## 无障碍与响应式

- 使用 ARIA 属性：输入容器 `role="combobox"`、日历网格 `role="grid"`、弹层 `role="dialog"`
- 支持键盘导航：方向键移动，`Enter/Space` 选择，`Esc` 关闭，`PageUp/PageDown` 切月，`Home/End` 跳至月首/末
- 支持 `prefers-reduced-motion`，在用户偏好减少动效时禁用动画
- 小屏场景收紧间距与字体，保证可读性与可操作性

## 复制可用示例

```jsx
<MultiDatePicker
  mode="multiple"
  placeholder="请选择日期"
  dateFormat="YYYY-MM-DD"
  displayFormat="MM-DD"
  weekdayFormat="zhou"
  maxTagCount={3}
  yearRange={[2020, 2030]}
  onChange={(dates, strings) => console.log(dates, strings)}
/>
```

## 类型与一致性说明

- 组件为 JS 实现，当前未提供 TypeScript 类型声明文件（`index.d.ts`）。文档中的类型说明基于源码行为，并与 `PropTypes` 定义保持一致。
- 若后续需要类型声明，可按本文档的类型形状补充 TS 定义，以便消费方编辑器获得智能提示与校验能力。

## 校验与注意事项

- 文档中的示例来自源码接口，确保可复制使用；使用前请确认 `moment` 语言环境与日期格式一致
- 在受控模式中请确保 `onChange` 中同步更新 `value`；否则 UI 与外部状态可能不一致
- `disabledDate` 异常将被捕获并忽略，建议在函数内保证健壮性
