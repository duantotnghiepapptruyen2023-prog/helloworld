import React, { useState, useEffect, useRef } from "react";
import "./DateCustom.scss";
import { useTranslation } from "react-i18next";

const DateCustom = ({ onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef(null);
  const { t } = useTranslation();

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatDate = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      12
    );

    let newStartDate = startDate;
    let newEndDate = endDate;

    if (!startDate || (startDate && endDate)) {
      newStartDate = selectedDate;
      newEndDate = null;
    } else {
      if (selectedDate > startDate) {
        newEndDate = selectedDate;
      } else {
        newEndDate = startDate;
        newStartDate = selectedDate;
      }
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    onChange &&
      onChange(
        formatDate(newStartDate),
        newEndDate ? formatDate(newEndDate) : ""
      );
  };

  const prevMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="date-custom" ref={datePickerRef}>
      <input
        type="text"
        value={
          startDate && endDate
            ? `${formatDate(startDate)} to ${formatDate(endDate)}`
            : startDate
            ? `${formatDate(startDate)} to ${formatDate(startDate)}`
            : ""
        }
        readOnly
        placeholder= {t("chonngay")}
        onClick={() => setIsOpen(!isOpen)}
        style={{backgroundColor: "transparent", color: "white"}}
        className={`date-input1 ${!startDate ? "placeholder-active" : ""}`}
      />
      {isOpen && (
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <div>
              {currentMonth.toLocaleString("default", { month: "long" })}{" "}
              {currentMonth.getFullYear()}
            </div>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          <div className="calendar-body">
            <div className="calendar-grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="day-name">
                  {day}
                </div>
              ))}
              {Array(
                getFirstDayOfMonth(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth()
                )
              )
                .fill(null)
                .map((_, index) => (
                  <div key={`empty-${index}`} className="empty-cell"></div>
                ))}
              {Array(
                getDaysInMonth(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth()
                )
              )
                .fill(null)
                .map((_, day) => {
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day + 1
                  );
                  const isToday =
                    new Date().toDateString() === date.toDateString();
                  const isSelectedStart =
                    startDate &&
                    startDate.toDateString() === date.toDateString();
                  const isSelectedEnd =
                    endDate && endDate.toDateString() === date.toDateString();
                  const isInRange =
                    startDate && endDate && date > startDate && date < endDate;

                  return (
                    <div
                      key={day}
                      className={`day ${isToday ? "today" : ""} 
                        ${isSelectedStart ? "selected-start" : ""} 
                        ${isSelectedEnd ? "selected-end" : ""} 
                        ${isInRange ? "in-range" : ""}`}
                      onClick={() => handleDateClick(day + 1)}
                    >
                      {day + 1}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateCustom;
