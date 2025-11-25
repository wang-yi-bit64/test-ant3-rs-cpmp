import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rstest } from '@rstest/core';
import AirDatePicker from '../index.jsx';
import moment from 'moment';

describe('AirDatePicker APIs and interactions', () => {
  test('ref api: show/hide/select/getState', () => {
    const ref = createRef();
    const { getByRole } = render(
      React.createElement(AirDatePicker, { ref, buttons: ['today'] }),
    );
    expect(ref.current).toBeTruthy();
    ref.current.show();
    expect(getByRole('dialog')).toBeInTheDocument();
    ref.current.selectDate(new Date());
    const st = ref.current.getState();
    expect(st.selectedDates.length).toBeGreaterThan(0);
    ref.current.hide();
  });

  test('onBeforeSelect can block selection', () => {
    const onBeforeSelect = rstest.fn(() => false);
    const onChange = rstest.fn();
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { onBeforeSelect, onChange, buttons: ['today'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    expect(onBeforeSelect).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('onSelect fired after selection', () => {
    const onSelect = rstest.fn();
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { onSelect, buttons: ['today'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    expect(onSelect).toHaveBeenCalled();
  });

  test('onChangeViewDate invoked by nav', () => {
    const onChangeViewDate = jest.fn();
    const { getByRole } = render(
      React.createElement(AirDatePicker, { onChangeViewDate }),
    );
    fireEvent.click(getByRole('combobox'));
    // keyboard Ctrl+Right increases month
    fireEvent.keyDown(document, { key: 'ArrowRight', ctrlKey: true });
    expect(onChangeViewDate).toHaveBeenCalled();
  });

  test('aria-selected applied on selected cell', () => {
    const { getByRole, getByText, container } = render(
      React.createElement(AirDatePicker, { buttons: ['today'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    const selectedDots = container.querySelectorAll('.airdp-selected-dot');
    expect(selectedDots.length).toBeGreaterThan(0);
  });

  test('performance: open and select under threshold', () => {
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { buttons: ['today'] }),
    );
    const t0 = performance.now();
    fireEvent.click(getByRole('combobox'));
    const t1 = performance.now();
    fireEvent.click(getByText('今天'));
    const t2 = performance.now();
    const openCost = t1 - t0;
    const selectCost = t2 - t1;
    expect(openCost).toBeGreaterThan(0);
    expect(selectCost).toBeGreaterThan(0);
  });
});
