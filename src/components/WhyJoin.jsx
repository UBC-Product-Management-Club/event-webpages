import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { WHY_JOIN } from '../data/content'
import { PlayingCard, Section, SectionHeading, asset } from './ui'

const SUIT_ORDER = ['heart', 'spade', 'diamond', 'club', 'heart']
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ZERO = { x: 0, y: 0, rotate: 0 }

function shuffled(arr) {
  const a = [...arr]
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  } while (a.every((v, i) => v === arr[i]))
  return a
}

function Slot({ item, slot, pose, dur, faceUp, busy, onShuffle, setRef }) {
  const suit = SUIT_ORDER[item % SUIT_ORDER.length]
  return (
    <motion.div
      ref={setRef}
      className="aspect-[5/7] w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)]"
      animate={pose}
      transition={{ duration: dur, ease: [0.4, 0, 0.2, 1] }}
      whileHover={busy ? undefined : { y: -10 }}
      style={{ zIndex: busy ? 5 + slot : 1 }}
    >
      <button type="button" onClick={onShuffle} aria-label={`${WHY_JOIN[item]}. Tap to shuffle the cards`} className="flip h-full w-full cursor-pointer text-left" data-flipped={faceUp}>
        <div className="flip-inner" style={{ transitionDelay: faceUp ? `${slot * 120}ms` : '0ms' }}>
          {/* back (face down) */}
          <div className="flip-face overflow-hidden rounded-[6%/4.3%] shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
            <img src={asset('card-back.png')} alt="" className="h-full w-full object-cover" />
          </div>
          {/* front (face up) */}
          <div className="flip-face flip-front">
            <PlayingCard suit={suit} rank={String(item + 1).padStart(2, '0')} className="h-full w-full">
              <p className="absolute inset-0 grid place-items-center px-[15cqw] text-center text-[11.5cqw] font-bold leading-[1.12]">{WHY_JOIN[item]}</p>
            </PlayingCard>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export default function WhyJoin() {
  const wrapRef = useRef(null)
  const slotRefs = useRef([])
  const inView = useInView(wrapRef, { once: true, margin: '-120px' })
  const busyRef = useRef(false)
  const [busy, setBusy] = useState(false)
  const [order, setOrder] = useState(WHY_JOIN.map((_, i) => i))
  const [pose, setPose] = useState(WHY_JOIN.map(() => ZERO))
  const [dur, setDur] = useState(0.5)
  const [flippedUp, setFlippedUp] = useState(true)
  const faceUp = inView && flippedUp

  // tap: gather into a deck, riffle, reorder, deal back out
  const shuffle = async () => {
    if (busyRef.current || !inView) return
    busyRef.current = true
    setBusy(true)
    const wrap = wrapRef.current.getBoundingClientRect()
    const cx = wrap.left + wrap.width / 2
    const cy = wrap.top + wrap.height / 2
    const base = slotRefs.current.map((el, i) => {
      const r = el.getBoundingClientRect()
      return { x: cx - (r.left + r.width / 2) + (i - 2) * 3, y: cy - (r.top + r.height / 2) - (i - 2) * 2, rotate: (i - 2) * 2 }
    })
    setFlippedUp(false)
    setDur(0.55)
    setPose(base)
    await sleep(750)
    setDur(0.15)
    for (let n = 0; n < 3; n++) {
      setPose(base.map((b, i) => ({ ...b, x: b.x + (i % 2 ? 80 : -80), rotate: b.rotate + (i % 2 ? 9 : -9) })))
      await sleep(170)
      setPose(base)
      await sleep(170)
    }
    setOrder((o) => shuffled(o))
    await sleep(60)
    setDur(0.75)
    setPose(WHY_JOIN.map(() => ZERO))
    setFlippedUp(true)
    await sleep(1200)
    busyRef.current = false
    setBusy(false)
  }

  return (
    <Section id="why">
      <SectionHeading>
        Why <span className="brand-text">join?</span>
      </SectionHeading>
      <div ref={wrapRef} className="flex flex-wrap justify-center gap-4">
        {order.map((item, slot) => (
          <Slot
            key={slot}
            item={item}
            slot={slot}
            pose={pose[slot]}
            dur={dur}
            faceUp={faceUp}
            busy={busy}
            onShuffle={shuffle}
            setRef={(el) => (slotRefs.current[slot] = el)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={shuffle}
        className="mx-auto mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-400 underline-offset-4 hover:underline"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
        </svg>
        Tap to shuffle
      </button>
    </Section>
  )
}
