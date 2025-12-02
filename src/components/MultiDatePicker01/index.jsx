import { Button, Icon, Input, Tag } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './index.css';

/**
 * 基于 Ant Design 3.26.20 的多选日期选择器组件
 * 实现自定义日历面板，支持多日期选择、键盘导航、预设功能等
 */

const MultiDatePicker = ({
  value,
  defaultValue,
  onChange,
  disabledDate,
  placeholder = '请选择日期',
  size = 'default',
  className,
  style,
  locale = 'zh-CN',
  format = 'MM-DD',
  presets,
  renderExtraFooter,
  disabled,
  readOnly,
  name,
  id,
  required,
}) => {
  // 状态管理
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(() => {
    const initialValue = value || defaultValue || [];
    return safeToMomentArray(initialValue);
  });
  const [viewDate, setViewDate] = useState(moment());
  const [focusedDate, setFocusedDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const rootRef = useRef(null);
  const calendarRef = useRef(null);

  // 内置预设选项
  const builtInPresets = useMemo(
    () => [
      {
        label: '今天',
        value: [moment()],
      },
      {
        label: '最近7天',
        value: () => {
          const dates = [];
          for (let i = 6; i >= 0; i--) {
            dates.push(moment().subtract(i, 'days'));
          }
          return dates;
        },
      },
      {
        label: '本周',
        value: () => {
          const startOfWeek = moment().startOf('week');
          const dates = [];
          for (let i = 0; i < 7; i++) {
            dates.push(startOfWeek.clone().add(i, 'days'));
          }
          return dates;
        },
      },
      {
        label: '本月',
        value: () => {
          const startOfMonth = moment().startOf('month');
          const endOfMonth = moment().endOf('month');
          const dates = [];
          const current = startOfMonth.clone();
          while (current.isSameOrBefore(endOfMonth, 'day')) {
            dates.push(current.clone());
            current.add(1, 'day');
          }
          return dates;
        },
      },
    ],
    [locale],
  );

  // 安全的日期转换函数
  const safeToMoment = (dateValue) => {
    if (!dateValue) return null;
    const m = moment(dateValue);
    return m.isValid() ? m : null;
  };

  const safeToMomentArray = (dateArray) => {
    if (!Array.isArray(dateArray)) return [];
    return dateArray
      .map(safeToMoment)
      .filter(Boolean)
      .sort((a, b) => a.valueOf() - b.valueOf());
  };

  // 国际化配置
  const i18n = useMemo(() => {
    const dict = {
      'zh-CN': {
        choose: '请选择日期',
        clear: '清空',
        today: '今天',
        thisWeek: '本周',
        thisMonth: '本月',
        last7Days: '最近7天',
      },
      'en-US': {
        choose: 'Select date(s)',
        clear: 'Clear',
        today: 'Today',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        last7Days: 'Last 7 Days',
      },
    };
    return dict[locale] || dict['zh-CN'];
  }, [locale]);

  // 监听外部值变化
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDates(safeToMomentArray(value));
    }
  }, [value]);

  // 触发变化事件
  const triggerChange = useCallback(
    (dates) => {
      const sortedDates = dates.sort((a, b) => a.valueOf() - b.valueOf());
      const dateStrings = sortedDates.map((d) => d.format('YYYY-MM-DD'));

      if (onChange) {
        onChange(sortedDates, dateStrings);
      }

      if (value === undefined) {
        setSelectedDates(sortedDates);
      }
    },
    [onChange, value],
  );

  // 切换日期选择
  const toggleDate = useCallback(
    (date) => {
      if (disabled || readOnly) return;

      const momentDate = safeToMoment(date);
      if (!momentDate) return;

      const dateKey = momentDate.format('YYYY-MM-DD');
      const isSelected = selectedDates.some(
        (d) => d.format('YYYY-MM-DD') === dateKey,
      );

      let newDates;
      if (isSelected) {
        newDates = selectedDates.filter(
          (d) => d.format('YYYY-MM-DD') !== dateKey,
        );
      } else {
        newDates = [...selectedDates, momentDate];
      }

      triggerChange(newDates);
    },
    [selectedDates, triggerChange, disabled, readOnly],
  );

  // 清空选择
  const clearSelection = useCallback(() => {
    triggerChange([]);
  }, [triggerChange]);

  // 处理预设选择
  const handlePresetSelect = useCallback(
    (presetValue) => {
      const dates =
        typeof presetValue === 'function' ? presetValue() : presetValue;
      const validDates = safeToMomentArray(dates);
      triggerChange(validDates);
      setOpen(false);
    },
    [triggerChange],
  );

  // 检查日期是否禁用
  const isDateDisabled = useCallback(
    (date) => {
      if (disabledDate && disabledDate(date)) {
        return true;
      }
      return false;
    },
    [disabledDate],
  );

  // 键盘导航处理
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (!focusedDate) return;

      let newFocusedDate = focusedDate.clone();
      let shouldPreventDefault = true;

      switch (e.key) {
        case 'ArrowUp':
          newFocusedDate.subtract(7, 'days');
          break;
        case 'ArrowDown':
          newFocusedDate.add(7, 'days');
          break;
        case 'ArrowLeft':
          newFocusedDate.subtract(1, 'day');
          break;
        case 'ArrowRight':
          newFocusedDate.add(1, 'day');
          break;
        case 'PageUp':
          newFocusedDate.subtract(1, 'month');
          break;
        case 'PageDown':
          newFocusedDate.add(1, 'month');
          break;
        case 'Home':
          newFocusedDate = focusedDate.clone().startOf('month');
          break;
        case 'End':
          newFocusedDate = focusedDate.clone().endOf('month');
          break;
        case 'Enter':
        case ' ':
          toggleDate(focusedDate);
          shouldPreventDefault = true;
          break;
        case 'Escape':
          setOpen(false);
          break;
        default:
          shouldPreventDefault = false;
      }

      if (shouldPreventDefault) {
        e.preventDefault();
      }

      if (newFocusedDate !== focusedDate) {
        setFocusedDate(newFocusedDate);
        // 如果新焦点日期不在当前视图月份，切换到对应月份
        if (!newFocusedDate.isSame(viewDate, 'month')) {
          setViewDate(newFocusedDate.clone().startOf('month'));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedDate, viewDate, toggleDate]);

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // 面板打开时的焦点管理
  useEffect(() => {
    if (open) {
      // 设置初始焦点：有选中日期则聚焦最后一个，否则聚焦今天
      const initialFocusDate =
        selectedDates.length > 0
          ? selectedDates[selectedDates.length - 1]
          : moment();
      setFocusedDate(initialFocusDate);

      if (!initialFocusDate.isSame(viewDate, 'month')) {
        setViewDate(initialFocusDate.clone().startOf('month'));
      }
    }
  }, [open]);

  // 生成月份日历
  const generateCalendar = useCallback(() => {
    const startOfMonth = viewDate.clone().startOf('month').startOf('week');
    const endOfMonth = viewDate.clone().endOf('month').endOf('week');

    const calendar = [];
    const current = startOfMonth.clone();

    while (current.isBefore(endOfMonth)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(current.clone());
        current.add(1, 'day');
      }
      calendar.push(week);
    }

    return calendar;
  }, [viewDate]);

  // 渲染日期单元格
  const renderDateCell = useCallback(
    (date) => {
      const isToday = date.isSame(moment(), 'day');
      const isSelected = selectedDates.some((d) => d.isSame(date, 'day'));
      const isDisabled = isDateDisabled(date);
      const isCurrentMonth = date.isSame(viewDate, 'month');
      const isFocused = focusedDate && focusedDate.isSame(date, 'day');

      const classNames = ['mdp-date-cell'];
      if (isToday) classNames.push('mdp-today');
      if (isSelected) classNames.push('mdp-selected');
      if (isDisabled) classNames.push('mdp-disabled');
      if (!isCurrentMonth) classNames.push('mdp-other-month');
      if (isFocused) classNames.push('mdp-focused');

      return (
        <div
          key={date.format('YYYY-MM-DD')}
          className={classNames.join(' ')}
          onClick={() => !isDisabled && toggleDate(date)}
          onMouseEnter={() => !isDisabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          aria-selected={isSelected}
          aria-disabled={isDisabled}
          tabIndex={isFocused ? 0 : -1}
        >
          {date.date()}
        </div>
      );
    },
    [selectedDates, viewDate, focusedDate, isDateDisabled, toggleDate],
  );

  // 渲染星期标题
  const renderWeekDays = useCallback(() => {
    const weekDays =
      locale === 'zh-CN'
        ? ['日', '一', '二', '三', '四', '五', '六']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return weekDays.map((day) => (
      <div key={day} className="mdp-week-day">
        {day}
      </div>
    ));
  }, [locale]);

  // 输入框显示文本
  const inputValue = useMemo(() => {
    if (selectedDates.length === 0) return '';
    return selectedDates.map((date) => date.format(format)).join(', ');
  }, [selectedDates, format]);

  return (
    <div className="mdp-root" ref={rootRef}>
      {/* 隐藏的表单字段 */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedDates.map((d) => d.format('YYYY-MM-DD')).join(',')}
          required={required}
        />
      )}

      {/* 输入框触发器 */}
      <Input
        value={inputValue}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        className={`mdp-input ${className || ''}`}
        style={style}
        id={id}
        suffix={
          selectedDates.length > 0 ? (
            <Icon
              type="close-circle"
              onClick={clearSelection}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Icon type="calendar" />
          )
        }
        onClick={() => !disabled && !readOnly && setOpen(true)}
      />

      {/* Tag 标签展示区 */}
      {selectedDates.length > 0 && (
        <div className="mdp-tags-container">
          {selectedDates.map((date, index) => (
            <Tag
              key={date.format('YYYY-MM-DD')}
              closable
              onClose={() => toggleDate(date)}
              className="mdp-tag"
            >
              {date.format('YYYY-MM-DD')}
            </Tag>
          ))}
          <Button
            type="link"
            size="small"
            onClick={clearSelection}
            className="mdp-clear-btn"
          >
            {i18n.clear}
          </Button>
        </div>
      )}

      {/* 日历面板 */}
      {open && (
        <div className="mdp-calendar-panel" ref={calendarRef}>
          {/* 月份导航 */}
          <div className="mdp-calendar-header">
            <Icon
              type="left"
              className="mdp-nav-btn"
              onClick={() => setViewDate(viewDate.clone().subtract(1, 'month'))}
            />
            <span className="mdp-current-month">
              {viewDate.format(locale === 'zh-CN' ? 'YYYY年MM月' : 'MMMM YYYY')}
            </span>
            <Icon
              type="right"
              className="mdp-nav-btn"
              onClick={() => setViewDate(viewDate.clone().add(1, 'month'))}
            />
          </div>

          {/* 星期标题 */}
          <div className="mdp-week-days">{renderWeekDays()}</div>

          {/* 日期网格 */}
          <div className="mdp-date-grid">
            {generateCalendar().map((week, weekIndex) => (
              <div key={weekIndex} className="mdp-week">
                {week.map(renderDateCell)}
              </div>
            ))}
          </div>

          {/* 预设选项 */}
          {(presets || builtInPresets.length > 0) && (
            <div className="mdp-presets">
              <div className="mdp-presets-title">快捷选择</div>
              <div className="mdp-presets-list">
                {(presets || builtInPresets).map((preset, index) => (
                  <Button
                    key={index}
                    type="link"
                    size="small"
                    onClick={() => handlePresetSelect(preset.value)}
                    className="mdp-preset-btn"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 自定义底部内容 */}
          {renderExtraFooter && (
            <div className="mdp-extra-footer">{renderExtraFooter()}</div>
          )}
        </div>
      )}
    </div>
  );
};

MultiDatePicker.propTypes = {
  value: PropTypes.array,
  defaultValue: PropTypes.array,
  onChange: PropTypes.func,
  disabledDate: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
  style: PropTypes.object,
  locale: PropTypes.oneOf(['zh-CN', 'en-US']),
  format: PropTypes.string,
  presets: PropTypes.array,
  renderExtraFooter: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
};

MultiDatePicker.defaultProps = {
  placeholder: '请选择日期',
  size: 'default',
  locale: 'zh-CN',
  format: 'MM-DD',
};

export default MultiDatePicker;
