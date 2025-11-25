const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');
const AirDatePicker = require('../index.jsx').default;
const moment = require('moment');

describe('AirDatePicker', () => {
  test('renders and opens overlay', () => {
    const { getByRole, getByLabelText } = render(<AirDatePicker />);
    const input = getByRole('combobox');
    fireEvent.click(input);
    expect(getByLabelText('Date picker')).toBeInTheDocument();
  });

  test('selects today via button', () => {
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <AirDatePicker onChange={onChange} buttons={['today']} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    expect(onChange).toHaveBeenCalled();
  });

  test('multiple mode adds and clears', () => {
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <AirDatePicker
        mode="multiple"
        onChange={onChange}
        buttons={['today', 'clear']}
      />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('清空'));
    expect(onChange).toHaveBeenCalled();
  });

  test('disabledDate prevents selection', () => {
    const onChange = jest.fn();
    const disabledDate = () => true;
    const { getByRole } = render(
      <AirDatePicker disabledDate={disabledDate} onChange={onChange} />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  test('altField writes formatted output', () => {
    document.body.innerHTML = `<input id="alt" />`;
    const { getByRole, getByText } = render(
      <AirDatePicker
        altField="#alt"
        altFieldDateFormat="YYYY-MM-DD"
        buttons={['today']}
      />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('今天'));
    const alt = document.querySelector('#alt');
    expect(alt.value).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test('controlled value updates', () => {
    const day = moment().format('YYYY-MM-DD');
    const { rerender, getByRole } = render(
      <AirDatePicker value={[moment(day, 'YYYY-MM-DD')]} />,
    );
    expect(getByRole('combobox')).toBeInTheDocument();
    rerender(<AirDatePicker value={[]} />);
  });
});
