import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const SYMBOLS = ['seven', 'cherry', 'bell', 'diamond', 'bar', 'bar2', 'bar3']
const NAMES = { seven: 'sevens', cherry: 'cherries', bell: 'bells', diamond: 'diamonds', bar: 'bars', bar2: 'double bars', bar3: 'triple bars' }
const rand = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

function Plate({ y, h, fill, color, fs }) {
  return (
    <g>
      <rect x="9" y={y} width="82" height={h} rx="5" fill={fill} stroke="#e8a54b" strokeWidth="2.5" />
      <text x="50" y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="central" fontFamily="Poppins, sans-serif" fontWeight="900" fontSize={fs} fill={color} letterSpacing="2">
        BAR
      </text>
    </g>
  )
}

const ART = {
  cherry: (
    <>
      <path d="M52 20 C46 40 36 56 30 70" stroke="#2f7a2f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M52 20 C60 40 68 54 72 68" stroke="#2f7a2f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M52 20 C66 8 84 12 90 24 C76 28 62 26 52 20Z" fill="#3fae3f" />
      <circle cx="30" cy="76" r="17" fill="#e33148" />
      <circle cx="72" cy="74" r="17" fill="#c4182f" />
      <circle cx="24" cy="69" r="5" fill="#fff" opacity=".55" />
      <circle cx="66" cy="67" r="5" fill="#fff" opacity=".55" />
    </>
  ),
  bell: (
    <>
      <path d="M50 10 a7 7 0 0 1 7 7 v2 c19 4 29 21 29 40 v9 l9 11 H5 l9-11 v-9 c0-19 10-36 29-40 v-2 a7 7 0 0 1 7-7z" fill="#f0b062" />
      <path d="M50 19 c19 4 29 21 29 40 v9 l9 11 H50z" fill="#c98a2f" opacity=".55" />
      <path d="M30 50 c2-12 8-20 18-24" stroke="#ffe3bd" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="88" r="8" fill="#e8a54b" />
    </>
  ),
  diamond: (
    <>
      <polygon points="28,22 72,22 92,43 50,92 8,43" fill="#8d9beb" />
      <polygon points="28,22 50,43 8,43" fill="#b9c2f5" />
      <polygon points="72,22 92,43 50,43" fill="#6f7fd6" />
      <polygon points="8,43 50,43 50,92" fill="#6173c9" />
      <polygon points="92,43 50,43 50,92" fill="#445088" />
      <polygon points="28,22 72,22 50,43" fill="#dde1fc" />
    </>
  ),
  bar: <Plate y={30} h={40} fill="#141414" color="#ffd9a8" fs={25} />,
  bar2: (
    <>
      <Plate y={16} h={32} fill="#a1121f" color="#fff" fs={20} />
      <Plate y={52} h={32} fill="#a1121f" color="#fff" fs={20} />
    </>
  ),
  bar3: (
    <>
      <Plate y={9} h={26} fill="#1d2a6b" color="#ffd9a8" fs={16} />
      <Plate y={37} h={26} fill="#1d2a6b" color="#ffd9a8" fs={16} />
      <Plate y={65} h={26} fill="#1d2a6b" color="#ffd9a8" fs={16} />
    </>
  ),
}

function Sym({ name }) {
  if (name === 'seven') return <span className="seven">7</span>
  return (
    <svg viewBox="0 0 100 100" className="sym" aria-hidden>
      {ART[name]}
    </svg>
  )
}

function Reel({ final, rest, len, duration, onDone }) {
  const strip = useMemo(() => {
    const s = []
    for (let k = 0; k < len - 1; k++) s.push(rand())
    s.push(final ?? rest ?? rand())
    return s
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const finalY = `-${((len - 1) / len) * 100}%`
  return (
    <div className="reel" aria-hidden>
      <motion.div
        initial={{ y: '0%' }}
        animate={final ? { y: finalY, filter: ['blur(4px)', 'blur(4px)', 'blur(0px)'] } : { y: '0%' }}
        transition={{ y: { duration, ease: [0.15, 0.8, 0.25, 1] }, filter: { duration, times: [0, 0.85, 1] } }}
        onAnimationComplete={() => final && onDone?.()}
      >
        {strip.map((s, i) => (
          <div className="reel-cell" key={i}>
            <Sym name={s} />
          </div>
        ))}
      </motion.div>
      {/* glass shine */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/25 via-transparent to-black/25" />
    </div>
  )
}

const REST = ['seven', 'seven', 'seven']

function Lever({ pulled, onPull, disabled }) {
  return (
    <button onClick={onPull} disabled={disabled} aria-label="Pull the lever to spin" className="relative h-full w-full cursor-pointer disabled:cursor-default">
      {/* base plate */}
      <span className="absolute left-0 top-1/2 h-[34%] w-[40%] -translate-y-1/2 rounded-r-lg border border-gold-600 bg-gradient-to-r from-[#7a4a14] to-[#e8a54b]" />
      {/* rod + ball, pivoting at the base */}
      <motion.span
        className="absolute left-[22%] top-1/2 block w-[14%] -translate-y-full"
        style={{ height: '46%', transformOrigin: '50% 100%' }}
        animate={{ scaleY: pulled ? -0.7 : 1 }}
        transition={{ duration: pulled ? 0.35 : 0.6, ease: 'easeInOut' }}
      >
        <span className="absolute inset-x-0 bottom-0 top-3 rounded bg-gradient-to-r from-[#8a8a92] via-[#f2f2f5] to-[#8a8a92]" />
        <span
          className="absolute -top-1 left-1/2 aspect-square w-[260%] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 30%, #ff8a98, #e33148 45%, #7a0f1f)', boxShadow: '0 3px 8px rgba(0,0,0,.5)' }}
        />
      </motion.span>
    </button>
  )
}

export default function SlotMachine() {
  const [round, setRound] = useState(0)
  const [result, setResult] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | spinning | done
  const [pulled, setPulled] = useState(false)

  const spin = () => {
    if (phase === 'spinning') return
    setResult([rand(), rand(), rand()])
    setRound((r) => r + 1)
    setPhase('spinning')
    setPulled(true)
    setTimeout(() => setPulled(false), 450)
  }

  const done = phase === 'done' && result
  const jackpot = done && result.every((s) => s === 'seven')
  const triple = done && result.every((s) => s === result[0])
  const pair = done && !triple && new Set(result).size === 2

  let message = 'Spinning…'
  if (phase === 'idle') message = 'SPIN ME!'
  if (jackpot) message = '7 · 7 · 7 · Jackpot!'
  else if (triple) message = `Triple ${NAMES[result[0]]}!`
  else if (pair) message = 'So close! Spin again.'
  else if (done) message = 'No match. Spin again!'

  const big = jackpot || triple
  return (
    <div className="w-full" style={{ containerType: 'inline-size' }}>
      <div className="flex items-stretch justify-center">
        <div className="w-9 shrink-0 sm:w-12" aria-hidden />
        {/* the cabinet */}
        <div
          className={`relative min-w-0 flex-1 rounded-t-[2.2rem] rounded-b-2xl p-[3px] ${big ? 'won' : ''}`}
          style={{ background: 'linear-gradient(160deg,#ffd9a8,#a8651d 40%,#ffd9a8 55%,#7a4a14)', boxShadow: '0 30px 60px rgba(0,0,0,.55), 0 0 0 5px rgba(26,0,0,.6)' }}
        >
          <div className="rounded-t-[2.1rem] rounded-b-[0.9rem] px-3 pb-4 pt-3 sm:px-5" style={{ background: 'linear-gradient(180deg,#8d1022 0%,#5a0714 55%,#3a040d 100%)' }}>
            {/* lit crown */}
            <div className="mx-auto mb-3 rounded-full border-2 border-gold-400/80 bg-black/55 px-4 py-2 shadow-[inset_0_0_14px_rgba(0,0,0,.8)]">
              <div className="bulbs" />
              <p className={`mt-1 text-center text-xl font-black tracking-[0.5em] ${phase === 'idle' || big ? 'neon-gold flicker' : 'text-gold-400/80'}`} aria-hidden>
                ★ ★ ★
              </p>
              <div className="bulbs alt mt-1" />
            </div>

            {/* reel window */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-black p-3 shadow-[inset_0_0_0_3px_#a8651d,inset_0_8px_20px_rgba(0,0,0,.9)] sm:p-4">
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                {[0, 1, 2].map((i) => (
                  <Reel
                    key={`${i}-${round}`}
                    final={result?.[i] ?? null}
                    rest={REST[i]}
                    len={result ? [14, 20, 26][i] : 1}
                    duration={[2.0, 2.9, 3.8][i]}
                    onDone={i === 2 ? () => setPhase('done') : undefined}
                  />
                ))}
                {/* payline + arrows */}
                <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[2px] -translate-y-1/2 bg-signal/60 shadow-[0_0_8px_#e33148]" />
                <span className="pointer-events-none absolute -left-3.5 top-1/2 z-10 -translate-y-1/2 border-y-[9px] border-l-[12px] border-y-transparent border-l-signal drop-shadow-[0_0_6px_#e33148] sm:-left-4" />
                <span className="pointer-events-none absolute -right-3.5 top-1/2 z-10 -translate-y-1/2 border-y-[9px] border-r-[12px] border-y-transparent border-r-signal drop-shadow-[0_0_6px_#e33148] sm:-right-4" />
              </div>
            </div>

            {/* message display */}
            <div className="mt-4 flex h-11 items-center justify-center rounded-lg border-2 border-gold-600 bg-black px-2 shadow-[inset_0_0_14px_rgba(232,165,75,.25)]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={message}
                  className={`text-center text-base font-black uppercase tracking-widest sm:text-lg ${jackpot ? 'neon-red' : triple ? 'neon-gold' : phase === 'idle' ? 'text-gold-200 animate-pulse' : 'text-gold-200'}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* control deck */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-black/35 px-4 py-3 shadow-[inset_0_2px_8px_rgba(0,0,0,.6)]">
              <div className="flex flex-col items-center gap-1">
                <span className="h-2 w-14 rounded-full bg-black shadow-[inset_0_1px_3px_#000,0_1px_0_rgba(255,217,168,.4)]" />
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-gold-400/70">Insert coin</span>
              </div>
              <button
                onClick={spin}
                disabled={phase === 'spinning'}
                className="rounded-full px-7 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-white transition active:translate-y-0.5 disabled:opacity-60"
                style={{ background: 'radial-gradient(circle at 35% 25%, #ff7d8d, #e33148 50%, #8f1424)', boxShadow: '0 5px 0 #5c0a16, 0 0 0 3px #ffd9a8, 0 8px 18px rgba(0,0,0,.5)' }}
              >
                {phase === 'spinning' ? 'Spinning' : 'Spin'}
              </button>
            </div>
          </div>
          {/* coin tray */}
          <div className="mx-auto -mb-2 mt-1 h-3 w-[70%] rounded-b-xl bg-gradient-to-b from-black to-[#2b1a08]" />
        </div>

        {/* side lever */}
        <div className="relative w-9 shrink-0 sm:w-12">
          <div className="absolute inset-y-[18%] left-0 right-0">
            <Lever pulled={pulled} onPull={spin} disabled={phase === 'spinning'} />
          </div>
        </div>
      </div>
    </div>
  )
}
