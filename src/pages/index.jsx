import { Button } from 'antd';
import React, { useState } from 'react';
import TestAirDatePickerPage from './TestAirDatePickerPage';
import TestMultiDatePickerPage from '@/components/MultiDatePicker/demo';
function IndexPages() {
  const [activeTab, setActiveTab] = useState('multi');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button
          onClick={() => setActiveTab('air')}
          type={activeTab === 'air' ? 'primary' : 'default'}
        >
          AirDatePicker (Hooks)
        </Button>
         <Button
          onClick={() => setActiveTab('multi')}
          type={activeTab === 'air' ? 'primary' : 'default'}
        >
          MultiDatePicker (Hooks)
        </Button>
      </div>
      {activeTab === 'air' && <TestAirDatePickerPage />}
      {activeTab === 'multi' && <TestMultiDatePickerPage />}
    </div>
  );
}

export default IndexPages;
