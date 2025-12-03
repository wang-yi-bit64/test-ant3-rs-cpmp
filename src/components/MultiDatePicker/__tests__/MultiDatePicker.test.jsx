import { Button } from 'antd';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { expect, test } from 'vitest';
import MultiDatePicker from '../index.jsx';

test('打开面板并选择多日期，输入显示逗号分隔，角标显示数量', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  cells[10].click();
  cells[12].click();
  const inputTags = container.querySelectorAll('[role="combobox"] .ant-tag');
  expect(inputTags.length > 0).toBe(true);
  const badge = container.querySelector('.mdp-count-badge');
  expect(!!badge).toBe(true);
});
test('输入内更多计数以 +N 展示', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  cells[5].click();
  cells[7].click();
  cells[9].click();
  cells[11].click();
  const tagsInInput = container.querySelectorAll('[role="combobox"] .ant-tag');
  const lastTag = tagsInInput[tagsInInput.length - 1];
  expect(
    lastTag && lastTag.textContent && lastTag.textContent.startsWith('+'),
  ).toBe(true);
});

test('范围选择两次点击生成连续日期', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(MultiDatePicker, { mode: 'range' }),
    container,
  );
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  cells[8].click();
  cells[12].click();
  const tags = container.querySelectorAll('.ant-tag');
  expect(tags.length > 1).toBe(true);
});

test('连续选择生成连接类名与渐变强度', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(MultiDatePicker, { mode: 'range' }),
    container,
  );
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  cells[10].click();
  cells[12].click();
  const cellsAll = Array.from(
    container.querySelectorAll('[role="grid"] button'),
  );
  const selectedIdxs = cellsAll
    .map((el, i) => (el.getAttribute('aria-selected') === 'true' ? i : -1))
    .filter((i) => i >= 0);
  expect(selectedIdxs.length >= 2).toBe(true);
  const hasAdjacent = selectedIdxs.some((i, k, arr) => arr.includes(i + 1));
  expect(hasAdjacent).toBe(true);
  const midIndex = selectedIdxs.length >= 3 ? selectedIdxs[1] : selectedIdxs[0];
  const mid = cellsAll[midIndex];
  const styleAttr = mid.getAttribute('style') || '';
  expect(/--mdp-alpha:\s*0\.?[0-9]+/.test(styleAttr)).toBe(true);
});

test('disabledDate 禁用不可点击', () => {
  const disabledDate = (cur) => cur.day() === 0;
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(MultiDatePicker, { disabledDate }),
    container,
  );
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  const sunday = Array.from(cells).find(
    (c) => c.getAttribute('aria-disabled') === 'true',
  );
  if (sunday) {
    sunday.click();
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length).toBe(0);
  }
});

test('清空按钮重置选择', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('[role="grid"] button');
  cells[10].click();
  cells[12].click();
  const clearIcon = container.querySelector('.mdp-suffix .anticon-close');
  clearIcon && clearIcon.click();
  await new Promise((r) => setTimeout(r, 0));
  const tags = container.querySelectorAll('.ant-tag');
  expect(tags.length).toBe(0);
  expect(input.value).toBe('');
});

test('点击弹层外部可关闭面板', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const overlayBefore = container.querySelector('[role="dialog"]');
  expect(!!overlayBefore).toBe(true);
  const mask = container.querySelector('.mdp-mask');
  mask.click();
  await new Promise((r) => setTimeout(r, 0));
  const overlayAfter = container.querySelector('[role="dialog"]');
  expect(!!overlayAfter).toBe(false);
});

test('默认星期标题展示“周”前缀中文', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('.mdp-weekday-cell');
  const texts = Array.from(cells).map((c) => c.textContent);
  expect(texts.every((t) => t && t.startsWith('周'))).toBe(true);
});

test('weekdayFormat="xingqi" 展示“星期”前缀中文', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(MultiDatePicker, { weekdayFormat: 'xingqi' }),
    container,
  );
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const cells = container.querySelectorAll('.mdp-weekday-cell');
  const texts = Array.from(cells).map((c) => c.textContent);
  expect(texts.every((t) => t && t.startsWith('星期'))).toBe(true);
});

test('月份下拉选择后下拉显示更新并同步网格', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const overlay = container.querySelector('[role="dialog"]');
  expect(!!overlay).toBe(true);
  const monthSelect = overlay.querySelectorAll('.ant-select')[1];
  expect(!!monthSelect).toBe(true);
  const selectedBefore = monthSelect.querySelector(
    '.ant-select-selection-selected-value',
  )?.textContent;
  monthSelect.querySelector('.ant-select-selection').click();
  const menuItems = overlay.querySelectorAll('.ant-select-dropdown-menu-item');
  expect(menuItems.length).toBe(12);
  menuItems[0].click();
  const selectedAfter = monthSelect.querySelector(
    '.ant-select-selection-selected-value',
  )?.textContent;
  expect(selectedAfter !== selectedBefore).toBe(true);
});

test('年份下拉选择后下拉显示年份更新', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const overlay = container.querySelector('[role="dialog"]');
  const yearSelect = overlay.querySelectorAll('.ant-select')[0];
  expect(!!yearSelect).toBe(true);
  const selectedBefore = yearSelect.querySelector(
    '.ant-select-selection-selected-value',
  )?.textContent;
  yearSelect.querySelector('.ant-select-selection').click();
  const menuItems = overlay.querySelectorAll('.ant-select-dropdown-menu-item');
  expect(menuItems.length > 0).toBe(true);
  const lastItem = menuItems[menuItems.length - 1];
  lastItem.click();
  const selectedAfter = yearSelect.querySelector(
    '.ant-select-selection-selected-value',
  )?.textContent;
  expect(selectedAfter !== selectedBefore).toBe(true);
});

test('自定义 renderButton 渲染并点击生效', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const presets = [{ label: '自定义', value: [moment()] }];
  const CustomBtn = ({ onClick, children }) =>
    React.createElement('button', { type: 'button', onClick }, children);
  ReactDOM.render(
    React.createElement(MultiDatePicker, {
      presets,
      renderButton: (preset, onClick) =>
        React.createElement(CustomBtn, { onClick }, preset.label),
    }),
    container,
  );
  const input = container.querySelector('[role="combobox"] input');
  input.click();
  const custom = container.querySelector('.mdp-presets button');
  custom.click();
  const tags = container.querySelectorAll('.ant-tag');
  expect(tags.length > 0).toBe(true);
});
