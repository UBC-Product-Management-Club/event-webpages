import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { asset } from './ui'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const TILT = [-4, 3, -2, 5]

/**
 * A grid of cards that, when scrolled into view, starts as a face-down deck,
 * gets riffle-shuffled, then is dealt out into the grid and flipped face up.
 *
 * items: [{ key, card, caption, href? }]  (card should fill its box: className="h-full w-full")
 */
export default function ShuffleDeal({ items, className = '' }) {
  const wrapRef = useRef(null)
  const cardRefs = useRef([])
  const inView = useInView(wrapRef, { once: true, margin: '-120px' })
  const [rects, setRects] = useState(null)
  const [phase, setPhase] = useState('hidden') // hidden | stack | cut | deal | done
  const [faceUp, setFaceUp] = useState(false)

  // measure where each card should end up (re-measure on resize)
  useEffect(() => {
    const measure = () => {
      const base = wrapRef.current.getBoundingClientRect()
      setRects(
        cardRefs.current.map((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }
        })
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [items.length])

  const ready = !!rects
  useEffect(() => {
    if (!inView || !ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      setFaceUp(true)
      return
    }
    let dead = false
    const step = async (ms, fn) => {
      if (dead) return
      fn()
      await sleep(ms)
    }
    ;(async () => {
      await step(650, () => setPhase('stack'))
      for (let n = 0; n < 3; n++) {
        await step(260, () => setPhase('cut'))
        await step(220, () => setPhase('stack'))
      }
      await step(0, () => setPhase('deal'))
      await sleep(items.length * 130 + 700)
      await step(0, () => setFaceUp(true))
      await sleep(1000)
      if (!dead) setPhase('done')
    })()
    return () => {
      dead = true
    }
  }, [inView, ready, items.length])

  const wrapW = wrapRef.current?.getBoundingClientRect().width ?? 0
  const pose = (i) => {
    const r = rects[i]
    const mid = (items.length - 1) / 2
    const first = rects[0]
    const cx = wrapW / 2 - r.w / 2
    const cy = first.y
    const k = i - mid
    if (phase === 'hidden') return { x: cx, y: cy, rotate: 0, opacity: 0 }
    if (phase === 'stack') return { x: cx + k * 1.4, y: cy - k * 1.2, rotate: k * 1.2, opacity: 1 }
    if (phase === 'cut') return { x: cx + (i % 2 ? 1 : -1) * r.w * 0.55, y: cy - k * 1.2, rotate: (i % 2 ? 1 : -1) * 9, opacity: 1 }
    return { x: r.x, y: r.y, rotate: TILT[i % TILT.length], opacity: 1 }
  }
  const transition = (i) => {
    if (phase === 'hidden' || phase === 'stack') return { duration: 0.35, ease: 'easeInOut' }
    if (phase === 'cut') return { duration: 0.22, ease: 'easeInOut' }
    if (phase === 'deal') return { type: 'spring', stiffness: 110, damping: 15, delay: i * 0.13 }
    return { type: 'spring', stiffness: 200, damping: 22 }
  }
  const dealt = phase === 'done'

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* invisible slots that define the final layout */}
      {items.map((it, i) => (
        <div key={it.key} className="mx-auto w-full max-w-[210px]">
          <div ref={(el) => (cardRefs.current[i] = el)} className="aspect-[5/7] w-full" aria-hidden />
          <motion.div className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: dealt ? 1 : 0 }} transition={{ duration: 0.6 }}>
            {it.caption}
          </motion.div>
        </div>
      ))}

      {/* the cards themselves */}
      {rects &&
        items.map((it, i) => {
          const Wrapper = it.href && dealt ? 'a' : 'div'
          return (
            <motion.div
              key={it.key}
              className="absolute left-0 top-0"
              style={{ width: rects[i].w, height: rects[i].h, zIndex: dealt ? 1 : i + 1 }}
              initial={false}
              animate={pose(i)}
              transition={transition(i)}
              whileHover={dealt ? { y: rects[i].y - 12, rotate: 0 } : undefined}
            >
              <Wrapper {...(it.href && dealt ? { href: it.href, target: '_blank', rel: 'noopener noreferrer' } : {})} className="block h-full w-full">
                <div className="flip h-full w-full" data-flipped={faceUp}>
                  <div className="flip-inner" style={{ transitionDelay: faceUp ? `${i * 110}ms` : '0ms' }}>
                    <div className="flip-face overflow-hidden rounded-[6%/4.3%] shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
                      <img src={asset('card-back.png')} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flip-face flip-front">{it.card}</div>
                  </div>
                </div>
              </Wrapper>
            </motion.div>
          )
        })}
    </div>
  )
}
