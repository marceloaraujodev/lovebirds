import React from "react";
import c from "./Post.module.css";
export default function Post() {
  return (
    <div className={c.cont}>
      <h1>Ideias Criativas de Presentes até R$50,00</h1>

      <p>
        Presentear alguém é sobre criar momentos especiais, pessoais e inesquecíveis. Com o <strong>QRCodeLove.com</strong>, você pode transformar suas mensagens carinhosas, memórias e surpresas em
        experiências digitais únicas. Aqui estão algumas ideias de presentes onde você pode usar o QRCodeLove para
        surpreender alguém que ama:
      </p>

      <section className={c.section}>
        <img className={`${c.img} ${c.left}`} src="/wood-gift-box.jpg" alt="gift idea, wooden box with paper qr code" />
          <span className={c.title}>1. Crie a página e imprima o qr code a coloque em uma caixinha de madeira.</span>
          <p>Custo de até: R$40,00</p>
          <p>
            Imagine presentear alguém especial com algo que vai além do físico e cria uma experiência única. Com o
            QRCodeLove, você pode personalizar uma página cheia de memórias, fotos, uma música especial e uma mensagem
            carinhosa. Depois de criar sua página personalizada, imprima o QR code gerado.
            <br />
            <br />
            Agora, para tornar essa surpresa ainda mais especial, compre uma caixinha de madeira elegante ou até mesmo
            faça uma personalizada. Dentro da caixinha, você pode incluir o QR code impresso de uma forma criativa -
            como em um pedaço de papel de alta qualidade, um cartão decorado, ou até mesmo em um pequeno pergaminho.
            <br />
            <br />
            Quando a pessoa abrir a caixa, além do QR code, você pode adicionar outros pequenos mimos, como uma carta
            escrita à mão, pétalas de flores, ou um pequeno presente. O QR code será o ponto principal da surpresa: ao
            escaneá-lo, a pessoa será direcionada para a página especial que você criou, onde todas as suas memórias,
            fotos e mensagem estão esperando para serem descobertas.
          </p>
        
      </section>

      <section className={c.section}>
        <img className={`${c.img} ${c.right}`} src="/qrcode-espelho.jpeg" alt="gift idea, qr code tapped to the mirror" />
          <span className={c.title}>2. Surpresa no Espelho do Banheiro com QR Code</span>
          <p>Custo de até: R$20,00</p>
          <p>
            Imagine presentear alguém especial com algo que vai além do físico e cria uma experiência única. Com o
            QRCodeLove, você pode personalizar uma página cheia de memórias, fotos, uma música especial e uma mensagem
            carinhosa. Depois de criar sua página personalizada, imprima o QR code gerado.
            <br />
            <br />
            Agora, para tornar essa surpresa ainda mais especial, compre uma caixinha de madeira elegante ou até mesmo
            faça uma personalizada. Dentro da caixinha, você pode incluir o QR code impresso de uma forma criativa -
            como em um pedaço de papel de alta qualidade, um cartão decorado, ou até mesmo em um pequeno pergaminho.
            <br />
            <br />
            Quando a pessoa abrir a caixa, além do QR code, você pode adicionar outros pequenos mimos, como uma carta
            escrita à mão, pétalas de flores, ou um pequeno presente. O QR code será o ponto principal da surpresa: ao
            escaneá-lo, a pessoa será direcionada para a página especial que você criou, onde todas as suas memórias,
            fotos e mensagem estão esperando para serem descobertas.
          </p>
        
      </section>

      {/* <h3>2. Surpreenda Seu Melhor Amigo</h3>
      <p>
        Nada fortalece uma amizade como relembrar bons momentos. Use o QRCodeLove para criar uma apresentação de fotos
        das aventuras que viveram juntos, acompanhada de uma mensagem sobre o quanto essa amizade significa para você. O
        QR code pode ser entregue em uma celebração ou como uma surpresa inesperada para mostrar seu apreço.
      </p>

      <h3>3. Quebre o Gelo com um Presente Único</h3>
      <p>
        Iniciar uma conversa em um bar ou balada ficou muito mais fácil. Crie uma apresentação divertida e leve usando o
        QRCodeLove, com fotos e uma mensagem descontraída. Entregue o QR code à pessoa como uma forma original e
        divertida de se apresentar, deixando uma impressão duradoura.
      </p>

      <h3>4. Presente Personalizado para Ocasiões Especiais</h3>
      <p>
        Seja em aniversários, feriados ou datas comemorativas, o QRCodeLove permite que você presenteie com memórias.
        Junte fotos significativas, escreva uma mensagem especial e adicione uma música favorita para criar um presente
        digital inesquecível. Imagine entregar esse presente em um cartão ou durante um evento especial, onde a pessoa
        pode escanear e curtir na hora.
      </p>

      <h3>5. Amor à Distância</h3>
      <p>
        Se você está em um relacionamento à distância, o QRCodeLove oferece a maneira perfeita de se conectar. Envie ao
        seu parceiro um slide show digital com uma mensagem carinhosa e uma música especial, tudo através de um simples
        QR code. É uma forma moderna de diminuir a distância e mostrar que você está pensando nele, onde quer que
        esteja.
      </p> */}

      <h3>Como Funciona</h3>
      <p>
        Basta fazer o upload das fotos, escolher uma música, escrever uma mensagem pessoal e o QRCodeLove vai gerar um
        QR code exclusivo para você presentear. É uma maneira rápida, divertida e personalizada de tornar o dia de
        alguém ainda mais especial. Seja para surpreender alguém especial ou quebrar o gelo com uma nova pessoa, o
        QRCodeLove oferece as ferramentas para criar algo verdadeiramente inesquecível.
      </p>

    </div>
  );
}
