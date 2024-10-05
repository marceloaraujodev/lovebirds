import c from './Header.module.css'
export default function Header() {
  return (
    <header className={c.header}>
    QR CODE<img className={c.logoQr} src='/logo.png' alt='logo' />
    Love
    <div className={c.heartLogo}>❤️</div>
  </header>
  )
}