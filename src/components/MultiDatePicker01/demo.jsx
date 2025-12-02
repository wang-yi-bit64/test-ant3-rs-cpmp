import React, { useState } from 'react';
import MultiDatePicker from './index.jsx';

export default function Demo() {
  const [dates, setDates] = useState([]);
  const [datesEn, setDatesEn] = useState([]);

  return (
    <div>
      <h3>多选日期（AntD 3 风格）</h3>

      <h4>中文 (zh-CN)</h4>
      <MultiDatePicker
        value={dates}
        onChange={setDates}
        locale="zh-CN"
        placeholder="请选择日期"
      />
      <div style={{ marginTop: 12 }}>
        当前选中：{dates.map((d) => d.toISOString().slice(0, 10)).join(', ')}
      </div>

      <h4 style={{ marginTop: 24 }}>English (en-US)</h4>
      <MultiDatePicker
        value={datesEn}
        onChange={setDatesEn}
        locale="en-US"
        placeholder="Select date(s)"
      />
      <div style={{ marginTop: 12 }}>
        Selected: {datesEn.map((d) => d.toISOString().slice(0, 10)).join(', ')}
      </div>
    </div>
  );
}
