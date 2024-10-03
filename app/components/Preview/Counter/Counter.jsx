import React, { useState, useEffect } from 'react';
import timeElapsedSince from '@/app/utils/timeElapsedSince';
import c from '../Preview.module.css';
export default function ({ startCounting, date, time }) {
  const [elapsedTime, setElapsedTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  // STARTS THE COUNTER
  useEffect(() => {
    if (startCounting) {
      const intervalId = setInterval(() => {
        setElapsedTime(timeElapsedSince(date, time));
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on unmount or when date/time changes
    }
  }, [startCounting, date, time]);


  return (
    <div>
      {startCounting && <p className={c.juntos}>Juntos</p>}
      <div className={c.time}>
        {startCounting
          ? `${elapsedTime.years > 0 ? `${elapsedTime.years} anos,` : ''} ${
              elapsedTime.months > 0 ? `${elapsedTime.months} meses,` : ''
            } ${elapsedTime.days > 0 ? `${elapsedTime.days} dias,` : ''} ${
              elapsedTime.hours
            } horas, ${elapsedTime.minutes} minutos, ${
              elapsedTime.seconds < 10
                ? '0' + elapsedTime.seconds
                : elapsedTime.seconds
            } segundos`
          : null}
      </div>
    </div>
  );
}
