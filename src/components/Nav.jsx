import { useEffect, useState } from 'react'
import { NAV } from '../data/content'
import { RegisterButton, asset } from './ui'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-maroon-950/85 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-6xl sm:h-[92px] items-center justify-between px-5">
        <a href="https://ubcpmc.com/" target="_top" className="shrink-0" aria-label="UBC PMC home">
          <img src={asset('pmc-logo.png')} alt="pmc" className="h-[52px] w-auto sm:h-[60px]" />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="text-sm font-semibold text-mist/85 transition hover:text-gold-200">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <RegisterButton className="hidden sm:inline-flex [&_.btn-gold]:px-5 [&_.btn-gold]:py-2 [&_.btn-gold]:text-xs">Register</RegisterButton>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <ul className="border-t border-white/10 px-5 pb-5 pt-2 lg:hidden">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-bold text-mist">
                {n.label}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <RegisterButton>Register</RegisterButton>
          </li>
        </ul>
      )}
    </nav>
  )
}
