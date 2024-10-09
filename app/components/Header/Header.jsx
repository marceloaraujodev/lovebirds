
import c from './Header.module.css'

export default function Header() {
  return (
    <header className={c.header}>
    <a className={c.link} href='https://www.qrcodelove.com'><img className={c.logoQr} src='/neonlogo-clean2.png' alt='logo' />QR CODE LOVE</a>
  </header>
  )
}