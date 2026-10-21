import { useState } from 'react'
import { EVENT, FOOTER_LINKS, SOCIALS } from '../data/content'
import { asset } from './ui'

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1z" />,
  linkedin: (
    <>
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="5" r="2" />
      <path d="M10 9h4v2c1-1.5 2.5-2.3 4-2.3 3 0 4 2 4 5V21h-4v-6c0-1.5-.5-2.5-2-2.5S14 13.5 14 15v6h-4z" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!EVENT.newsletterEndpoint) {
      setMsg('Newsletter signup is coming soon!')
      return
    }
    try {
      const res = await fetch(EVENT.newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setMsg("You're in! Check your inbox.")
      setEmail('')
    } catch {
      setMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <h2 className="text-2xl font-extrabold sm:text-3xl">Sign up for our newsletter!</h2>
      <div className="mt-5 flex gap-2">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-black/40 px-5 py-3 text-base text-white outline-none placeholder:text-mist/40 focus:border-gold-400"
        />
        <button type="submit" className="rounded-full bg-signal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:brightness-110">
          Join
        </button>
      </div>
      {msg && <p role="status" className="mt-3 text-sm text-gold-200">{msg}</p>}
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[1.3fr_0.7fr_0.8fr]">
        <div>
          <a href="https://ubcpmc.com/" className="mb-8 inline-block" aria-label="UBC PMC home">
            <img src={asset('pmc-logo.png')} alt="pmc" className="h-24 w-auto" />
          </a>
          <Newsletter />
        </div>

        <ul className="space-y-3">
          {FOOTER_LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="text-base font-semibold text-mist/80 transition hover:text-gold-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-mist transition hover:border-gold-400 hover:text-gold-200 hover:shadow-[0_0_20px_rgba(232,165,75,0.4)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[s.icon]}
                </svg>
              </a>
            ))}
          </div>
          <a href={`mailto:${EVENT.contactEmail}`} className="mt-6 inline-block text-base font-bold text-gold-200 underline-offset-4 hover:underline">
            Contact us
          </a>
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-white/10 pt-6 text-sm text-mist/50">© UBC Product Management Club 2026.</p>
    </footer>
  )
}
