import { DatePicker as AntDatePicker, Icon, Tag } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// 样式由使用者按需引入，测试环境不加载 CSS

/**
 * 多选日期组件（AntD v3 风格）。
 * 保留原有 DatePicker 基础功能，扩展不连续日期多选、键盘导航与最大选择数。
 * 返回值为 Date[]，支持受控与非受控模式。
 */

const MultiDatePicker = ({
  value,
  defaultValue,
  onChange,
  disabledDate,
  placeholder,
  size,
  className,
  style,
  maxCount,
  locale,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (Array.isArray(value) && value.length)
      return value.map((d) => moment(d));
    if (Array.isArray(defaultValue) && defaultValue.length)
      return defaultValue.map((d) => moment(d));
    return [];
  });
  const rootRef = useRef(null);

  const i18n = useMemo(() => {
    const dict = {
      'zh-CN': { choose: '请选择日期', selectedCount: '已选', close: '关闭', clear: '清除' },
      'en-US': { choose: 'Select date(s)', selectedCount: 'Selected', close: 'Close', clear: 'Clear' },
    };
    return dict[locale || 'zh-CN'];
  }, [locale]);

  useEffect(() => {
    if (Array.isArray(value)) setSelected(value.map((d) => moment(d)));
  }, [value]);

  const triggerChange = useCallback(
    (next) => {
      if (onChange) onChange(next.map((m) => m.toDate()));
    },
    [onChange],
  );

  const onToggleDate = useCallback(
    (date) => {
      const key = moment(date).format('YYYY-MM-DD');
      const exists = selected.some((m) => m.format('YYYY-MM-DD') === key);
      const next = exists
        ? selected.filter((m) => m.format('YYYY-MM-DD') !== key)
        : selected.length < (maxCount || Infinity)
          ? [...selected, moment(date)]
          : selected;
      next.sort((a, b) => a.valueOf() - b.valueOf());
      setSelected(next);
      triggerChange(next);
    },
    [selected, triggerChange, maxCount],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.ctrlKey && (e.key === 'ArrowRight' || e.key === 'ArrowUp')) {
        setViewDate((d) => d.clone().add(1, 'month'));
      }
      if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowDown')) {
        setViewDate((d) => d.clone().subtract(1, 'month'));
      }
      if (!e.ctrlKey && (e.key === 'Enter' || e.key === ' ')) {
        if (focusDate) onToggleDate(focusDate);
      }
      if (!e.ctrlKey && e.key === 'ArrowRight') setFocusDate((d) => (d ? d.clone().add(1, 'day') : moment()));
      if (!e.ctrlKey && e.key === 'ArrowLeft') setFocusDate((d) => (d ? d.clone().subtract(1, 'day') : moment()));
      if (!e.ctrlKey && e.key === 'ArrowUp') setFocusDate((d) => (d ? d.clone().subtract(7, 'day') : moment()));
      if (!e.ctrlKey && e.key === 'ArrowDown') setFocusDate((d) => (d ? d.clone().add(7, 'day') : moment()));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const [viewDate, setViewDate] = useState(moment());
  const [focusDate, setFocusDate] = useState(null);

  const dateCell = useCallback(
    (date) => {
      const isSelected = selected.some((m) => date.isSame(m, 'day'));
      const canPick = !(disabledDate && disabledDate(date));
      const classes = ['mdp-day-cell'];
      if (isSelected) classes.push('mdp-selected');
      const onClick = () => {
        if (canPick) onToggleDate(date);
      };
      const onEnter = () => setFocusDate(date);
      return (
        <div
          className={classes.join(' ')}
          onClick={onClick}
          onMouseEnter={onEnter}
          aria-selected={isSelected}
        >
          {date.date()}
          {isSelected && (
            <span className="mdp-selected-dot" aria-hidden="true" />
          )}
        </div>
      );
    },
    [selected, disabledDate, onToggleDate],
  );

  const renderSelectedText = useMemo(
    () => (
      <span className="mdp-text-value" title={selected.map((d) => d.format('YYYY-MM-DD')).join(',')}>
        {selected.map((d) => d.format('YYYY-MM-DD')).join(',')}
      </span>
    ),
    [selected],
  );

  return (
    <div className="mdp-root">
      <div
        ref={rootRef}
        className={`ant-input ${size === 'small' ? 'ant-input-sm' : size === 'large' ? 'ant-input-lg' : ''} ${className || ''} mdp-input`}
        role="combobox"
        aria-haspopup="grid"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        tabIndex={0}
        style={style}
      >
        <div className="mdp-input-content">
          {selected.length > 0 ? (
            renderSelectedText
          ) : (
            <span className="mdp-placeholder">
              {placeholder || i18n.choose}
            </span>
          )}
        </div>
        <Icon type="calendar" className="mdp-calendar-icon" />
        {selected.length > 0 && (
          <span className="mdp-badge-count">{selected.length}</span>
        )}
      </div>

      {open && (
        <div
          className="mdp-overlay"
          role="dialog"
          aria-label="Multiple date picker"
        >
          <div className="mdp-header">
            <div className="mdp-nav" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Icon
                type="double-left"
                onClick={() =>
                  setViewDate(viewDate.clone().subtract(1, 'year'))
                }
              />
              <Icon
                type="left"
                onClick={() =>
                  setViewDate(viewDate.clone().subtract(1, 'month'))
                }
              />
              <span className="mdp-header-label">{viewDate.format('YYYY年MM月')}</span>
              <Icon
                type="right"
                onClick={() => setViewDate(viewDate.clone().add(1, 'month'))}
              />
              <Icon
                type="double-right"
                onClick={() => setViewDate(viewDate.clone().add(1, 'year'))}
              />
            </div>
          </div>
          <AntDatePicker
            value={null}
            onChange={() => {}}
            open={true}
            disabledDate={disabledDate}
            dateRender={dateCell}
            placeholder={placeholder}
            showTime={false}
            style={{ width: '100%' }}
          />
          <div className="mdp-footer">
            <a
              className="mdp-clear-btn"
              onClick={() => {
                setSelected([]);
                triggerChange([]);
              }}
            >
              {i18n.clear}
            </a>
          </div>
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
  maxCount: PropTypes.number,
  locale: PropTypes.oneOf(['zh-CN', 'en-US']),
};

export default MultiDatePicker;
