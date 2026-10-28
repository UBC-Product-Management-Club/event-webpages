import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import GearyModel from './GearyModel'
import Roulette3D from './Roulette3D'
import { EVENT } from '../data/content'
import { CardButton, Float, RegisterCard, Reveal, asset } from './ui'

/** The "O" in JACKPOT is a spinning chip */
function ChipO() {
  return (
    <motion.img
      src={asset('chip-red.png')}
      alt=""
      aria-hidden
      className="inline-block align-baseline"
      style={{ width: '0.8em', height: '0.8em', filter: 'drop-shadow(0 0 18px rgba(227,49,72,.8))' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/**
 * Geary behind a roulette table. Pick red or black, the wheel and ball spin,
 * and the ball lands on a random pocket. The pockets alternate red / black
 * (36 of them, 10° each, pocket 0 is red and ends at 12 o'clock).
 */
const isRed = (slot) => slot % 2 === 0
const mod = (n, m) => ((n % m) + m) % m

/**
 * Geary as a thick cut-out: darkened copies stacked behind him give him depth,
 * he tilts towards the pointer (and sways on his own), and a light/shade
 * gradient clipped to his outline moves as he turns.
 */
const GEARY_DEPTH = 14 // layers
const GEARY_STEP = 1.4 // px between layers

function Geary3D({ src, alt, className = '' }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0) // pointer, -1..1
  const py = useMotionValue(0)
  const sway = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 14 })
  const sy = useSpring(py, { stiffness: 60, damping: 14 })
  const rotateY = useTransform([sx, sway], ([x, s]) => x * 24 + s)
  const rotateX = useTransform(sy, (y) => -y * 12)
  const lightX = useTransform(rotateY, (r) => `${50 - r * 1.6}%`)
  const lightY = useTransform(rotateX, (r) => `${30 + r * 2}%`)
  const sheen = useMotionTemplate`radial-gradient(circle at ${lightX} ${lightY}, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%), linear-gradient(160deg, rgba(255,255,255,0) 40%, rgba(0,0,0,0.45))`

  useEffect(() => {
    if (reduce) return
    const a = animate(sway, [-10, 10], { duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1)
      py.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      a.stop()
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  const mask = { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }

  return (
    <div className={className} style={{ perspective: '900px' }}>
      <motion.div className="relative" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {/* the edge: back layers darken towards the rear */}
        {Array.from({ length: GEARY_DEPTH }, (_, i) => {
          const d = GEARY_DEPTH - i
          const last = i === 0
          return (
            <img
              key={d}
              src={src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
              style={{
                transform: `translateZ(${-d * GEARY_STEP}px)`,
                filter: `brightness(${0.22 + (i / GEARY_DEPTH) * 0.3})${last ? ' drop-shadow(0 22px 26px rgba(0,0,0,0.55))' : ''}`,
              }}
            />
          )
        })}
        {/* the face */}
        <img src={src} alt={alt} className="relative block w-full" />
        {/* lighting, clipped to his outline */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ ...mask, background: sheen, mixBlendMode: 'soft-light' }} />
      </motion.div>
    </div>
  )
}

function RouletteGeary() {
  const wheel = useMotionValue(0)
  const ball = useMotionValue(0)
  const ballR = useMotionValue(0.92)
  const riding = useRef(null)
  const spinningRef = useRef(false)
  const [flat, setFlat] = useState(false) // fallback if WebGL is unavailable
  const [flatGeary, setFlatGeary] = useState(false)
  const idle = useRef(null)
  const [pick, setPick] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | spinning | done
  const [outcome, setOutcome] = useState(null) // 'red' | 'black'

  const startIdle = () => {
    idle.current?.stop()
    idle.current = animate(wheel, wheel.get() + 360, { duration: 40, ease: 'linear', repeat: Infinity })
  }
  useEffect(() => {
    startIdle()
    const b = animate(ball, -360, { duration: 9, ease: 'linear', repeat: Infinity })
    return () => {
      idle.current?.stop()
      b.stop()
    }
  }, [])

  const play = async (colour) => {
    if (phase === 'spinning') return
    setPick(colour)
    setOutcome(null)
    setPhase('spinning')
    spinningRef.current = true
    idle.current?.stop()
    if (riding.current) {
      ball.set(riding.current.phi + wheel.get())
      riding.current = null
    }

    const slot = Math.floor(Math.random() * 36)
    const curW = wheel.get()
    // wheel-local angle under the ball (screen angle 0) is -W, aim for the pocket centre
    const want = mod(5 - 10 * slot + (Math.random() * 6 - 3), 360)
    const targetW = curW + 720 + mod(want - mod(curW, 360), 360)
    const curB = ball.get()
    const targetB = Math.floor(curB / 360) * 360 - 360 * 5

    animate(wheel, targetW, { duration: 6, ease: [0.1, 0.6, 0.2, 1] })
    animate(ballR, [null, 0.92, 0.92, 0.73], { duration: 5.6, times: [0, 0.06, 0.7, 1], ease: 'easeIn' })
    await animate(ball, targetB, { duration: 5.6, ease: [0.2, 0.55, 0.3, 1] })
    await new Promise((r) => setTimeout(r, 500))
    riding.current = { phi: mod(-want, 360) } // ball now rides in its pocket
    spinningRef.current = false
    setOutcome(isRed(slot) ? 'red' : 'black')
    setPhase('done')
    startIdle()
  }

  const won = phase === 'done' && outcome === pick
  let message = 'Red or black? Place your bet!'
  if (phase === 'spinning') message = 'No more bets…'
  if (phase === 'done') message = won ? 'You Won!' : 'So close! Try again!'

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[640px] lg:-mr-12 lg:w-[calc(100%+3rem)] lg:max-w-none"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div className="relative" style={{ aspectRatio: '1 / 0.92' }}>
        {/* glow on the table */}
        <div className="absolute inset-x-[2%] bottom-[0%] h-[50%] rounded-[50%] bg-signal/30 blur-3xl" aria-hidden />

        {/* Geary, standing behind the table */}
        <div className="absolute left-1/2 top-[1%] z-0 w-[52%] -translate-x-1/2">
          <Float amp={5} rot={0} duration={3.4}>
            <motion.div
              animate={won ? { y: [0, -26, 0, -16, 0], scale: [1, 1.05, 1] } : { y: 0 }}
              transition={{ duration: 0.9 }}
            >
              {flatGeary ? (
                <Geary3D src={asset('geary-happy.png')} alt="Geary, the Product Jackpot dealer" className="w-full" />
              ) : (
                <GearyModel onFail={() => setFlatGeary(true)} />
              )}
            </motion.div>
          </Float>
        </div>

        {/* the wheel, in front of Geary */}
        {flat ? (
          <div className="absolute inset-x-0 top-[16%] z-10" style={{ perspective: '1200px' }}>
            <div className="relative aspect-square w-full" style={{ transform: 'rotateX(62deg)' }}>
              <motion.img src={asset('roulette.png')} alt="" className="absolute inset-0 h-full w-full" style={{ rotate: wheel }} />
            </div>
          </div>
        ) : (
          <Roulette3D wheel={wheel} ball={ball} ballR={ballR} riding={riding} spinning={spinningRef} onFail={() => setFlat(true)} />
        )}
      </div>

      {/* bet buttons + result */}
      <div className="relative z-20 -mt-2 flex flex-col items-center gap-3">
        <div className="flex gap-4">
          {[
            ['red', 'Red', 'radial-gradient(circle at 35% 25%, #ff6b7d, #c4182f 55%, #6d0a16)'],
            ['black', 'Black', 'radial-gradient(circle at 35% 25%, #4a4a4a, #151515 55%, #000)'],
          ].map(([c, label, bg]) => (
            <button
              key={c}
              onClick={() => play(c)}
              disabled={phase === 'spinning'}
              aria-pressed={pick === c}
              className={`w-36 rounded-full py-2.5 text-center text-sm font-black uppercase tracking-[0.2em] text-white transition active:translate-y-0.5 disabled:opacity-50 ${pick === c ? 'scale-105' : ''}`}
              style={{
                background: bg,
                boxShadow: `0 4px 0 rgba(0,0,0,.55), 0 0 0 3px ${pick === c ? '#fff3df' : '#e8a54b'}, 0 8px 18px rgba(0,0,0,.5)${pick === c ? ', 0 0 22px rgba(255,200,120,.6)' : ''}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p
          role="status"
          className={`min-h-[1.75rem] text-center text-base font-black uppercase tracking-[0.18em] sm:text-lg ${won ? 'neon-gold' : phase === 'done' ? 'text-gold-200' : 'gold-text'}`}
        >
          {message}
        </p>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <header id="top" className="relative isolate overflow-hidden pb-16 pt-28 lg:pb-20 lg:pt-32">
      {/* spotlight beam, as in the Instagram posts */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -top-[10%] -z-10 h-[130%] w-[70%] origin-top-left"
        style={{
          background: 'linear-gradient(115deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 60%, transparent 80%)',
          clipPath: 'polygon(0 0, 55% 0, 100% 100%, 0 100%)',
        }}
        animate={{ rotate: [-2, 3, -2] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="gold-lines -z-10" aria-hidden />
      {/* soft wine glow at the top; fades out so there is no edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[90%]" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 0%, rgba(92,23,69,0.5), transparent 70%)' }} aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="leading-[0.88]" aria-label="Product Jackpot">
            <motion.span
              aria-hidden
              className="neon-gold block text-[clamp(1.6rem,5.4vw,3.3rem)] font-extrabold uppercase tracking-[0.2em]"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Product
            </motion.span>
            <motion.span
              aria-hidden
              className="neon-red flicker mt-1 block whitespace-nowrap text-[clamp(3rem,12.5vw,7.4rem)] font-black uppercase tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              JACKP<ChipO />T
            </motion.span>
          </h1>

          <Reveal delay={0.45} y={16}>
            <p className="gold-text mt-6 text-lg font-extrabold uppercase tracking-[0.14em] sm:text-2xl">{EVENT.dateLabel}</p>
          </Reveal>

          <Reveal delay={0.5} y={16}>
            <p className="gold-text mt-2 text-lg font-extrabold uppercase tracking-[0.14em] sm:text-2xl">{EVENT.tagline}</p>
          </Reveal>

          {/* the two buttons are playing cards */}
          <Reveal delay={0.65} y={16}>
            <div className="mt-10 flex flex-wrap items-center gap-6 pb-6 sm:gap-8">
              <Float amp={6} rot={0} duration={4.5}>
                <RegisterCard rotate={-5} />
              </Float>
              <Float amp={6} rot={0} duration={5} delay={0.6}>
                <CardButton suit="spade" lines={['See', 'schedule']} href="#schedule" rotate={4} />
              </Float>
            </div>
          </Reveal>

          <Reveal delay={0.8} y={16}>
            <p className="gold-text mt-4 whitespace-pre-line text-sm font-extrabold uppercase leading-snug tracking-[0.14em] sm:text-lg">{EVENT.pricing || 'Details coming soon'}</p>
          </Reveal>
        </div>

        <RouletteGeary />
      </div>
    </header>
  )
}
