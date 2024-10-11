import React, { useState, useEffect } from 'react';
import timeElapsedSince from '@/app/utils/timeElapsedSince';
import c from '../Preview.module.css';

export default function Counter({ startCounting, date, time }) {
  const [elapsedTime, setElapsedTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Utility function to check if the date is in the future / true or false
  const isDateInFuture = (date, time) => {
    const currentDateTime = new Date();
    const targetDateTime = new Date(`${date}T${time}`);

    return targetDateTime > currentDateTime;
  };

  // STARTS THE COUNTER
  useEffect(() => {
    if (startCounting) {
      const intervalId = setInterval(() => {
        const isFuture = isDateInFuture(date, time);

        if (isFuture) {
          // Countdown if the date is in the future
          setElapsedTime(timeRemainingUntil(date, time));
        } else {
          // Count up if the date is in the past
          setElapsedTime(timeElapsedSince(date, time));
        }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on unmount or when date/time changes
    }
  }, [startCounting, date, time]);

  return (
    <div>
      {startCounting && <p className={c.juntos}>Juntos</p>}
      <div className={c.time}>
        {startCounting
          ? `${elapsedTime.years > 0 ? `${elapsedTime.years} ${elapsedTime.years === 1 ? 'ano' : 'anos'},` : ''} ${
              elapsedTime.months > 0 ? `${elapsedTime.months} ${elapsedTime.months === 1 ? 'mês' : 'meses'},` : ''
            } ${elapsedTime.days > 0 ? `${elapsedTime.days} ${elapsedTime.days === 1 ? 'dia' : 'dias'},` : ''} 
             ${elapsedTime.hours > 0 ? `${elapsedTime.hours} ${elapsedTime.hours === 1 ? 'hora' : 'horas'},` : ''}
             ${elapsedTime.minutes> 0 ? `${elapsedTime.minutes} ${elapsedTime.minutes === 1 ? 'minuto' : 'minutos'},` : ''}
             ${elapsedTime.seconds < 10
                ? '0' + elapsedTime.seconds
                : elapsedTime.seconds
            } segundos`
          : null}
      </div>
    </div>
  );
}

// New utility function to calculate the time remaining until a future date
function timeRemainingUntil(date, time) {
  const currentDateTime = new Date();
  const targetDateTime = new Date(`${date}T${time}`);

  const diffInSeconds = Math.floor((targetDateTime - currentDateTime) / 1000);

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const days = Math.floor(diffInSeconds / (3600 * 24));
  const months = Math.floor(days / 30); // Approximating months as 30 days
  const years = Math.floor(months / 12); // Approximating years as 12 months

  return {
    years,
    months: months % 12,
    days: days % 30,
    hours,
    minutes,
    seconds,
  };
}
