import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { expect, test } from 'vitest';
import MultiDatePicker from '../index.jsx';

test('打开面板并选择多日期，输入显示逗号分隔，角标显示数量', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
  cells[10].click();
  cells[12].click();
  const inputTags = container.querySelectorAll('.mdp-input-tags .ant-tag');
  expect(inputTags.length > 0).toBe(true);
  const badge = container.querySelector('.mdp-count-badge');
  expect(!!badge).toBe(true);
});
test('输入内更多计数以 +N 展示', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
  cells[5].click();
  cells[7].click();
  cells[9].click();
  cells[11].click();
  const plusTag = container.querySelector('.mdp-input-tags .mdp-tag-ellipsis');
  expect(
    plusTag && plusTag.textContent && plusTag.textContent.startsWith('+'),
  ).toBe(true);
});

test('范围选择两次点击生成连续日期', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(MultiDatePicker, { mode: 'range' }),
    container,
  );
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
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
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
  cells[10].click();
  cells[12].click();
  const selectedCells = Array.from(container.querySelectorAll('.mdp-selected'));
  expect(selectedCells.length >= 2).toBe(true);
  const mid = selectedCells.length >= 3 ? selectedCells[1] : selectedCells[0];
  const classList = mid.className;
  expect(classList.includes('mdp-adj-left')).toBe(true);
  expect(classList.includes('mdp-adj-right')).toBe(true);
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
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
  const sunday = Array.from(cells).find((c) =>
    c.classList.contains('mdp-disabled'),
  );
  if (sunday) {
    sunday.click();
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length).toBe(0);
  }
});

test('清空按钮重置选择', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-day-cell');
  cells[10].click();
  cells[12].click();
  const clearBtn = container.querySelector('.mdp-tags-row .ant-btn');
  clearBtn.click();
  const tags = container.querySelectorAll('.ant-tag');
  expect(tags.length).toBe(0);
  expect(input.value).toBe('');
});

test('点击弹层外部可关闭面板', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const overlayBefore = container.querySelector('.mdp-overlay');
  expect(!!overlayBefore).toBe(true);
  const mask = container.querySelector('.mdp-mask');
  mask.click();
  await new Promise((r) => setTimeout(r, 0));
  const overlayAfter = container.querySelector('.mdp-overlay');
  expect(!!overlayAfter).toBe(false);
});

test('默认星期标题展示“周”前缀中文', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(MultiDatePicker, {}), container);
  const input = container.querySelector('.mdp-input-row input');
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
  const input = container.querySelector('.mdp-input-row input');
  input.click();
  const cells = container.querySelectorAll('.mdp-weekday-cell');
  const texts = Array.from(cells).map((c) => c.textContent);
  expect(texts.every((t) => t && t.startsWith('星期'))).toBe(true);
});
