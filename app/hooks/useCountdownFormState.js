import { useState, useCallback } from "react";

export function useCountdownFormState() {
  const [text, setText] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Start with tomorrow
    return now;
  });

  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  return {
    text, setText,
    selectedDate, setSelectedDate,
    selectedHour, setSelectedHour,
    selectedMinute, setSelectedMinute,
    selectedPeriod, setSelectedPeriod,
  };
}
