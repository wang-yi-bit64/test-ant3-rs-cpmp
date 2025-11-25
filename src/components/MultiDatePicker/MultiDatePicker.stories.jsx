import React, { useState } from 'react'
import MultiDatePicker from './index.jsx'

export default { title: 'Components/MultiDatePicker' }

export const Basic = () => {
  const [dates, setDates] = useState([])
  return (
    <div style={{ padding: 24 }}>
      <MultiDatePicker value={dates} onChange={setDates} placeholder="请选择日期" />
      <div style={{ marginTop: 12 }}>当前选中：{dates.map(d => d.toISOString().slice(0,10)).join(', ')}</div>
    </div>
  )
}

export const WithMaxCount = () => {
  const [dates, setDates] = useState([])
  return (
    <div style={{ padding: 24 }}>
      <MultiDatePicker value={dates} onChange={setDates} placeholder="最多 2 个" maxCount={2} />
    </div>
  )
}

export const English = () => {
  const [dates, setDates] = useState([])
  return (
    <div style={{ padding: 24 }}>
      <MultiDatePicker value={dates} onChange={setDates} placeholder="Select" locale="en-US" />
    </div>
  )
}

