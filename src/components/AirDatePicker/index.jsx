import { DatePicker as AntDatePicker, Button, Card, Col, Icon, Row, Select, Tag, Icon } from "antd"
import moment from "moment"
import PropTypes from "prop-types"
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import ReactDOM from "react-dom"
import "antd/lib/date-picker/style/index.css"
import "antd/lib/select/style/index.css"
import "antd/lib/tag/style/index.css"
import "antd/lib/button/style/index.css"
import "./index.css"

const { Option } = Select

/**
 * 基于 air-datepicker 设计规范，实现与 antd@3.26.20 风格一致的日期选择组件。
 * 功能：单选、范围、多选、自定义格式、国际化、禁用日期、快捷选择；支持键盘导航与无障碍。
 * 表单：兼容 AntD v3 Form 的受控/非受控模式及校验与提交行为。
 */
const AirDatePicker = forwardRef((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    mode = "single",
    showTime = false,
    onlyTimepicker = false,
    timeFormat = "HH:mm",
    dateTimeSeparator = " ",
    minHours = 0,
    maxHours = 24,
    minMinutes = 0,
    maxMinutes = 59,
    hoursStep = 1,
    minutesStep = 1,
    disabled = false,
    disabledDate,
    minDate,
    maxDate,
    locale = "zhCN",
    format = showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD",
    valueFormat,
    valueType = "array",
    placeholder,
    size = "default",
    style = {},
    className = "",
    datePickerProps = {},
    position = "bottom left",
    showEvent = "click",
    autoClose = true,
    buttons = ["today", "clear"],
    onRenderCell,
    onShow,
    onHide,
    keyboardNav = true,
    toggleSelected = true,
    selectedDates: selectedDatesProp,
    altField,
    altFieldDateFormat = "T",
    onPanelChange,
    shortcuts,
    onSelect,
    onBeforeSelect,
    onChangeViewDate,
    onChangeView,
    container,
  } = props

  const locales = {
    zhCN: {
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      shortcuts: "快捷选择",
      today: "今天",
      clear: "清空",
      timeSelection: "时间选择",
      ok: "确定",
      cancel: "取消",
      placeholder: "请选择日期",
      yearSelect: "选择年份",
      monthSelect: "选择月份",
    },
    enUS: {
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      shortcuts: "Shortcuts",
      today: "Today",
      clear: "Clear",
      timeSelection: "Time Selection",
      ok: "OK",
      cancel: "Cancel",
      placeholder: "Please select date",
      yearSelect: "Select Year",
      monthSelect: "Select Month",
    },
  }

  const currentLocale = locales[locale] || locales.zhCN

  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(moment())
  const [currentView, setCurrentView] = useState("days")
  const [selectedDates, setSelectedDates] = useState(() => {
    if (selectedDatesProp && Array.isArray(selectedDatesProp)) return selectedDatesProp.map((m) => moment(m))
    if (defaultValue) {
      if (Array.isArray(defaultValue)) return defaultValue.map((v) => moment(v))
      return [moment(defaultValue)]
    }
    return []
  })
  const [rangeStart, setRangeStart] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [timeValues, setTimeValues] = useState({ hour: 0, minute: 0 })
  const rootRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (value != null) {
      let dates = []
      const fmt = valueFormat || format
      if (valueType === "string" && typeof value === "string") {
        dates = value
          .split(",")
          .map((s) => moment(s.trim(), fmt))
          .filter((m) => m.isValid())
      } else if (Array.isArray(value)) {
        dates = value.map((v) => (moment.isMoment(v) ? v : moment(v, fmt))).filter((m) => m.isValid())
      }
      setSelectedDates(dates)
    }
  }, [value, valueType, valueFormat, format])

  useEffect(() => {
    if (showTime && selectedDates.length > 0) {
      const m = selectedDates[selectedDates.length - 1]
      setTimeValues({ hour: m.hour(), minute: m.minute() })
    }
  }, [selectedDates, showTime])

  useEffect(() => {
    if (!keyboardNav || !open) return
    const handleKey = (e) => {
      if (!open) return
      if (e.key === "Escape") setOpen(false)
      const withCtrl = e.ctrlKey
      const withShift = e.shiftKey
      const withAlt = e.altKey
      if (withCtrl && (e.key === "ArrowRight" || e.key === "ArrowUp")) {
        const d = viewDate.clone().add(1, "month")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withCtrl && (e.key === "ArrowLeft" || e.key === "ArrowDown")) {
        const d = viewDate.clone().subtract(1, "month")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withShift && (e.key === "ArrowRight" || e.key === "ArrowUp")) {
        const d = viewDate.clone().add(1, "year")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withShift && (e.key === "ArrowLeft" || e.key === "ArrowDown")) {
        const d = viewDate.clone().subtract(1, "year")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withAlt && (e.key === "ArrowRight" || e.key === "ArrowUp")) {
        const d = viewDate.clone().add(10, "year")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withAlt && (e.key === "ArrowLeft" || e.key === "ArrowDown")) {
        const d = viewDate.clone().subtract(10, "year")
        setViewDate(d)
        onPanelChange && onPanelChange(d)
      }
      if (withCtrl && withShift && e.key === "ArrowUp") {
        setCurrentView(v => {
          const nv = v === "days" ? "months" : v === "months" ? "years" : "years"
          onChangeView && onChangeView(nv)
          return nv
        })
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [keyboardNav, open, viewDate, onPanelChange])

  const convertFormat = useCallback(
    (m, fmt) => {
      if (!fmt) return m.format(format)
      if (fmt.includes("T")) return String(m.valueOf())
      const map = {
        yyyy: "YYYY",
        yy: "YY",
        MMMM: "MMMM",
        MMM: "MMM",
        MM: "MM",
        M: "M",
        dd: "DD",
        d: "D",
        EEEE: "dddd",
        E: "ddd",
        H: "H",
        HH: "HH",
        h: "h",
        hh: "hh",
        m: "m",
        mm: "mm",
        AA: "A",
        aa: "a",
      }
      const replaced = fmt.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|E|HH|H|hh|h|mm|m|AA|aa/g, (t) => map[t] || t)
      return m.format(replaced)
    },
    [format],
  )

  const triggerChange = useCallback(
    (dates) => {
      if (altField) {
        const outFmt = altFieldDateFormat || "T"
        const s = mode === "multiple" ? dates.map((d) => convertFormat(d, outFmt)).join(",") : convertFormat(dates[0], outFmt)
        const node = typeof altField === "string" ? document.querySelector(altField) : altField
        if (node && "value" in node) node.value = s || ""
      }
      if (onChange) {
        const fmt = valueFormat || format
        if (valueType === "string") {
          const s = dates.map((d) => convertFormat(d, fmt)).join(",")
          onChange(s)
        } else {
          onChange(dates)
        }
      }
    },
    [altField, altFieldDateFormat, mode, onChange, valueType, valueFormat, format, convertFormat],
  )

  const customDisabledDate = useCallback(
    (current) => {
      if (disabledDate && disabledDate(current)) return true
      if (minDate && current && current.isBefore(minDate, "day")) return true
      if (maxDate && current && current.isAfter(maxDate, "day")) return true
      return false
    },
    [disabledDate, minDate, maxDate],
  )

  const handleTimeChange = useCallback(
    (type, value) => {
      setTimeValues((prev) => {
        const v = type === "hour" ? Math.max(minHours, Math.min(maxHours - 1, value)) : Math.max(minMinutes, Math.min(maxMinutes, value))
        return { ...prev, [type]: v }
      })
    },
    [minHours, maxHours, minMinutes, maxMinutes],
  )

  const applyTime = useCallback(
    (m) => {
      if (!showTime) return m
      return m.clone().hour(timeValues.hour).minute(timeValues.minute).second(0)
    },
    [showTime, timeValues],
  )

  const selectHandler = useCallback(
    (date) => {
      if (!date) {
        setOpen(false)
        return
      }
      const newDate = applyTime(date.clone())

      if (onBeforeSelect) {
        const allow = onBeforeSelect({ date: newDate.toDate(), datepicker: { selectedDates: selectedDates.map(m=>m.toDate()) } })
        if (allow === false) return
      }

      if (mode === "single") {
        const next = [newDate]
        setSelectedDates(next)
        triggerChange(next)
        onSelect && onSelect({ date: newDate.toDate(), datepicker: { selectedDates: next.map(m=>m.toDate()) } })
        if (autoClose) setOpen(false)
        return
      }

      if (mode === "range") {
        if (!rangeStart) {
          setRangeStart(newDate)
          return
        }
        const [start, end] = rangeStart.isBefore(newDate) ? [rangeStart, newDate] : [newDate, rangeStart]
        const dates = [start, end]
        setSelectedDates(dates)
        setRangeStart(null)
        triggerChange(dates)
        onSelect && onSelect({ date: newDate.toDate(), datepicker: { selectedDates: dates.map(m=>m.toDate()) } })
        if (autoClose) setOpen(false)
        return
      }

      const fmt = valueFormat || format
      const key = convertFormat(newDate, fmt)
      const exists = selectedDates.some((d) => convertFormat(d, fmt) === key)
      const next = exists && toggleSelected ? selectedDates.filter((d) => convertFormat(d, fmt) !== key) : [...selectedDates, newDate].sort((a, b) => a.valueOf() - b.valueOf())
      setSelectedDates(next)
      triggerChange(next)
      onSelect && onSelect({ date: newDate.toDate(), datepicker: { selectedDates: next.map(m=>m.toDate()) } })
      if (autoClose) setOpen(false)
    },
    [mode, rangeStart, selectedDates, applyTime, triggerChange, toggleSelected, valueFormat, format, convertFormat, onBeforeSelect, onSelect, autoClose],
  )

  const handleClear = useCallback(() => {
    setSelectedDates([])
    setRangeStart(null)
    triggerChange([])
  }, [triggerChange])

  const handleToday = useCallback(() => {
    const today = moment().startOf("day")
    selectHandler(today)
  }, [selectHandler])

  const handleOpen = useCallback(() => {
    if (disabled) return
    setOpen(true)
    onShow && onShow(false)
    if (typeof position === "function" && overlayRef.current && rootRef.current) {
      const $datepicker = overlayRef.current
      const $target = rootRef.current
      const $pointer = overlayRef.current.querySelector(".airdp-pointer")
      position({ $datepicker, $target, $pointer, isViewChange: false, done: () => {} })
    }
  }, [disabled, onShow])

  const handleClose = useCallback(() => {
    setOpen(false)
    onHide && onHide(false)
  }, [onHide])

  useImperativeHandle(ref, () => ({
    show: () => handleOpen(),
    hide: () => handleClose(),
    selectDate: (date) => selectHandler(moment(date)),
    setViewDate: (date) => {
      const d = moment(date)
      setViewDate(d)
      onPanelChange && onPanelChange(d)
    },
    update: (opts) => {},
    getState: () => ({ viewDate, selectedDates, visible: open }),
  }))

  const defaultShortcuts = useMemo(
    () => [
      { label: currentLocale.today, getValue: () => [moment().startOf("day")] },
      { label: currentLocale.shortcuts, getValue: () => [moment().startOf("month"), moment().endOf("month")] },
    ],
    [currentLocale],
  )

  const shortcutOptions = shortcuts || defaultShortcuts

  const years = useMemo(() => {
    const y = viewDate.year()
    const arr = []
    for (let i = y - 10; i <= y + 10; i++) arr.push(i)
    return arr
  }, [viewDate])

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), [])

  const dateCellRenderer = useCallback(
    (date) => {
      if (onRenderCell) {
        const res = onRenderCell({ date: date.toDate(), cellType: "day" })
        if (res && (res.html || res.classes || res.attrs)) {
          if (res.html) {
            return (
              <div className={res.classes} {...(res.attrs || {})} dangerouslySetInnerHTML={{ __html: res.html }} />
            )
          }
          return (
            <div className={res.classes} {...(res.attrs || {})}>{date.date()}</div>
          )
        }
      }

      const isToday = date.isSame(moment(), "day")
      const isSelectedSingle = mode === "single" && selectedDates[0] && date.isSame(selectedDates[0], "day")
      const isSelectedMultiple = mode === "multiple" && selectedDates.some((d) => date.isSame(d, "day"))
      const isRangeFinalized = mode === "range" && selectedDates.length === 2
      const isRangeStartFinal = isRangeFinalized && date.isSame(selectedDates[0], "day")
      const isRangeEndFinal = isRangeFinalized && date.isSame(selectedDates[1], "day")
      const inRangeFinal = isRangeFinalized && date.isBetween(selectedDates[0], selectedDates[1], "day", "[]")

      const canHover = !(disabledDate && disabledDate(date))
      const isRangePreview = mode === "range" && rangeStart && hoverDate && canHover
      const [previewStart, previewEnd] = isRangePreview
        ? (rangeStart.isBefore(hoverDate) ? [rangeStart, hoverDate] : [hoverDate, rangeStart])
        : [null, null]
      const inRangeHover = isRangePreview && previewStart && previewEnd && date.isBetween(previewStart, previewEnd, "day", "[]")
      const isRangeStartHover = isRangePreview && previewStart && date.isSame(previewStart, "day")
      const isRangeEndHover = isRangePreview && previewEnd && date.isSame(previewEnd, "day")

      const classes = ["airdp-day-cell"]
      if (isSelectedSingle || isSelectedMultiple) classes.push("airdp-selected")
      if (isRangeStartFinal) classes.push("airdp-selected-start")
      if (isRangeEndFinal) classes.push("airdp-selected-end")
      if (inRangeFinal) classes.push("airdp-in-range")
      if (isRangeStartHover) classes.push("airdp-hover-start")
      if (isRangeEndHover) classes.push("airdp-hover-end")
      if (inRangeHover) classes.push("airdp-in-range-hover")

      return (
        <div
          className={classes.join(" ")}
          aria-selected={isSelectedSingle || isSelectedMultiple || isRangeStartFinal || isRangeEndFinal}
          onMouseEnter={() => { if (mode === "range" && rangeStart && canHover) setHoverDate(date) }}
          onMouseLeave={() => { if (mode === "range") setHoverDate(null) }}
        >
          {date.date()}
          {isToday && <div className="airdp-day-today-indicator" />}
          {(isSelectedSingle || isSelectedMultiple || isRangeStartFinal || isRangeEndFinal) && (
            <span className="airdp-selected-dot" aria-hidden="true" />
          )}
        </div>
      )
    },
    [onRenderCell, mode, selectedDates, rangeStart, hoverDate],
  )

  const renderButtons = useMemo(() => {
    const items = (buttons || []).map((b, idx) => {
      if (typeof b === "string") {
        if (b === "today") return <Button key={`btn-${idx}`} size="small" onClick={handleToday}>{currentLocale.today}</Button>
        if (b === "clear") return <Button key={`btn-${idx}`} size="small" onClick={handleClear} icon="clear" />
        return null
      }
      if (typeof b === "object") {
        const content = typeof b.content === "function" ? b.content({ opts: props }) : b.content
        return (
          <Button
            key={`btn-${idx}`}
            size="small"
            className={b.className || ""}
            onClick={() =>
              b.onClick &&
              b.onClick({
                selectDate: (d) => selectHandler(moment(d)),
                setViewDate: (d) => setViewDate(moment(d)),
                update: (o) => {},
              })
            }
          >
            {content}
          </Button>
        )
      }
      return null
    })
    return items.length ? <div className="airdp-buttons">{items}</div> : null
  }, [buttons, handleToday, handleClear, currentLocale, props, selectHandler])

  const hourOptions = useMemo(() => {
    const arr = []
    for (let i = minHours; i < Math.min(maxHours, 24); i += Math.max(1, hoursStep)) arr.push(i)
    return arr
  }, [minHours, maxHours, hoursStep])

  const minuteOptions = useMemo(() => {
    const arr = []
    for (let i = minMinutes; i < Math.min(maxMinutes + 1, 60); i += Math.max(1, minutesStep)) arr.push(i)
    return arr
  }, [minMinutes, maxMinutes, minutesStep])

  const renderSelectedTags = useMemo(() => {
    const fmt = valueFormat || format
    return (
      <div className="airdp-tags">
        {selectedDates.map((d, i) => (
          <Tag
            key={`${convertFormat(d, fmt)}-${i}`}
            size="small"
            closable={!disabled}
            onClose={(e) => {
              e.preventDefault()
              const next = selectedDates.filter((x) => convertFormat(x, fmt) !== convertFormat(d, fmt))
              setSelectedDates(next)
              triggerChange(next)
            }}
            color="blue"
          >
            {convertFormat(d, fmt)}
          </Tag>
        ))}
        {!disabled && (
          <Button type="link" size="small" onClick={handleClear} className="airdp-clear-btn" icon="clear" />
        )}
      </div>
    )
  }, [selectedDates, valueFormat, format, disabled, handleClear, convertFormat, triggerChange, currentLocale])

  const renderSelector = useMemo(() => {
    const sizeClass = size === "small" ? "ant-input-sm" : size === "large" ? "ant-input-lg" : ""
    const placeholderText = placeholder || currentLocale.placeholder
    return (
      <div
        ref={rootRef}
        className={`ant-input ${sizeClass} ${className} airdp-input`}
        role="combobox"
        aria-haspopup="grid"
        aria-expanded={open}
        onClick={showEvent === "click" ? handleOpen : undefined}
        onFocus={showEvent === "focus" ? handleOpen : undefined}
        tabIndex={0}
        style={style}
      >
        <div className="airdp-input-content">
          {selectedDates.length > 0 ? renderSelectedTags : <span className="airdp-placeholder">{placeholderText}</span>}
        </div>
        <Icon type={open ? "up" : "down"} className="airdp-caret" />
      </div>
    )
  }, [size, className, style, open, selectedDates.length, renderSelectedTags, placeholder, currentLocale, handleOpen])

  return (
    <div className="airdp-root">
      {renderSelector}
      {open && (
        <div className={`airdp-overlay ${String(position).replace(" ", "-")}`} ref={overlayRef} role="dialog" aria-label="Date picker">
          <div className="airdp-header">
            <div className="airdp-nav-left">
              <Button type="link" icon="double-left" size="small" onClick={() => { const d = viewDate.clone().subtract(1, "year"); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} />
              <Button type="link" icon="left" size="small" onClick={() => { const d = viewDate.clone().subtract(1, "month"); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} />
            </div>
            <div className="airdp-title">
              <Select value={viewDate.year()} onChange={(y) => { const d = viewDate.clone().year(y); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} size="small" style={{ width: 90, marginRight: 6 }}>
                {years.map((y) => (
                  <Option key={y} value={y}>{y}</Option>
                ))}
              </Select>
              <Select value={viewDate.month()} onChange={(m) => { const d = viewDate.clone().month(m); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} size="small" style={{ width: 110 }}>
                {months.map((m) => (
                  <Option key={m} value={m}>{currentLocale.months[m]}</Option>
                ))}
              </Select>
            </div>
            <div className="airdp-nav-right">
              <Button type="link" icon="right" size="small" onClick={() => { const d = viewDate.clone().add(1, "month"); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} />
              <Button type="link" icon="double-right" size="small" onClick={() => { const d = viewDate.clone().add(1, "year"); setViewDate(d); onPanelChange && onPanelChange(d); onChangeViewDate && onChangeViewDate({ month: d.month(), year: d.year(), decade: [Math.floor(d.year()/10)*10, Math.floor(d.year()/10)*10+9] }) }} />
            </div>
          </div>

          <AntDatePicker
            value={null}
            onChange={(d) => selectHandler(d)}
            placeholder={currentLocale.placeholder}
            disabled={disabled}
            format={format}
            showTime={false}
            open={true}
            style={{ width: "100%" }}
            disabledDate={customDisabledDate}
            renderExtraFooter={() => null}
            dateRender={dateCellRenderer}
            {...datePickerProps}
          />

          {showTime && !onlyTimepicker && (
            <div className="airdp-timepanel">
              <div className="airdp-timepanel-title">{currentLocale.timeSelection}</div>
              <div className="airdp-timepanel-controls">
                <Select value={timeValues.hour} onChange={(v) => handleTimeChange("hour", v)} size="small" style={{ width: 80 }}>
                  {hourOptions.map((h) => (
                    <Option key={h} value={h}>{String(h).padStart(2, "0")}</Option>
                  ))}
                </Select>
                <span className="airdp-time-sep">:</span>
                <Select value={timeValues.minute} onChange={(v) => handleTimeChange("minute", v)} size="small" style={{ width: 80 }}>
                  {minuteOptions.map((m) => (
                    <Option key={m} value={m}>{String(m).padStart(2, "0")}</Option>
                  ))}
                </Select>
                {timeFormat && <span className="airdp-timeformat">{timeFormat}</span>}
              </div>
            </div>
          )}

          {shortcuts && Array.isArray(shortcuts) && (
            <Card size="small" style={{ marginTop: 12 }}>
              <div style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.85)", marginBottom: 8, fontWeight: 500 }}>{currentLocale.shortcuts}</div>
              <Row gutter={[8, 8]}>
                {shortcuts.map((s) => (
                  <Col key={s.label} xs={12} sm={8} lg={6}>
                    <Button size="small" type="default" block onClick={() => {
                      const nd = s.getValue()
                      const ms = nd.map((d) => (moment.isMoment(d) ? d : moment(d)))
                      setSelectedDates(ms)
                      triggerChange(ms)
                      setOpen(false)
                    }}>{s.label}</Button>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {renderButtons}

          <div className="airdp-footer">
            <Button size="small" onClick={() => setOpen(false)}>{currentLocale.cancel}</Button>
            <Button type="primary" size="small" onClick={() => setOpen(false)}>{currentLocale.ok}</Button>
          </div>
        </div>
      )}
    </div>
  )
})

AirDatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(["single", "range", "multiple"]),
  showTime: PropTypes.bool,
  onlyTimepicker: PropTypes.bool,
  timeFormat: PropTypes.string,
  dateTimeSeparator: PropTypes.string,
  minHours: PropTypes.number,
  maxHours: PropTypes.number,
  minMinutes: PropTypes.number,
  maxMinutes: PropTypes.number,
  hoursStep: PropTypes.number,
  minutesStep: PropTypes.number,
  disabled: PropTypes.bool,
  disabledDate: PropTypes.func,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  locale: PropTypes.oneOf(["zhCN", "enUS"]),
  format: PropTypes.string,
  valueFormat: PropTypes.string,
  valueType: PropTypes.oneOf(["array", "string"]),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["small", "default", "large"]),
  style: PropTypes.object,
  className: PropTypes.string,
  datePickerProps: PropTypes.object,
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttons: PropTypes.array,
  onRenderCell: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  keyboardNav: PropTypes.bool,
  toggleSelected: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  selectedDates: PropTypes.array,
  altField: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  altFieldDateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onPanelChange: PropTypes.func,
  shortcuts: PropTypes.array,
  onSelect: PropTypes.func,
  onBeforeSelect: PropTypes.func,
  onChangeViewDate: PropTypes.func,
  onChangeView: PropTypes.func,
  showEvent: PropTypes.oneOf(["click", "focus"]),
  autoClose: PropTypes.bool,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

AirDatePicker.defaultProps = {
  mode: "single",
  showTime: false,
  onlyTimepicker: false,
  timeFormat: "HH:mm",
  dateTimeSeparator: " ",
  minHours: 0,
  maxHours: 24,
  minMinutes: 0,
  maxMinutes: 59,
  hoursStep: 1,
  minutesStep: 1,
  disabled: false,
  locale: "zhCN",
  format: "YYYY-MM-DD",
  valueType: "array",
  keyboardNav: true,
  toggleSelected: true,
  buttons: ["today", "clear"],
  showEvent: "click",
  autoClose: true,
}

export default memo(AirDatePicker)

