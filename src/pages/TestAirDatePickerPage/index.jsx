import { Button, Form } from 'antd';
import React, { useRef, useState } from 'react';
import AirDatePicker from '@/components/AirDatePicker/index.jsx';

const Demo = () => {
  const [val, setVal] = useState([]);
  const ref = useRef(null);

  return (
    <div style={{ padding: 24 }}>
      <h3>AirDatePicker Demo</h3>
      <AirDatePicker
        ref={ref}
        mode="multiple"
        showTime
        value={val}
        onChange={setVal}
        buttons={['today', 'clear']}
      />

      <div style={{ marginTop: 16 }}>
        <Button onClick={() => ref.current?.show()}>Open</Button>
        <Button onClick={() => ref.current?.hide()} style={{ marginLeft: 8 }}>
          Close
        </Button>
      </div>

      <h4 style={{ marginTop: 24 }}>AntD Form Integration (controlled)</h4>
      <Form>
        <Form.Item label="日期范围">
          <AirDatePicker mode="range" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Demo;
