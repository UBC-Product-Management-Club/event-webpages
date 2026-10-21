import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { FAQ } from '../data/content'
import { Die, ThrownDie } from './Dice'
import { Reveal, Section, SectionHeading } from './ui'

function Item({ q, a, open, onToggle, id, n }) {
  return (
    <div className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ${open ? 'border-gold-400/80 bg-black/55' : 'border-white/15 bg-black/35 hover:border-gold-400/50'}`}>
      <h3>
        <button className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-6 sm:py-5" onClick={onToggle} aria-expanded={open} aria-controls={id}>
          <motion.span
            className="block h-10 w-10 shrink-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
            animate={{ rotate: open ? 360 : 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            aria-hidden
          >
            <Die value={n} tone={n % 2 ? 'ivory' : 'red'} className="h-full w-full" />
          </motion.span>
          <span className="flex-1 text-base font-bold sm:text-xl">{q}</span>
          <motion.span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-400/60 text-gold-200" animate={{ rotate: open ? 45 : 0 }} aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="px-5 pb-6 pl-[4.75rem] text-base leading-relaxed text-mist/85 sm:pl-[5.75rem] sm:pr-8 sm:text-lg">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const DICE = [
  // desktop spots (lg: absolute), landing rotation, where they are thrown in from
  { tone: 'ivory', size: 92, rest: 14, pos: 'lg:left-[2.5%] lg:top-[9%]', from: { x: 640, y: -420, rotate: -620 }, delay: 0 },
  { tone: 'red', size: 78, rest: -22, pos: 'lg:left-[5.5%] lg:top-[34%]', from: { x: 760, y: -380, rotate: 560 }, delay: 0.18 },
  { tone: 'ivory', size: 86, rest: 28, pos: 'lg:right-[3%] lg:top-[20%]', from: { x: -520, y: -420, rotate: 640 }, delay: 0.32 },
]

export default function Faq() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [round, setRound] = useState(0)
  const [finals, setFinals] = useState([5, 2, 6])
  const reroll = () => {
    setFinals(DICE.map(() => 1 + Math.floor(Math.random() * 6)))
    setRound((r) => r + 1)
  }

  return (
    <Section id="faq">
      <SectionHeading>
        <span className="brand-text">FAQ</span>
      </SectionHeading>

      <div ref={ref} className="felt-rect relative mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="pointer-events-none absolute inset-3 rounded-[18px] border-2 border-gold-400/40" aria-hidden />

        {/* the dice thrown onto the table */}
        <div className="relative z-10 mb-8 flex justify-center gap-6 lg:mb-0 lg:block">
          {DICE.map((d, i) => (
            <div key={i} className={`relative lg:absolute ${d.pos}`}>
              <ThrownDie final={finals[i]} tone={d.tone} size={d.size} rest={d.rest} from={d.from} delay={d.delay} round={round} active={inView} onClick={reroll} />
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-3xl space-y-4">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <Item id={`faq-${i}`} n={i + 1} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
