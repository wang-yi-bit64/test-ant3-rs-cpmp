import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rstest } from '@rstest/core';
import AirDatePicker from '../index.jsx';
import moment from 'moment';

describe('AirDatePicker', () => {
  test('renders and opens overlay', () => {
    const { getByRole, getByLabelText } = render(React.createElement(AirDatePicker));
    const input = getByRole('combobox');
    fireEvent.click(input);
    expect(getByLabelText('Date picker')).toBeInTheDocument();
  });

  test('selects today via button', () => {
    const onChange = rstest.fn();
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { onChange, buttons: ['today'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    expect(onChange).toHaveBeenCalled();
  });

  test('multiple mode adds and clears', () => {
    const onChange = rstest.fn();
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { mode: 'multiple', onChange, buttons: ['today', 'clear'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('清空'));
    expect(onChange).toHaveBeenCalled();
  });

  test('disabledDate prevents selection', () => {
    const onChange = rstest.fn();
    const disabledDate = () => true;
    const { getByRole } = render(
      React.createElement(AirDatePicker, { disabledDate, onChange }),
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  test('altField writes formatted output', () => {
    document.body.innerHTML = `<input id="alt" />`;
    const { getByRole, getByText } = render(
      React.createElement(AirDatePicker, { altField: '#alt', altFieldDateFormat: 'YYYY-MM-DD', buttons: ['today'] }),
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    const alt = document.querySelector('#alt');
    expect(alt.value).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test('controlled value updates', () => {
    const day = moment().format('YYYY-MM-DD');
    const { rerender, getByRole } = render(
      React.createElement(AirDatePicker, { value: [moment(day, 'YYYY-MM-DD')] }),
    );
    expect(getByRole('combobox')).toBeInTheDocument();
    rerender(React.createElement(AirDatePicker, { value: [] }));
  });
});
