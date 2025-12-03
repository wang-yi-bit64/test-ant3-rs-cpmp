import React from 'react';
import ReactDOM from 'react-dom';
import { describe, expect, test } from 'vitest';
import MultiDatePicker from '../index.jsx';

describe('MultiDatePicker uncontrolled mode', () => {
  test('initializes with defaultValue', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const now = new Date();
    const yyyy = String(now.getFullYear()).padStart(4, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const defaultValue = [`${yyyy}-${mm}-10`, `${yyyy}-${mm}-12`];
    ReactDOM.render(
      React.createElement(MultiDatePicker, { defaultValue }),
      container,
    );
    const input = container.querySelector('[role="combobox"] input');
    input.click();
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length >= 2).toBe(true);
  });

  test('updates internal state and calls onChange in uncontrolled', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let changeCalls = 0;
    ReactDOM.render(
      React.createElement(MultiDatePicker, {
        defaultValue: ['2024-01-10'],
        onChange: () => {
          changeCalls += 1;
        },
      }),
      container,
    );
    const input = container.querySelector('[role="combobox"] input');
    input.click();
    const cells = container.querySelectorAll('[role="grid"] button');
    cells[12].click();
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length >= 2).toBe(true);
    expect(changeCalls >= 1).toBe(true);
  });

  test('switches between uncontrolled and controlled smoothly', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(
      React.createElement(MultiDatePicker, { defaultValue: ['2024-01-10'] }),
      container,
    );
    ReactDOM.render(
      React.createElement(MultiDatePicker, {
        value: ['2024-02-05', '2024-02-06'],
        onChange: () => {},
      }),
      container,
    );
    const input = container.querySelector('[role="combobox"] input');
    input.click();
    const tagsControlled = container.querySelectorAll('.ant-tag');
    expect(tagsControlled.length >= 2).toBe(true);
    ReactDOM.render(
      React.createElement(MultiDatePicker, { onChange: () => {} }),
      container,
    );
    const input2 = container.querySelector('[role="combobox"] input');
    input2.click();
    const cells2 = container.querySelectorAll('[role="grid"] button');
    cells2[15].click();
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length >= 1).toBe(true);
  });
});
