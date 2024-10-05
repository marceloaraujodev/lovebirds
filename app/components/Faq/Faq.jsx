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
            Qrcodelove é uma plataforma que permite criar páginas personalizadas de relacionamento para casais. Você pode adicionar fotos, uma mensagem especial e um contador que mostra há quanto tempo vocês estão juntos.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como posso criar uma página personalizada na Qrcodelove?</h2>
          <p>
          Para criar uma página personalizada, preencha o formulário com os nomes do casal, a data de início do relacionamento, uma mensagem de declaração e até 5 fotos. Depois, clique no botão "Criar" e finalize o pagamento.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>O que está incluído na minha página personalizada?</h2>
          <p>
          Sua página personalizada incluirá um contador ao vivo mostrando há quanto tempo vocês estão juntos, uma apresentação de slides com suas fotos e uma mensagem especial de declaração. Além disso, haverá um efeito com emojis de coração caindo a cada troca de foto.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como recebo minha página personalizada após o pagamento?</h2>
          <p>
          Após a conclusão do pagamento, você receberá um QR code para compartilhar com seu parceiro(a) e um link via e-mail para acessar a página.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>A página personalizada tem validade?</h2>
          <p>
          No preço básico sim, 1 ano. No plano avançado, a página personalizada estará disponível para você pelo resto da vida.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Posso editar minha página depois de criá-la?</h2>
          <p>
          Sim. Assim que você receber o link para a sua página, ele incluirá uma seção de edição que você pode usar para fazer alterações.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Qual é o custo para criar uma página no Qrcodelove?</h2>
          <p>
          No momento, o custo para criar uma página na Loveyuu é de apenas R$15,99 no preço básico e R$39,99 no preço avançado.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Quanto tempo demora para receber o QR Code no e-mail?</h2>
          <p>
          Pagamentos com cartão de crédito ficam prontos na hora. Pagamentos por boleto podem demorar de 1 a 3 dias úteis para compensar.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Quais são as formas de pagamento?</h2>
          <p>
          Aceitamos boleto e cartão de crédito.
          </p>
        </div>
        <div className={c.faqCard}>
          <h2>Como posso entrar em contato com o suporte ao cliente?</h2>
          <p>
          Você pode entrar em contato com nosso suporte ao cliente através do e-mail .
          </p>
        </div>
      </div>

      <Button />
    </div>
  )
}