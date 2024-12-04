import c from "./Instructions.module.css";
export default function Instructions() {
  return (
    <div className={c.cont} id="instructions">
      <h2>Instruções</h2>
      <div className={c.cardCont}>
        <div className={c.card}>
          <img className={`${c.cardIcon} ${c.formIcon}`} src="/form.png" alt="money cash coin image" />
          <p>Preencha os campos ✍️</p>
        </div>
        <div className={c.card}>
          <img className={c.cardIcon} src="/Wallet-3D-Model.png" alt="money cash coin image" />
          <p>Faça o pagamento</p>
        </div>
        <div className={c.card}>
          <img className={c.cardIcon} src="/Inbox-Animated-3D-Icon-2.png" alt="email 3d image" />
          <p>Qr code é enviado para o seu email </p>
        </div>
        <div className={`${c.card}`}>
          <div className={`${c.cardIcon} `}>
            <div className={c.qrLogoCont}>
              <img className={`${c.qrLogo}`} src="/logo-example.png" alt="purple giftbox" />
            </div>
          </div>
          <p>4. Faça a surpresa para quem você ama!</p>
        </div>
      </div>
    </div>
  );
}
