import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EVENT } from '../data/content'
import { useRegistrationStatus } from './ui'

function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

function Digit({ v }) {
  return (
    <span className="digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={v}
          className="block"
          initial={{ y: '-90%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '90%', opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {v}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Unit({ value, label }) {
  const s = String(value).padStart(2, '0')
  return (
    <div className="text-center">
      <div className="soft-gold flex justify-center gap-[0.08em] font-black leading-none" style={{ fontSize: '12cqw' }}>
        <Digit v={s[0]} />
        <Digit v={s[1]} />
      </div>
      <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-mist/70">{label}</p>
    </div>
  )
}

export default function Countdown() {
  const status = useRegistrationStatus()
  const c = useCountdown(status === 'upcoming' ? EVENT.registrationOpensISO : EVENT.registrationClosesISO)
  const heading = { upcoming: 'Registration opens in', open: 'Registration closes in', closed: 'Registration is closed' }[status]
  return (
    <div className="ticket p-5 sm:p-6" style={{ containerType: 'inline-size' }}>
      <p className={`text-center text-xs font-bold uppercase tracking-[0.35em] text-gold-400 sm:text-sm ${status === 'closed' ? '' : 'mb-5'}`}>
        {heading}
      </p>
      {status !== 'closed' && (
        <div className="grid grid-cols-4 gap-[2.5cqw]">
          <Unit value={c.days} label="Days" />
          <Unit value={c.hours} label="Hours" />
          <Unit value={c.minutes} label="Mins" />
          <Unit value={c.seconds} label="Secs" />
        </div>
      )}
    </div>
  )
}
