import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const TILT = [-4, 3, -2, 5]
const RAD = Math.PI / 180

/**
 * A grid of cards that, when scrolled into view, starts as a squared-up hand,
 * fans open like a player spreading their cards, then relaxes into the grid.
 * Hovering a card pulls it up out of the hand.
 *
 * items: [{ key, card, caption, href? }]  (card should fill its box: className="h-full w-full")
 */
export default function FanHand({ items, className = '' }) {
  const wrapRef = useRef(null)
  const cardRefs = useRef([])
  const inView = useInView(wrapRef, { once: true, margin: '-120px' })
  const [layout, setLayout] = useState(null)
  const [phase, setPhase] = useState('hidden') // hidden | hand | fan | done

  // measure where each card should end up (re-measure on resize)
  useEffect(() => {
    const measure = () => {
      const base = wrapRef.current.getBoundingClientRect()
      setLayout({
        w: base.width,
        h: base.height,
        rects: cardRefs.current.map((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }
        }),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [items.length])

  const ready = !!layout
  useEffect(() => {
    if (!inView || !ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    let dead = false
    const step = async (ms, fn) => {
      if (dead) return
      fn()
      await sleep(ms)
    }
    ;(async () => {
      await step(550, () => setPhase('hand'))
      await step(items.length * 70 + 1300, () => setPhase('fan'))
      await step(0, () => setPhase('done'))
    })()
    return () => {
      dead = true
    }
  }, [inView, ready, items.length])

  const pose = (i) => {
    const { w: wrapW, h: wrapH, rects } = layout
    const r = rects[i]
    const n = items.length
    const k = i - (n - 1) / 2
    // the hand sits in the middle of the section
    const cx = wrapW / 2 - r.w / 2
    const cy = Math.max(0, wrapH / 2 - r.h / 2 - r.h * 0.15)
    if (phase === 'hidden') return { x: cx, y: cy + r.h * 0.6, rotate: 0, scale: 0.9, opacity: 0 }
    if (phase === 'hand') return { x: cx + k * 2, y: cy + Math.abs(k) * 1.5, rotate: k * 1.5, scale: 1, opacity: 1 }
    if (phase === 'fan') {
      // cards swing around a pivot below the hand; shrink the arc to fit narrow screens
      const step = Math.min(14, 70 / Math.max(1, n - 1))
      const maxA = (step * (n - 1)) / 2
      let R = r.h * 1.5
      const room = (wrapW - r.w) / 2
      if (maxA > 0 && R * Math.sin(maxA * RAD) > room) R = room / Math.sin(maxA * RAD)
      const a = k * step
      return { x: cx + R * Math.sin(a * RAD), y: cy + R * (1 - Math.cos(a * RAD)), rotate: a, scale: 1, opacity: 1 }
    }
    return { x: r.x, y: r.y, rotate: TILT[i % TILT.length], scale: 1, opacity: 1 }
  }
  const transition = (i) => {
    if (phase === 'hidden' || phase === 'hand') return { duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }
    if (phase === 'fan') return { type: 'spring', stiffness: 90, damping: 13, delay: Math.abs(i - (items.length - 1) / 2) * 0.07 }
    return { type: 'spring', stiffness: 120, damping: 17, delay: i * 0.06 }
  }
  const done = phase === 'done'

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* invisible slots that define the final layout */}
      {items.map((it, i) => (
        <div key={it.key} className="mx-auto w-full max-w-[210px]">
          <div ref={(el) => (cardRefs.current[i] = el)} className="aspect-[5/7] w-full" aria-hidden />
          <motion.div className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            {it.caption}
          </motion.div>
        </div>
      ))}

      {/* the cards themselves */}
      {layout &&
        items.map((it, i) => {
          const Wrapper = it.href && done ? 'a' : 'div'
          return (
            <motion.div
              key={it.key}
              className="absolute left-0 top-0"
              style={{ width: layout.rects[i].w, height: layout.rects[i].h, zIndex: done ? 1 : i + 1, transformOrigin: '50% 100%' }}
              initial={false}
              animate={pose(i)}
              transition={transition(i)}
              whileHover={done ? { y: layout.rects[i].y - 22, rotate: 0, scale: 1.06, zIndex: 10, transition: { type: 'spring', stiffness: 260, damping: 18 } } : undefined}
            >
              <Wrapper
                {...(it.href && done ? { href: it.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block h-full w-full rounded-[6%/4.3%] shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              >
                {it.card}
              </Wrapper>
            </motion.div>
          )
        })}
    </div>
  )
}
