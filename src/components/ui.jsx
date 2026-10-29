import { motion } from 'motion/react'
import { EVENT } from '../data/content'

export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`

export const SUITS = {
  heart: { img: 'suit-heart.png', tone: 'red' },
  diamond: { img: 'suit-diamond.png', tone: 'red' },
  club: { img: 'suit-club.png', tone: 'navy' },
  spade: { img: 'suit-spade.png', tone: 'navy' },
}

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ children }) {
  return (
    <Reveal className="mb-12 text-center">
      <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">{children}</h2>
    </Reveal>
  )
}

export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`relative isolate overflow-hidden px-5 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** Face-up playing card. Pass children to put custom content in the middle instead of the big suit. */
export function PlayingCard({ suit = 'heart', rank = 'A', className = '', style, children }) {
  const s = SUITS[suit]
  return (
    <div className={`pcard ${s.tone} ${className}`} style={style}>
      <span className="corner tl">
        {rank}
        <img src={asset(s.img)} alt="" />
      </span>
      {children ?? (
        <img
          src={asset(s.img)}
          alt=""
          className="absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
          style={{ width: '44cqw' }}
        />
      )}
      <span className="corner br">
        {rank}
        <img src={asset(s.img)} alt="" />
      </span>
    </div>
  )
}

/** Gentle endless float */
export function Float({ children, amp = 12, rot = 2, duration = 6, delay = 0, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -amp, 0], rotate: [0, rot, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Register button. Until EVENT.registerUrl is filled in it reads
 * "Registration Opens Soon" and isn't clickable.
 */
export function RegisterButton({ className = '', children = 'Register now' }) {
  const url = EVENT.registerUrl
  return (
    <span className={`relative inline-flex flex-col items-start ${className}`}>
      {url ? (
        <a href={url} className="btn-gold" target="_blank" rel="noopener noreferrer">
          {children}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      ) : (
        <span className="btn-gold cursor-default">Registration Opens Soon</span>
      )}
    </span>
  )
}

/** A button that is a playing card (used in the hero) */
export function CardButton({ suit = 'heart', rank = 'A', lines = [], href, onClick, rotate = 0, external = false, textSize = '11.5cqw' }) {
  const s = SUITS[suit]
  return (
    <motion.a
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`pcard ${s.tone} block w-[9.4rem] select-none sm:w-44 ${href ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ rotate }}
      whileHover={{ y: -14, rotate: 0, scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      <span className="corner tl">
        {rank}
        <img src={asset(s.img)} alt="" />
      </span>
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-[5cqw] px-[10cqw] text-center">
        <img src={asset(s.img)} alt="" style={{ width: '26cqw' }} />
        <span className="font-extrabold uppercase leading-[1.12] tracking-[0.03em]" style={{ fontFamily: 'var(--font-sans)', fontSize: textSize }}>
          {lines.map((l) => (
            <span className="block" key={l}>{l}</span>
          ))}
        </span>
      </span>
      <span className="corner br">
        {rank}
        <img src={asset(s.img)} alt="" />
      </span>
    </motion.a>
  )
}

/** Register as a playing card. Reads "Registration opens soon" until EVENT.registerUrl is filled in. */
export function RegisterCard({ rotate = -5 }) {
  const url = EVENT.registerUrl
  return url ? (
    <CardButton suit="heart" lines={['Register', 'now']} href={url} rotate={rotate} external />
  ) : (
    <CardButton suit="heart" lines={['Registration', 'opens Nov 4']} rotate={rotate} textSize="9cqw" />
  )
}
