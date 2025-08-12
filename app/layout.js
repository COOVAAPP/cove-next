import './globals.css'; import Link from 'next/link';
export default function RootLayout({ children }) {
  return (<html lang="en"><body><div className="container">
    <nav className="nav">
      <div className="brand"><div className="logo">C</div><Link href="/">COOVA</Link></div>
      <div style={{display:'flex', gap:8}}>
        <Link className="btn" href="/list">Browse</Link>
        <Link className="btn" href="/login">Login</Link>
        <Link className="btn primary" href="/list/new">List Your Space</Link>
      </div>
    </nav>{children}
  </div></body></html>);
}