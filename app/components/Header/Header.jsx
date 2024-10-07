import c from './Header.module.css'
export default function Header() {
  return (
    <header className={c.header}>
    <img className={c.logoQr} src='/logoQRcodeHeart.png' alt='logo' />QR CODE LOVE
  </header>
  )
}