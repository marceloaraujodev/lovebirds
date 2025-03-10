'use client'
import React from 'react'
import { useState } from 'react'
import c from './LetterAnimation.module.css'

export default function LetterAnimation() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={c.container}>
      <div  className={`${c.wrapper} ${isOpen ? c.open : ''}`}>
      <div className={`${c.lid} ${isOpen ? c.open : c.one}`}></div>
      <div className={`${c.lid} ${c.two}`}></div>
      <div className={c.envelope}></div>
      <div className={c.letter}>
        <p>Desde que você apareceu, meu mundo ganhou novas cores e a cada momento ao seu lado parece um sonho que eu nunca quero acordar. Seus olhos têm o brilho que me guia, e seu sorriso é o sol que aquece meu coração. Com você, a vida é mais leve, mais doce e cheia de sentido. Não há lugar no mundo onde eu prefira estar do que ao seu lado, porque é com você que eu me sinto verdadeiramente em casa. ❤️

        Desde que você apareceu, meu mundo ganhou novas cores e a cada momento ao seu lado parece um sonho que eu nunca quero acordar. Seus olhos têm o brilho que me guia, e seu sorriso é o sol que aquece meu coração. Com você, a vida é mais leve, mais doce e cheia de sentido. Não há lugar no mundo onde eu prefira estar do que ao seu lado, porque é com você que eu me sinto verdadeiramente em casa. ❤️
        Desde que você apareceu, meu mundo ganhou novas cores e a cada momento ao seu lado parece um sonho que eu nunca quero acordar. Seus olhos têm o brilho que me guia, e seu sorriso é o sol que aquece meu coração. Com você, a vida é mais leve, mais doce e cheia de sentido. Não há lugar no mundo onde eu prefira estar do que ao seu lado, porque é com você que eu me sinto verdadeiramente em casa. ❤️
        </p>
      </div>
    </div>

    </div>
  )
}


// Desde que você apareceu, meu mundo ganhou novas cores e a cada momento ao seu lado parece um sonho que eu nunca quero acordar. Seus olhos têm o brilho que me guia, e seu sorriso é o sol que aquece meu coração. Com você, a vida é mais leve, mais doce e cheia de sentido. Não há lugar no mundo onde eu prefira estar do que ao seu lado, porque é com você que eu me sinto verdadeiramente em casa. ❤️