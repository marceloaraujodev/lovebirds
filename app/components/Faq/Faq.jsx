import Button from '../Button/Button'
import c from './Faq.module.css'
export default function Faq() {
  return (
    <div className={c.faqCont}>
      <h2 className={c.title}>FAQ</h2>
      <div className={c.faqCardCont}>
        <div className={c.faqCard}>
          <h2>O que é a Qrcodelove?</h2>
          <p>
          Qrcodelove permite que casais criem páginas personalizadas de relacionamento, onde é possível adicionar fotos, uma mensagem significativa e um contador que revela há quanto tempo estão juntos.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como posso criar uma página personalizada na Qrcodelove?</h2>
          <p>
          Preencha o formulário com o nome do casal, a data de início do relacionamento, uma mensagem de declaração e até 5 fotos. Depois, clique no botão Criar e finalize o pagamento.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>O que está incluído na minha página personalizada?</h2>
          <p>
          Página personalizada com um contador em tempo real do seu relacionamento, uma apresentação de slides com suas fotos e uma declaração especial, acompanhada de uma animação de emojis de coração caindo a cada troca de imagem.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como recebo minha página personalizada após o pagamento?</h2>
          <p>
          Você receberá um QR code e um link por email para compartilhar com seu parceiro(a) e accessar a página.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>A página personalizada tem validade?</h2>
          <p>
          Sim, 1 ano. 
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Qual é o custo para criar uma página no Qrcodelove?</h2>
          <p>
          O valor é de R$15,99.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Quanto tempo demora para receber o QR Code no e-mail?</h2>
          <p>
          Pagamentos com cartão de crédito são processados instantaneamente, enquanto pagamentos por boleto podem levar de 1 a 3 dias úteis para serem compensados.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como posso entrar em contato com o suporte ao cliente?</h2>
          <p>
          Você pode entrar em contato com nosso suporte ao cliente através do e-mail qrcodelovebr@gmail.com.
          </p>
        </div>
      </div>

      <Button />
    </div>
  )
}