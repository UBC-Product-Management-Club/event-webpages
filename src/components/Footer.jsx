import { useState } from 'react'
import { CONTACT_EMAILS, EVENT, FOOTER_LINKS, SOCIALS } from '../data/content'

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="5" r="2" />
      <path d="M10 9h4v2c1-1.5 2.5-2.3 4-2.3 3 0 4 2 4 5V21h-4v-6c0-1.5-.5-2.5-2-2.5S14 13.5 14 15v6h-4z" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Loops asks custom forms to rate limit on the client: one signup per browser per minute
const RATE_KEY = 'loops-form-timestamp'
const RATE_MS = 60 * 1000

const HEADING = 'mb-5 text-sm font-extrabold uppercase tracking-[0.25em] text-gold-400'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [msg, setMsg] = useState('')

  const fail = (text) => {
    setStatus('error')
    setMsg(text)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'loading') return
    const value = email.trim()
    if (!EMAIL_RE.test(value)) return fail('Please enter a valid email address.')
    if (!EVENT.newsletterEndpoint) return fail('Newsletter signup is coming soon!')

    let last = 0
    try {
      last = Number(localStorage.getItem(RATE_KEY)) || 0
    } catch {}
    if (Date.now() - last < RATE_MS) return fail('Too many signups, please try again in a minute.')

    setStatus('loading')
    setMsg('Signing you up…')
    try {
      // Loops' public form endpoint takes the email as form data; no API key involved
      const res = await fetch(EVENT.newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: value }).toString(),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 429) return fail('Too many signups, please try again in a little while.')
      if (!res.ok || !data.success) return fail(data.message || 'Something went wrong. Please try again.')
      try {
        localStorage.setItem(RATE_KEY, String(Date.now()))
      } catch {}
      setStatus('success')
      setMsg("You're in! Thanks for signing up.")
      setEmail('')
    } catch {
      fail('Could not reach the signup service. Check your connection and try again.')
    }
  }

  const loading = status === 'loading'
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <h2 className="text-2xl font-extrabold text-gold-400 sm:text-3xl">Sign up for our newsletter!</h2>
      <div className="mt-5 flex gap-2">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          aria-invalid={status === 'error'}
          aria-describedby="nl-status"
          disabled={loading}
          placeholder="you@email.com"
          className={`min-w-0 flex-1 rounded-full border bg-black/40 px-5 py-3 text-base text-white outline-none placeholder:text-mist/40 focus:border-gold-400 disabled:opacity-60 ${status === 'error' ? 'border-signal' : 'border-white/20'}`}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-signal px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p id="nl-status" role="status" aria-live="polite" className={`mt-3 min-h-[1.25rem] text-sm ${status === 'error' ? 'text-[#ff8a98]' : 'text-gold-200'}`}>
        {msg}
      </p>
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[1.3fr_0.7fr_0.8fr]">
        <div>
          <Newsletter />
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className={HEADING}>
            Navigation
          </h2>
          <ul className="space-y-3">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_top" className="text-base font-semibold text-mist/80 transition hover:text-gold-200">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={HEADING}>Contact Us</h2>
          <ul className="space-y-3">
            {CONTACT_EMAILS.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="break-all text-base font-semibold text-mist/80 transition hover:text-gold-200">
                  {email}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
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
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-white/10 pt-6 text-sm text-mist/50">© UBC Product Management Club 2026.</p>
    </footer>
  )
}
