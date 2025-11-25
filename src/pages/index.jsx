import { Button } from 'antd';
import React, { useState } from 'react';
import TestAirDatePickerPage from './TestAirDatePickerPage';

function IndexPages() {
  const [activeTab, setActiveTab] = useState('air');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button
          onClick={() => setActiveTab('air')}
          type={activeTab === 'air' ? 'primary' : 'default'}
        >
          AirDatePicker (Hooks)
        </Button>
      </div>
      {activeTab === 'air' && <TestAirDatePickerPage />}
    </div>
  );
}

export default IndexPages;
