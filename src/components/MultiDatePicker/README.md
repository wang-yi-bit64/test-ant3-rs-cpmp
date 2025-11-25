# MultiDatePicker (AntD v3 风格)

- 支持多选不连续日期，点击日期进行选择/取消
- 顶部显示已选数量，支持键盘导航（Ctrl+方向键切换月份/年份，Esc 关闭）
- 返回 `Date[]`，支持 `defaultValue` 初始化，`onChange` 回调返回当前选中日期

## 使用示例

```jsx
import React, { useState } from "react"
import MultiDatePicker from "./index.jsx"

export default function Demo() {
  const [dates, setDates] = useState([])
  return (
    <MultiDatePicker value={dates} onChange={setDates} placeholder="请选择日期" />
  )
}
```

## Props
- `value?: Date[]`
- `defaultValue?: Date[]`
- `onChange?: (dates: Date[]) => void`
- `disabledDate?: (date) => boolean`
- `placeholder?: string`
- `size?: "small" | "default" | "large"`
- `className?: string`
- `style?: React.CSSProperties`

