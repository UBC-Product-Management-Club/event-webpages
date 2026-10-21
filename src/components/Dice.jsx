import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const PIPS = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[30, 26], [30, 50], [30, 74], [70, 26], [70, 50], [70, 74]],
}

export function Die({ value = 1, tone = 'ivory', className = '' }) {
  const ivory = tone === 'ivory'
  const id = `die-${tone}`
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ivory ? '#fffdf8' : '#f0475d'} />
          <stop offset="1" stopColor={ivory ? '#e3dac8' : '#9c1020'} />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="19" fill={`url(#${id})`} stroke={ivory ? '#b9ad98' : '#6e0b17'} strokeWidth="2.5" />
      <rect x="9" y="9" width="82" height="82" rx="15" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      {PIPS[value].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8.5" fill={ivory ? '#1a1a1a' : '#ffffff'} />
      ))}
    </svg>
  )
}

/** A die that gets thrown in, tumbles through random faces, bounces and settles on `final`. */
export function ThrownDie({ final = 5, tone = 'ivory', size = 80, rest = 12, from, delay = 0, round = 0, active, onClick }) {
  const [v, setV] = useState(final)

  useEffect(() => {
    if (!active) return
    let t
    const start = setTimeout(() => {
      let n = 0
      t = setInterval(() => {
        n += 1
        if (n >= 11) {
          clearInterval(t)
          setV(final)
        } else {
          setV(1 + Math.floor(Math.random() * 6))
        }
      }, 95)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(t)
    }
  }, [active, round, final, delay])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.span
        key={`s${round}`}
        className="absolute left-[8%] right-[8%] -bottom-1 h-3 rounded-full bg-black/55 blur-[5px]"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : undefined}
        transition={{ delay: delay + 0.9, duration: 0.3 }}
      />
      <motion.button
        key={`d${round}`}
        type="button"
        aria-label="Roll the dice"
        onClick={onClick}
        className="absolute inset-0 cursor-pointer drop-shadow-[0_8px_8px_rgba(0,0,0,0.45)]"
        initial={{ x: from.x, y: from.y, rotate: from.rotate, opacity: 0 }}
        animate={active ? { x: 0, y: [from.y, 0, -38, 0, -14, 0], rotate: rest, opacity: 1 } : undefined}
        whileHover={{ scale: 1.08 }}
        transition={{
          x: { duration: 0.65, ease: 'easeOut', delay },
          y: { duration: 1.25, times: [0, 0.45, 0.63, 0.78, 0.9, 1], ease: 'easeOut', delay },
          rotate: { duration: 1.25, ease: 'easeOut', delay },
          opacity: { duration: 0.15, delay },
        }}
      >
        <Die value={v} tone={tone} className="h-full w-full" />
      </motion.button>
    </div>
  )
}
