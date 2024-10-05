import c from './error.module.css'
export default function page() {
  return (
    <div className={c.errorCont}>
      <div className={c.error}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/">Return to Homepage</a>
      </div>
    </div>
  )
}