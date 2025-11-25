import { Moment } from 'moment';
import * as React from 'react';

export type AirDatePickerMode = 'single' | 'range' | 'multiple';
export type AirDatePickerLocale = 'zhCN' | 'enUS';

export interface ShortcutItem {
  label: string;
  getValue: () => Array<Date | Moment | string | number>;
}

export interface AirDatePickerProps {
  value?: Moment[] | string;
  defaultValue?: Moment[] | Moment | string;
  onChange?: (value: Moment[] | string) => void;
  mode?: AirDatePickerMode;
  showTime?: boolean;
  onlyTimepicker?: boolean;
  timeFormat?: string;
  dateTimeSeparator?: string;
  minHours?: number;
  maxHours?: number;
  minMinutes?: number;
  maxMinutes?: number;
  hoursStep?: number;
  minutesStep?: number;
  disabled?: boolean;
  disabledDate?: (current: Moment) => boolean;
  minDate?: Moment;
  maxDate?: Moment;
  locale?: AirDatePickerLocale;
  format?: string;
  valueFormat?: string;
  valueType?: 'array' | 'string';
  placeholder?: string;
  size?: 'small' | 'default' | 'large';
  style?: React.CSSProperties;
  className?: string;
  datePickerProps?: Record<string, any>;
  position?:
    | string
    | ((ctx: {
        $datepicker: HTMLDivElement;
        $target: HTMLElement;
        $pointer: HTMLElement | null;
        isViewChange: boolean;
        done: () => void;
      }) => void);
  buttons?: (
    | string
    | {
        content?: string | ((ctx: { opts: AirDatePickerProps }) => string);
        className?: string;
        onClick?: (api: {
          selectDate: (date: Date | string | number) => void;
          setViewDate: (date: Date | string | number) => void;
          update: (opts: Partial<AirDatePickerProps>) => void;
        }) => void;
      }
  )[];
  onRenderCell?: (args: { date: Date; cellType: 'day' | 'month' | 'year' }) => {
    html?: string;
    classes?: string;
    disabled?: boolean;
    attrs?: Record<string, string | number | undefined>;
  };
  onShow?: (isFinished: boolean) => void;
  onHide?: (isFinished: boolean) => void;
  keyboardNav?: boolean;
  toggleSelected?:
    | boolean
    | ((ctx: { datepicker: any; date: Date }) => boolean);
  selectedDates?: Moment[];
  altField?: string | HTMLInputElement;
  altFieldDateFormat?: string | ((date: Date) => string);
  onPanelChange?: (moment: Moment) => void;
  shortcuts?: ShortcutItem[];
}

declare const AirDatePicker: React.ForwardRefExoticComponent<
  AirDatePickerProps &
    React.RefAttributes<{
      show: () => void;
      hide: () => void;
      selectDate: (date: Date | string | number) => void;
      setViewDate: (date: Date | string | number) => void;
      update: (opts: Partial<AirDatePickerProps>) => void;
      getState: () => {
        viewDate: Moment;
        selectedDates: Moment[];
        visible: boolean;
      };
    }>
>;

export default AirDatePicker;
