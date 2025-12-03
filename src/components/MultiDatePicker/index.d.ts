import { Moment } from 'moment';
import { ReactNode } from 'react';

export type MultiDateMode = 'single' | 'multiple' | 'range';

export interface MultiDatePreset {
  label: ReactNode;
  value: Moment[] | (() => Moment[]);
}

export interface MultiDatePickerProps {
  value?: Moment[] | string[] | null;
  onChange?: (dates: Moment[] | null, dateStrings: string[] | null) => void;
  mode?: MultiDateMode;
  disabledDate?: (current: Moment, info?: { type: string }) => boolean;
  dateFormat?: string;
  displayFormat?: string;
  placeholder?: string;
  presets?: MultiDatePreset[];
  renderButton?: (
    preset: MultiDatePreset,
    onClick: () => void,
    index?: number,
  ) => ReactNode;
  renderExtraFooter?: () => ReactNode;
  locale?: string;
  weekdayFormat?: 'short' | 'zhou' | 'xingqi';
  maxTagCount?: number;
  yearRange?: [number, number];
}

declare const MultiDatePicker: (props: MultiDatePickerProps) => JSX.Element;

export default MultiDatePicker;
