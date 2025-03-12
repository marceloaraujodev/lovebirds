'use client'
import React from 'react'
import { useState } from 'react'
import c from './LetterAnimation.module.css'

export default function LetterAnimation({message}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const toggleEnvelope = () => {
    // If it's open, start the closing sequence.
    if (isOpen) {
      setIsClosing(true)
      // Adjust the timeout to match your total closing animation duration.
      setTimeout(() => {
        setIsClosing(false)
        setIsOpen(false)
      }, 1000)
    } else {
      // Open the envelope
      setIsOpen(true)
    }
  }
   const wrapperClass = `${c.wrapper} ${isOpen ? c.open : ''} ${isClosing ? c.closing : ''}`
  return (
    <div className={c.container} onClick={toggleEnvelope}>
      <div className={wrapperClass} >
      <div className={`${c.lid} ${c.one}`}></div>
      <div className={`${c.lid} ${c.two}`}></div>
      <div className={c.envelope}></div>
      <div className={c.letter}>
        <p>{message}
        </p>
      </div>
    </div>

    </div>
  )
}


// Desde que você apareceu, meu mundo ganhou novas cores e a cada momento ao seu lado parece um sonho que eu nunca quero acordar. Seus olhos têm o brilho que me guia, e seu sorriso é o sol que aquece meu coração. Com você, a vida é mais leve, mais doce e cheia de sentido. Não há lugar no mundo onde eu prefira estar do que ao seu lado, porque é com você que eu me sinto verdadeiramente em casa. ❤️