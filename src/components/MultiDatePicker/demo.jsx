import { Form } from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import MultiDatePicker from './index.jsx';
import 'antd/dist/antd.css';

function Demo() {
  const [val, setVal] = useState([]);
  const presets = useMemo(
    () => [
      { label: '今天', value: [moment()] },
      {
        label: '本周',
        value: () => {
          const start = moment().startOf('week');
          const end = moment().endOf('week');
          const arr = [];
          let cur = start.clone();
          while (cur.isSameOrBefore(end, 'day')) {
            arr.push(cur.clone());
            cur = cur.add(1, 'day');
          }
          return arr;
        },
      },
      {
        label: '最近7天',
        value: () => {
          const arr = [];
          for (let i = 6; i >= 0; i -= 1) arr.push(moment().subtract(i, 'day'));
          return arr;
        },
      },
    ],
    [],
  );

  return (
    <div style={{ padding: 24 }}>
      <h3>MultiDatePicker Demo</h3>
      <MultiDatePicker
        value={val}
        onChange={(d, s) => setVal(d || [])}
        mode="multiple"
        displayFormat="YYYY-MM-DD"
        weekdayFormat="xingqi"
        placeholder="请选择日期"
        disabledDate={(d) => d.isBefore(moment().subtract(1, 'day'))}
      />
      <div style={{ marginTop: 16 }}>
        <Form>
          <Form.Item label="范围选择">
            <MultiDatePicker value={val} mode="multiple" />
          </Form.Item>
        </Form>
      </div>
      <MultiDatePicker
        mode="multiple"
        displayFormat="YYYY-MM-DD"
        weekdayFormat="xingqi"
        placeholder="请选择日期"
        disabledDate={(d) => d.isBefore(moment().subtract(1, 'day'))}
      />
    </div>
  );
}

export default Demo;
