import Button from '../Button/Button';
import c from './Example.module.css'
export default function Example() {

  return (
    <>
    <div className={c.cont} id='example'>
      <div className={c.qrAndArrows}>
        <div className={c.x}>
          <div className={c.leftBlock}>
          <img className={c.qrcode} src='/logo-example.png' alt='Example' />
          <img className={c.arrowHearts} src='/arrohearts-white.png' alt='arrow hearts' />
          </div>
          <div className={c.textCont}>
            <p className={c.read}>1. Leia o qrcode</p>
            <p className={`${c.read} ${c.step2} ${c.step2Cont}`}>2.&nbsp;<span className={c.ready}>Sua Surpresa!</span></p>
          </div>
        </div>

        <div>
        <img className={c.cell} src='/cellphone.png' alt='Example' />
        </div>
      </div>
    </div>
    <Button />
    </>
  )
}