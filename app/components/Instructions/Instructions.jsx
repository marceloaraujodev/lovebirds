
import { MdOutlinePayment } from "react-icons/md";
import c from './Instructions.module.css'
export default function Instructions() {
  return (
    <div className={c.cont}>
      <h2>Instruções</h2>
      <div className={c.cardCont}>
        <div className={c.card}>
          1.Preencha os campos
        </div>
        <div className={c.card}>
          2. Faça o pagamento <MdOutlinePayment color="purple" />
        </div>
        <div className={c.card}>
          3. Qr code é enviado para o seu email
        </div>
        <div className={c.card}>
          4. Faça a surpresa para quem você ama! ❤️. 
        </div>
      </div>
    </div>
  )
}