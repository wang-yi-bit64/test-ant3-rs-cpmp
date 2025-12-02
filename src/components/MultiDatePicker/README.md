# MultiDatePicker

## 概述
基于 AntD v3 的多日期选择组件，支持多选、范围、禁用与国际化格式显示，完全受控，兼容 AntD Form。

## 安装
依赖 `react@16`, `antd@3.x`, `moment@2.x`。

## 使用
```jsx
import React, { useState } from 'react'
import MultiDatePicker from '@/components/MultiDatePicker'

function Page() {
  const [val, setVal] = useState([])
  return (
    <MultiDatePicker value={val} onChange={(d) => setVal(d || [])} />
  )
}
```

## API
- `value?: Moment[] | string[] | null`
- `onChange?: (dates: Moment[] | null, dateStrings: string[] | null) => void`
- `mode?: 'single' | 'multiple' | 'range'` 默认 `multiple`
- `disabledDate?: (current: Moment, info?: { type: string }) => boolean`
- `dateFormat?: string` 默认 `YYYY-MM-DD`
- `displayFormat?: string` 默认 `MM-DD`
- `placeholder?: string`
- `presets?: Array<{ label: ReactNode, value: Moment[] | (() => Moment[]) }>`
- `renderExtraFooter?: () => ReactNode`
- `locale?: string`

## 无障碍
- 输入容器 `role="combobox"`，弹层 `role="dialog"`，网格 `role="grid"`
- 键盘导航：方向键、Enter/Space、PageUp/PageDown、Home/End、Esc

## 样式
- `index.css` 提供默认样式，与 AntD v3 风格一致，可按需覆盖。

## 示例
见 `demo.jsx`。

