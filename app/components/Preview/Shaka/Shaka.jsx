import React, { useEffect, useState } from 'react';
import c from './Shaka.module.css'; // Create a separate CSS file

export default function HandAnimation() {
  const [hands, setHands] = useState([]);
  const MAX_HANDS = 10;
  // console.log('shaka')

  useEffect(() => {
    const createHand = () => {
      // creates new hands if its smaller than MAX_HANDS, then sets Hands array with new hands
      if (hands.length < MAX_HANDS) {
        const handStyle = {
          fontSize: `${Math.floor(Math.random() * 20) + 30}px`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 3}s`,
          opacity: Math.random(),
        };
        setHands((prevHands) => [...prevHands, handStyle]);
      }
    };

    const intervalId = setInterval(createHand, 800);

    return () => clearInterval(intervalId);
  }, [hands]);

  return (
    <>
    <div className={c['hand-container']}>
      {hands.map((style, index) => (
        <span key={index} className={c.hand} style={style}>
          🤙
        </span>
      ))}
    </div>
    </>
  );
}