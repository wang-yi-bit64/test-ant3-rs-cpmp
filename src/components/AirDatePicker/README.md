# AirDatePicker

- 基于 Air Datepicker 规范、对齐 AntD v3 风格的日期选择组件
- 支持单选、范围、多选、自定义格式、国际化、禁用日期、快捷选择
- 兼容 React 16/17 Hooks；支持与 AntD v3 Form 集成（受控/非受控）

## 安装与引入

```jsx
import AirDatePicker from '@/components/AirDatePicker/DatePicker.jsx'
import '@/components/AirDatePicker/index.css'
```

## 基本用法

```jsx
<AirDatePicker />
```

## 受控模式

```jsx
const [val, setVal] = useState([])
<AirDatePicker value={val} onChange={setVal} />
```

## 范围与多选

```jsx
<AirDatePicker mode="range" />
<AirDatePicker mode="multiple" />
```

## 时间与格式

```jsx
<AirDatePicker showTime format="YYYY-MM-DD HH:mm" timeFormat="HH:mm" />
<AirDatePicker valueType="string" valueFormat="yyyy-MM-dd" />
```

## 快捷与自定义按钮

```jsx
const shortcuts = [
  { label: '本月', getValue: () => [moment().startOf('month'), moment().endOf('month')] },
]
const buttons = ['today', 'clear', { content: '跳到今天', onClick: ({ selectDate }) => selectDate(new Date()) }]
<AirDatePicker shortcuts={shortcuts} buttons={buttons} />
```

## 表单集成

```jsx
<Form>
  <Form.Item label="日期">
    <AirDatePicker mode="range" />
  </Form.Item>
</Form>
```

## Props 概览

- `mode`: `single | range | multiple`
- `showTime`, `onlyTimepicker`, `timeFormat`, `dateTimeSeparator`
- `minHours`, `maxHours`, `minMinutes`, `maxMinutes`, `hoursStep`, `minutesStep`
- `format`, `valueFormat`, `valueType`
- `disabled`, `disabledDate`, `minDate`, `maxDate`
- `locale`: `zhCN | enUS`
- `position`, `buttons`, `onRenderCell`, `shortcuts`
- `onShow`, `onHide`, `onPanelChange`, `keyboardNav`, `toggleSelected`
- `altField`, `altFieldDateFormat`

## API（ref）

- `show()` / `hide()`
- `selectDate(date)` / `setViewDate(date)`
- `update(opts)` / `getState()`

## 无障碍与性能

- 使用 ARIA 属性与键盘导航；使用 `memo`/缓存减少重渲染

## 选中态与区间态（AntD 风格）

- 单选/多选选中：为日期单元格添加 `airdp-selected`；白字+蓝底对比度≥4.5:1
- 区间选中：区间首尾分别添加 `airdp-selected-start`、`airdp-selected-end`，区间内为 `airdp-in-range`
- 悬浮态：与 AntD 一致的浅蓝背景；单元格具备 `aria-selected` 属性以提升可访问性
