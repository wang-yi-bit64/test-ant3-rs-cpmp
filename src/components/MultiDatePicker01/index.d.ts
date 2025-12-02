export type MultiDatePickerProps = {
  value?: Date[];
  defaultValue?: Date[];
  onChange?: (dates: Date[]) => void;
  disabledDate?: (date: any) => boolean;
  placeholder?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  style?: React.CSSProperties;
  maxCount?: number;
  locale?: 'zh-CN' | 'en-US';
};

declare const MultiDatePicker: React.FC<MultiDatePickerProps>;
export default MultiDatePicker;
