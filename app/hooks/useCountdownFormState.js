import { useState, useCallback, useEffect } from "react";

export function useCountdownFormState(countdown = null) {
  const [text, setText] = useState(countdown?.text || '');
  const [selectedDate, setSelectedDate] = useState(() => {
    if (countdown?.date) {
      return new Date(countdown.date);
    }
    const now = new Date();
    now.setDate(now.getDate() + 1); // Start with tomorrow if no countdown exists
    return now;
  });

  // Parse time from countdown if it exists
  const parseTimeFromCountdown = () => {
    if (!countdown?.time) return { hour: "12", minute: "00", period: "AM" };
    
    const [time, period] = countdown.time.split(" ");
    const [hour, minute] = time.split(":");
    return {
      hour: hour === "00" ? "12" : hour,
      minute,
      period
    };
  };

  const { hour, minute, period } = parseTimeFromCountdown();
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedColor, setSelectedColor] = useState(countdown?.color || "#000000");

  return {
    text, setText,
    selectedDate, setSelectedDate,
    selectedHour, setSelectedHour,
    selectedMinute, setSelectedMinute,
    selectedPeriod, setSelectedPeriod,
    selectedColor, setSelectedColor,
  };
}
