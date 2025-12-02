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
import 'antd/lib/input/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/icon/style/index.css';
import styles from './index.module.css';

function normalizeToMoments(value, dateFormat) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) =>
      moment.isMoment(v) ? v.clone() : moment(v, dateFormat),
    );
  }
  return [];
}

function formatDates(dates, fmt) {
  if (!dates || dates.length === 0) return [];
  return dates.map((d) => d.format(fmt));
}

function isDisabled(d, disabledDate) {
  if (!disabledDate) return false;
  try {
    return !!disabledDate(d);
  } catch (_) {
    return false;
  }
}

function betweenInclusive(a, b) {
  const start = a.isBefore(b) ? a : b;
  const end = a.isBefore(b) ? b : a;
  const days = [];
  let cur = start.clone();
  while (cur.isSameOrBefore(end, 'day')) {
    days.push(cur.clone());
    cur = cur.add(1, 'day');
  }
  return days;
}

function MultiDatePicker(props) {
  const {
    value,
    onChange,
    mode = 'multiple',
    disabledDate,
    dateFormat = 'YYYY-MM-DD',
    displayFormat = 'MM-DD',
    placeholder = '请选择日期',
    presets,
    renderExtraFooter,
    locale,
    weekdayFormat = 'zhou',
    maxTagCount = 2,
  } = props;

  const [open, setOpen] = useState(false);
  const [cursorMonth, setCursorMonth] = useState(moment().startOf('month'));
  const [internal, setInternal] = useState([]);
  const [focusIndex, setFocusIndex] = useState(null);
  const inputRef = useRef(null);
  const gridRef = useRef(null);
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (locale) moment.locale(locale);
  }, [locale]);

  useEffect(() => {
    setInternal(normalizeToMoments(value, dateFormat));
  }, [value, dateFormat]);

  const weeks = useMemo(() => {
    const start = cursorMonth.clone().startOf('month').startOf('week');
    const days = [];
    for (let i = 0; i < 42; i += 1) days.push(start.clone().add(i, 'day'));
    return days;
  }, [cursorMonth]);

  const weekdays = useMemo(() => {
    const zh = ['日', '一', '二', '三', '四', '五', '六'];
    const prefix =
      weekdayFormat === 'xingqi'
        ? '星期'
        : weekdayFormat === 'zhou'
          ? '周'
          : '';
    const ld = moment.localeData();
    const firstDay = ld.firstDayOfWeek();
    const ordered = [];
    for (let i = 0; i < 7; i += 1) {
      const t = zh[(i + firstDay) % 7];
      ordered.push(prefix ? `${prefix}${t}` : t);
    }
    return ordered;
  }, [locale, weekdayFormat]);

  const sortedInternal = useMemo(() => {
    const arr = internal
      .slice()
      .sort((a, b) => (a.isBefore(b) ? -1 : a.isAfter(b) ? 1 : 0));
    return arr;
  }, [internal]);

  const emitChange = useCallback(
    (dates) => {
      const next = dates && dates.length ? dates.map((d) => d.clone()) : [];
      const strings = next.length ? formatDates(next, dateFormat) : [];
      if (onChange)
        onChange(next.length ? next : null, next.length ? strings : null);
    },
    [onChange, dateFormat],
  );

  const selectMultiple = useCallback(
    (d) => {
      if (isDisabled(d, disabledDate)) return;
      const key = d.format('YYYY-MM-DD');
      const exists = internal.find((x) => x.isSame(d, 'day'));
      const next = exists
        ? internal.filter((x) => !x.isSame(d, 'day'))
        : internal.concat(d.clone());
      setInternal(next);
      emitChange(next);
    },
    [internal, disabledDate, emitChange],
  );

  const selectRange = useCallback(
    (d) => {
      if (isDisabled(d, disabledDate)) return;
      if (internal.length === 0) {
        const next = [d.clone()];
        setInternal(next);
        emitChange(next);
        return;
      }
      if (internal.length === 1) {
        const nextRange = betweenInclusive(internal[0], d).filter(
          (x) => !isDisabled(x, disabledDate),
        );
        setInternal(nextRange);
        emitChange(nextRange);
        return;
      }
      const next = [d.clone()];
      setInternal(next);
      emitChange(next);
    },
    [internal, disabledDate, emitChange],
  );

  const onCellClick = useCallback(
    (d) => {
      if (mode === 'range') {
        selectRange(d);
      } else if (mode === 'single') {
        if (isDisabled(d, disabledDate)) return;
        const next = [d.clone()];
        setInternal(next);
        emitChange(next);
      } else {
        selectMultiple(d);
      }
    },
    [mode, selectRange, selectMultiple, disabledDate, emitChange],
  );

  const isSelected = useCallback(
    (d) => internal.some((x) => x.isSame(d, 'day')),
    [internal],
  );
  const isThisMonth = useCallback(
    (d) => d.isSame(cursorMonth, 'month'),
    [cursorMonth],
  );
  const isToday = useCallback((d) => d.isSame(moment(), 'day'), []);

  const displayText = useMemo(() => {
    if (!sortedInternal.length) return '';
    return '';
  }, [sortedInternal]);

  const inputDisplayTags = useMemo(() => {
    const items = sortedInternal.slice(0, Math.max(0, maxTagCount));
    const rest = sortedInternal.length - items.length;
    return { items, rest };
  }, [sortedInternal, maxTagCount]);

  const onClear = useCallback(() => {
    setInternal([]);
    emitChange([]);
  }, [emitChange]);

  const onOpen = useCallback(() => {
    setOpen(true);
    setFocusIndex(null);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    inputRef.current && inputRef.current.focus();
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      if (!open) return;
      const idx =
        focusIndex == null
          ? weeks.findIndex((d) => d.isSame(moment(), 'day'))
          : focusIndex;
      let nextIdx = idx;
      if (e.key === 'ArrowLeft') nextIdx = Math.max(0, idx - 1);
      if (e.key === 'ArrowRight') nextIdx = Math.min(41, idx + 1);
      if (e.key === 'ArrowUp') nextIdx = Math.max(0, idx - 7);
      if (e.key === 'ArrowDown') nextIdx = Math.min(41, idx + 7);
      if (e.key === 'PageUp')
        setCursorMonth(cursorMonth.clone().subtract(1, 'month'));
      if (e.key === 'PageDown')
        setCursorMonth(cursorMonth.clone().add(1, 'month'));
      if (e.key === 'Home')
        nextIdx = weeks.findIndex((d) =>
          d.isSame(cursorMonth.clone().startOf('month'), 'day'),
        );
      if (e.key === 'End')
        nextIdx = weeks.findIndex((d) =>
          d.isSame(cursorMonth.clone().endOf('month'), 'day'),
        );
      if (e.key === 'Escape') onClose();
      if (
        [
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Home',
          'End',
        ].includes(e.key)
      ) {
        setFocusIndex(nextIdx);
        e.preventDefault();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        const d = weeks[nextIdx];
        onCellClick(d);
        e.preventDefault();
      }
    },
    [open, focusIndex, weeks, cursorMonth, onClose, onCellClick],
  );

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      const ov = overlayRef.current;
      if (!ov) return;
      if (ov.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler, true);
    document.addEventListener('touchstart', handler, true);
    document.addEventListener('click', handler, true);
    window.addEventListener('click', handler, true);
    window.addEventListener('pointerdown', handler, true);
    return () => {
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('touchstart', handler, true);
      document.removeEventListener('click', handler, true);
      window.removeEventListener('click', handler, true);
      window.removeEventListener('pointerdown', handler, true);
    };
  }, [open, onClose]);

  const applyPreset = useCallback(
    (preset) => {
      if (!preset) return;
      const v =
        typeof preset.value === 'function' ? preset.value() : preset.value;
      const arr = normalizeToMoments(v, dateFormat).filter(
        (x) => !isDisabled(x, disabledDate),
      );
      setInternal(arr);
      emitChange(arr);
    },
    [disabledDate, emitChange, dateFormat],
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={styles.inputRow}
        role="combobox"
        aria-haspopup="grid"
        aria-expanded={open}
      >
        <Input
          ref={inputRef}
          readOnly
          value={displayText}
          placeholder={placeholder}
          onClick={onOpen}
          suffix={
            <span className="mdp-suffix">
              <Icon type="calendar" onClick={onOpen} />
              {sortedInternal.length > 0 && (
                <Icon type="close" onClick={onClear} />
              )}
            </span>
          }
        />
        {sortedInternal.length > 0 && (
          <div className={styles.inputTags} onClick={onOpen}>
            {inputDisplayTags.items.map((d) => (
              <Tag key={`in-${d.format('YYYY-MM-DD')}`} className={styles.tagPrimary} color="#108ee9">
                {d.format(displayFormat)}
              </Tag>
            ))}
            {inputDisplayTags.rest > 0 && (
              <Tag className={styles.tagEllipsis}>{`+${inputDisplayTags.rest}`}</Tag>
            )}
          </div>
        )}
      </div>
      <div className={styles.tagsRow}>
        {sortedInternal.map((d) => (
          <Tag
            key={d.format('YYYY-MM-DD')}
            closable
            onClose={() => onCellClick(d)}
            className={styles.tagPrimary}
            color="#108ee9"
          >
            {d.format(displayFormat)}
          </Tag>
        ))}
        {sortedInternal.length > 0 && (
          <Button size="small" onClick={onClear} style={{ marginLeft: 8 }}>
            清空
          </Button>
        )}
        {sortedInternal.length > 0 && (
          <span className="mdp-count-badge">{sortedInternal.length}</span>
        )}
      </div>
      {open && (
        <>
          <div className="mdp-mask" onClick={onClose} />
          <div className={styles.overlay} role="dialog" ref={overlayRef}>
            <div className="mdp-header">
              <Button
                size="small"
                onClick={() =>
                  setCursorMonth(cursorMonth.clone().subtract(1, 'month'))
                }
              >
                <Icon type="left" />
              </Button>
              <span className="mdp-header-title">
                {cursorMonth.format('YYYY-MM')}
              </span>
              <Button
                size="small"
                onClick={() =>
                  setCursorMonth(cursorMonth.clone().add(1, 'month'))
                }
              >
                <Icon type="right" />
              </Button>
              <Button
                size="small"
                onClick={onClose}
                style={{ marginLeft: 'auto' }}
              >
                关闭
              </Button>
            </div>
            <div className="mdp-weekdays">
              {weekdays.map((w, i) => (
                <div key={i} className="mdp-weekday-cell">
                  {w}
                </div>
              ))}
            </div>
            <div
              className="mdp-grid"
              role="grid"
              tabIndex={0}
              onKeyDown={onKeyDown}
              ref={gridRef}
            >
              {weeks.map((d, idx) => {
                const selected = isSelected(d);
                const disabled = isDisabled(d, disabledDate);
                const thisMonth = isThisMonth(d);
                const today = isToday(d);
                const focused = focusIndex === idx;
                const adjLeft =
                  selected && isSelected(d.clone().subtract(1, 'day'));
                const adjRight =
                  selected && isSelected(d.clone().add(1, 'day'));
                let alpha = null;
                if (selected && mode === 'range' && sortedInternal.length > 1) {
                  const key = d.format('YYYY-MM-DD');
                  const pos = sortedInternal.findIndex(
                    (x) => x.format('YYYY-MM-DD') === key,
                  );
                  if (pos >= 0) {
                    const ratio =
                      sortedInternal.length > 1
                        ? pos / (sortedInternal.length - 1)
                        : 0;
                    alpha = 0.2 + 0.4 * ratio;
                  }
                }
                const className = [
                  styles.dayCell,
                  selected ? styles.selected : '',
                  disabled ? styles.disabled : '',
                  thisMonth ? styles.cur : styles.other,
                  today ? styles.today : '',
                  focused ? styles.focused : '',
                  selected && mode === 'range' ? styles.range : '',
                  adjLeft ? `${styles.adjLeft} ${styles.linkLeft}` : '',
                  adjRight ? `${styles.adjRight} ${styles.linkRight}` : '',
                ].join(' ');
                return (
                  <button
                    type="button"
                    key={d.format('YYYY-MM-DD')}
                    className={className}
                    aria-selected={selected}
                    aria-disabled={disabled}
                    style={alpha != null ? { '--mdp-alpha': alpha } : undefined}
                    onClick={() => onCellClick(d)}
                  >
                    {d.date()}
                  </button>
                );
              })}
            </div>
            {presets && presets.length > 0 && (
              <div className="mdp-presets">
                {presets.map((p, i) => (
                  <Button size="small" key={i} onClick={() => applyPreset(p)}>
                    {p.label}
                  </Button>
                ))}
              </div>
            )}
            {renderExtraFooter && (
              <div className="mdp-extra-footer">{renderExtraFooter()}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

MultiDatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.any]),
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(['single', 'multiple', 'range']),
  disabledDate: PropTypes.func,
  dateFormat: PropTypes.string,
  displayFormat: PropTypes.string,
  placeholder: PropTypes.string,
  presets: PropTypes.array,
  renderExtraFooter: PropTypes.func,
  locale: PropTypes.string,
  weekdayFormat: PropTypes.oneOf(['short', 'zhou', 'xingqi']),
};

export default MultiDatePicker;
