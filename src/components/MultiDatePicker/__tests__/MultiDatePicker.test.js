import { fireEvent, render } from '@testing-library/react';
import React from 'react';
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
import MultiDatePicker from '../index';

test('opens overlay and toggles multiple dates', () => {
  const onChange = rstest.fn();
  const { getByRole, getByLabelText, container } = render(
    React.createElement(MultiDatePicker, { onChange })
  );
  fireEvent.click(getByRole('combobox'));
  expect(getByLabelText('Multiple date picker')).toBeInTheDocument();
  const cells = container.querySelectorAll('.mdp-day-cell');
  fireEvent.click(cells[10]);
  fireEvent.click(cells[12]);
  expect(onChange).toHaveBeenCalled();
});

test('shows selected count in badge', () => {
  const { getByRole, container } = render(React.createElement(MultiDatePicker, null));
  fireEvent.click(getByRole('combobox'));
  const cells = container.querySelectorAll('.mdp-day-cell');
  fireEvent.click(cells[5]);
  fireEvent.click(cells[6]);
  const badge = container.querySelector('.mdp-badge-count');
  expect(badge).toBeInTheDocument();
  expect(badge.textContent).toBe('2');
});

test('defaultValue initializes selection', () => {
  const today = new Date();
  const { getByRole, getByText } = render(
    React.createElement(MultiDatePicker, { defaultValue: [today] })
  );
  expect(getByRole('combobox')).toBeInTheDocument();
  expect(getByText(today.toISOString().slice(0, 10))).toBeInTheDocument();
});

test('maxCount limits selection', () => {
  const { getByRole, container } = render(React.createElement(MultiDatePicker, { maxCount: 1 }))
  fireEvent.click(getByRole('combobox'))
  const cells = container.querySelectorAll('.mdp-day-cell')
  fireEvent.click(cells[2])
  fireEvent.click(cells[3])
  const badge = container.querySelector('.mdp-badge-count');
  expect(badge).toBeInTheDocument();
  expect(badge.textContent).toBe('1');
})

test('clear button resets selection', () => {
  const { getByRole, getByText, container } = render(React.createElement(MultiDatePicker, null));
  fireEvent.click(getByRole('combobox'));
  const cells = container.querySelectorAll('.mdp-day-cell');
  fireEvent.click(cells[0]);
  
  const clearBtn = getByText('清除');
  fireEvent.click(clearBtn);
  
  const badge = container.querySelector('.mdp-badge-count');
  expect(badge).not.toBeInTheDocument();
});
