import React, { useEffect, useState } from 'react';
import c from './HeartAnimation.module.css'

export default function HeartAnimation() {
  const [hearts, setHearts] = useState([]);
  const MAX_HEARTS = 10;

  useEffect(() => {
    const createHeart = () => {
      if (hearts.length < MAX_HEARTS){
        const heartStyle = {
          width: `${Math.floor(Math.random() * 20) + 10}px`,
          height: `${Math.floor(Math.random() * 20) + 10}px`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 3}s`,
          opacity: Math.random(),
        };
        setHearts((prevHearts) => [...prevHearts, heartStyle]);
      }

      // setTimeout(() => {
      //   setHearts((prevHearts) => prevHearts.slice(1));
      // }, 5000); // Remove the heart after it finishes animation
    };

    const intervalId = setInterval(createHeart, 800);

    return () => clearInterval(intervalId);
  }, [hearts]);

  return (

    <div className={c['heart-container']}>
      {hearts.map((style, index) => (
        <div key={index} className={c.heart} style={style}></div>
      ))}
    </div>
  );
}
