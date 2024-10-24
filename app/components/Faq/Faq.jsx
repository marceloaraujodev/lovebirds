import Button from '../Button/Button'
import c from './Faq.module.css'
export default function Faq() {
  return (
    <div className={c.faqCont} id='faq'>
      <h2 className={c.title}>FAQ</h2>
      <div className={c.faqCardCont}>
        <div className={c.faqCard}>
          <h2>O que é a Qrcodelove?</h2>
          <p>
          Qrcodelove permite que você crie uma página personalizada com um slide, música e uma mensagem para algém que você ama! Perfeito para presentes e mensagens especiais.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como recebo a minha página?</h2>
          <p>
          Depois de preencher o formulário e fazer o pagamento você recebera um email com um qr code. Caso não consiga ver o qr code no seu email um link também será enviado para a sua página. Lá você pode imprimir o qr code caso deseje.
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