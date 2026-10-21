import { motion } from 'motion/react'
import { ABOUT } from '../data/content'
import Countdown from './Countdown'
import SlotMachine from './SlotMachine'
import { PlayingCard, Reveal, Section, asset } from './ui'

export default function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              About <span className="brand-text">Product Jackpot</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 text-lg leading-relaxed text-mist/90 sm:text-xl">{ABOUT.lead}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-base leading-relaxed text-mist/70 sm:text-lg">{ABOUT.more}</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="space-y-6">
          <SlotMachine />
          <Countdown />
        </Reveal>
      </div>

      {/* the PM process as four suits */}
      <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {ABOUT.steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <motion.div whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <PlayingCard suit={s.suit} rank={String(i + 1)} className="w-full">
                <div className="absolute inset-0 flex flex-col items-center justify-center px-[15cqw] pb-[12cqw] pt-[8cqw] text-center">
                  <div className="mb-[6cqw] w-[26cqw]">
                    <img src={asset(`suit-${s.suit}.png`)} alt="" className="mx-auto w-full" />
                  </div>
                  <h3 className="text-[10.5cqw] font-bold leading-[1.05]">{s.title}</h3>
                  <p className="mt-[4cqw] hidden text-[6.2cqw] leading-snug opacity-80 min-[420px]:block" style={{ fontFamily: 'var(--font-sans)' }}>
                    {s.text}
                  </p>
                </div>
              </PlayingCard>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
