import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { EVENT, SPONSORS } from '../data/content'
import { Reveal, Section, SectionHeading, asset } from './ui'

/** A rocks glass (old-fashioned tumbler) with ice. The sponsor sits on a label on the glass. */
function Glass({ children }) {
  return (
    <div className="relative mx-auto w-full max-w-[210px]">
      <svg viewBox="0 0 200 212" className="block w-full" aria-hidden>
        <defs>
          <linearGradient id="g-body" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.38)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
          <linearGradient id="g-whiskey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3b565" />
            <stop offset="1" stopColor="#a8651d" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="204" rx="80" ry="7" fill="rgba(0,0,0,0.5)" />
        {/* glass body */}
        <path d="M26 30 H174 L158 190 Q157 201 146 201 H54 Q43 201 42 190 Z" fill="url(#g-body)" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" />
        {/* drink */}
        <path d="M31 80 H169 L156 186 Q155 193 148 193 H52 Q45 193 44 186 Z" fill="url(#g-whiskey)" opacity="0.92" />
        <ellipse cx="100" cy="80" rx="69" ry="7" fill="#f9cc8c" />
        {/* thick base */}
        <path d="M44 174 H156 L155 188 Q154 197 146 197 H54 Q46 197 45 188 Z" fill="rgba(255,255,255,0.26)" />
        {/* ice */}
        <g fill="rgba(226,242,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
          <rect x="52" y="86" width="44" height="40" rx="8" transform="rotate(-10 74 106)" />
          <rect x="104" y="98" width="42" height="38" rx="8" transform="rotate(8 125 117)" />
          <rect x="74" y="132" width="40" height="36" rx="8" transform="rotate(-4 94 150)" />
        </g>
        {/* rim + highlights */}
        <ellipse cx="100" cy="30" rx="74" ry="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
        <path d="M40 46 L49 168" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round" />
        <path d="M163 50 L156 116" stroke="rgba(255,255,255,0.32)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {/* label */}
      <div className="absolute left-1/2 top-[46%] grid aspect-[4/3] w-[48%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-mist/95 p-2 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        {children}
      </div>
    </div>
  )
}

/** Slides in from the right like a glass pushed along a bar, then stops in its spot */
function GlassCell({ i, s }) {
  const Wrapper = s?.url ? 'a' : 'div'
  const dur = 1.5 + i * 0.16
  // Watch the (stationary) cell, not the glass: it starts off-screen, so it can't trigger itself.
  const cellRef = useRef(null)
  const go = useInView(cellRef, { once: true, margin: '-80px' })
  return (
    <div ref={cellRef} className="relative w-1/2 md:w-1/4">
      <motion.div
        initial={{ x: '125vw', skewX: -7 }}
        animate={go ? { x: 0, skewX: 0 } : { x: '125vw', skewX: -7 }}
        transition={{
          x: { duration: dur, delay: i * 0.18, ease: [0.08, 0.8, 0.2, 1] },
          skewX: { duration: dur, delay: i * 0.18, ease: 'easeOut' },
        }}
        className="relative z-10 px-3"
      >
        <Wrapper {...(s?.url ? { href: s.url, target: '_blank', rel: 'noopener noreferrer' } : {})} className="block">
          <Glass>
            {s ? (
              <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-center">
                <img src={asset(i % 2 ? 'chip-blue.png' : 'chip-red.png')} alt="" className="mx-auto h-8 w-8" />
                <p className="mt-1 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-charcoal/70">Sponsor TBA</p>
              </div>
            )}
          </Glass>
        </Wrapper>
      </motion.div>
      {/* the bar top stays put while the glass slides */}
      <div className="bar-top -mt-[18px]" />
      <motion.div
        className="mt-5 px-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: go ? 1 : 0 }}
        transition={{ delay: go ? dur + i * 0.18 - 0.4 : 0, duration: 0.6 }}
      >
        {s ? (
          <>
            {s.tier && <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-400">{s.tier}</p>}
            <h3 className="text-lg font-extrabold">{s.name}</h3>
            {s.description && <p className="mt-1 text-sm leading-relaxed text-mist/70">{s.description}</p>}
          </>
        ) : (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mist/50">Coming soon</p>
        )}
      </motion.div>
    </div>
  )
}

export default function Sponsors() {
  const has = SPONSORS.length > 0
  const items = has ? SPONSORS : [null, null, null, null]
  return (
    <Section id="sponsors">
      <SectionHeading>
        Our <span className="brand-text">sponsors</span>
      </SectionHeading>

      <div className="flex flex-wrap justify-center gap-y-14">
        {items.map((s, i) => (
          <GlassCell key={s?.name ?? i} i={i} s={s} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-14 text-center text-mist/70">
          Want to be part of it?{' '}
          <a href={`mailto:${EVENT.contactEmail}?subject=Product%20Jackpot%20sponsorship`} className="font-bold text-gold-200 underline-offset-4 hover:underline">
            Get in touch about sponsoring
          </a>
        </p>
      </Reveal>
    </Section>
  )
}
