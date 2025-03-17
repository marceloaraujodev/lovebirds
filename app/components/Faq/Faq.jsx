import { useState } from 'react';
import Button from '../Button/Button';
import { SlArrowDown } from 'react-icons/sl';
import { SlArrowUp } from 'react-icons/sl';

import c from './Faq.module.css';
export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index, isOpen) => {
    setActiveIndex(isOpen ? index : null); // Set index if open, otherwise reset to null
  };

  const faqItems = [
    {
      question: 'O que é a Qrcodelove?',
      answer:
        'Qrcodelove permite que você crie uma página personalizada com um slide, música e uma mensagem para alguém que você ama! Perfeito para presentes e mensagens especiais.',
    },
    {
      question: 'Como recebo a minha página?',
      answer:
        'Depois de preencher o formulário e fazer o pagamento você receberá um email com um QR code. Caso não consiga ver o QR code no seu email um link também será enviado para a sua página. Lá você pode imprimir o QR code caso deseje.',
    },
    {
      question: 'A página personalizada tem validade?',
      answer: 'Sim, a validade é de 1 ano.',
    },
    {
      question: 'Quanto custa para criar uma página?',
      answer: 'O valor é de R$29,99.',
    },
    {
      question: 'Quanto tempo demora para receber o QR Code no e-mail?',
      answer:
        'Pagamentos com cartão de crédito são processados instantaneamente, enquanto pagamentos por boleto podem levar de 1 a 3 dias úteis para serem compensados.',
    },
    {
      question: 'Como posso entrar em contato com o suporte ao cliente?',
      answer:
        'Você pode entrar em contato com nosso suporte ao cliente através do e-mail qrcodelovebr@gmail.com.',
    },
  ];

  return (
    <div className={c.faqCont} id="faq">
      <h2 className={c.title}>FAQ</h2>
      <div className={c.faqCardCont}>
        {faqItems.map((item, index) => {
          return (
              <details
                key={index}
                className={c.faqCard}
                onToggle={(e) => handleToggle(index, e.target.open)}>
                <summary>
                  {item.question}
                  <span className={c.icon}>
                    {activeIndex === index ? <SlArrowUp /> : <SlArrowDown />}
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
          );
        })}
      </div>

      <Button />
    </div>
  );
}
