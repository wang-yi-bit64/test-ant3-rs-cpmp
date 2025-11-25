import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { rstest } from '@rstest/core';
rstest.mock('antd', () => {
  const React = require('react')
  const moment = require('moment')
  const DatePicker = (props) => {
    const start = moment().startOf('month').startOf('week')
    const days = Array.from({ length: 42 }, (_, i) => start.clone().add(i, 'day'))
    return React.createElement(
      'div',
      { 'aria-label': 'Multiple date picker' },
      ...days.map((d, idx) => React.createElement('div', { key: idx, className: 'mdp-day-cell' }, props.dateRender(d)))
    )
  }
  const Icon = (props) => React.createElement('i', { 'data-icon': props.type })
  const Tag = (props) => React.createElement('span', null, props.children)
  return { DatePicker, Icon, Tag }
})
import MultiDatePicker from '../index.jsx';

test('opens overlay and toggles multiple dates', () => {
  const onChange = rstest.fn();
  const { getByRole, getByLabelText, getByText, container } = render(
    <MultiDatePicker onChange={onChange} />,
  );
  fireEvent.click(getByRole('combobox'));
  expect(getByLabelText('Multiple date picker')).toBeInTheDocument();
  const cells = container.querySelectorAll('.mdp-day-cell');
  fireEvent.click(cells[10]);
  fireEvent.click(cells[12]);
  expect(onChange).toHaveBeenCalled();
});

test('shows selected count on top', () => {
  const { getByRole, getByText, container } = render(<MultiDatePicker />);
  fireEvent.click(getByRole('combobox'));
  const cells = container.querySelectorAll('.mdp-day-cell');
  fireEvent.click(cells[5]);
  fireEvent.click(cells[6]);
  expect(getByText(/已选:\s*2/)).toBeInTheDocument();
});

test('defaultValue initializes selection', () => {
  const today = new Date();
  const { getByRole, getByText } = render(
    <MultiDatePicker defaultValue={[today]} />,
  );
  expect(getByRole('combobox')).toBeInTheDocument();
  expect(getByText(today.toISOString().slice(0, 10))).toBeInTheDocument();
});

test('maxCount limits selection', () => {
  const { getByRole, getByText, container } = render(<MultiDatePicker maxCount={1} />)
  fireEvent.click(getByRole('combobox'))
  const cells = container.querySelectorAll('.mdp-day-cell')
  fireEvent.click(cells[2])
  fireEvent.click(cells[3])
  expect(getByText(/已选:\s*1/)).toBeInTheDocument()
})
