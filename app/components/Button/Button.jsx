import { useRef } from 'react';
import c from './Button.module.css';
export default function Button() {
  const scrollToForm = () => {
    const formElement = document.getElementById('form'); // Select the form by its ID
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the form
    }
  };
  return (
    <div className={c.btnCont}>
    <button className={c.btn} onClick={scrollToForm}>Eu quero!</button>
    </div>
  )
}