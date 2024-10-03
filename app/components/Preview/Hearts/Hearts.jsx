import React, { useEffect, useRef } from 'react';
import c from '../Preview.module.css';

const createHeart = () => {
  const heart = document.createElement('div');
  heart.classList.add(c.heart);
  heart.style.width = `${Math.floor(Math.random() * 65) + 10}px`;
  heart.style.height = heart.style.width;
  heart.style.left = `${Math.floor(Math.random() * 100) + 1}%`;
  heart.style.background = `rgba(255, ${Math.floor(Math.random() * 25) + 100 - 25}, ${Math.floor(Math.random() * 25) + 100}, 1)`;
  const duration = Math.floor(Math.random() * 5) + 5;
  heart.style.animation = `love ${duration}s ease`;
  return heart;
};

const HeartAnimation = React.forwardRef((_, ref) => { // Use forwardRef
  useEffect(() => {
    const container = ref.current; // Use the passed ref

    const addHeart = () => {
      const heart1 = createHeart();
      const heart2 = createHeart();
      container.appendChild(heart1);
      container.appendChild(heart2);
      setTimeout(removeHearts, 1000);
    };

    const removeHearts = () => {
      const hearts = container.querySelectorAll(`.${c.heart}`); // Use class selector
      hearts.forEach((heart) => {
        const top = parseFloat(getComputedStyle(heart).getPropertyValue('top'));
        const width = parseFloat(getComputedStyle(heart).getPropertyValue('width'));
        if (top <= -100 || width >= 150) {
          heart.remove();
        }
      });
    };

    const intervalId = setInterval(addHeart, 500);

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [ref]);

  return <div className="bg_heart"></div>; // This div can be kept empty
});

export default HeartAnimation;
