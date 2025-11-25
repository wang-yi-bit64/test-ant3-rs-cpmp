import React, { useState } from 'react';
import MultiDatePicker from './index.jsx';

export default function Demo() {
  const [dates, setDates] = useState([]);
  return (
    <div>
      <h3>多选日期（AntD 3 风格）</h3>
      <MultiDatePicker
        value={dates}
        onChange={setDates}
        placeholder="请选择日期"
      />
      <div style={{ marginTop: 12 }}>
        当前选中：{dates.map((d) => d.toISOString().slice(0, 10)).join(', ')}
      </div>
    </div>
  );
}
