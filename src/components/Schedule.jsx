import { SCHEDULE } from '../data/content'
import { Reveal, Section, SectionHeading, asset } from './ui'

export default function Schedule() {
  return (
    <Section id="schedule">
      <div className="gold-lines opacity-40" aria-hidden />
      <SectionHeading>
        The <span className="brand-text">schedule</span>
      </SectionHeading>

      <div className="relative mx-auto max-w-5xl pt-36 sm:pt-44">
        {/* the dealer, standing behind the table */}
        <Reveal className="absolute inset-x-0 top-0 z-0 flex justify-center" y={50}>
          <img src={asset('geary-smirk.png')} alt="Geary, dealing" className="w-36 drop-shadow-[0_18px_24px_rgba(0,0,0,0.6)] sm:w-48" />
        </Reveal>

        <Reveal className="relative z-10">
          <div className="felt-table px-4 pb-8 pt-24 sm:px-8 sm:pt-28 lg:px-10 lg:pt-32">
            {/* table decorations */}
            <img src={asset('chip-stack-red.png')} alt="" className="absolute left-[12%] top-8 hidden w-9 lg:block" />
            <img src={asset('chip-blue.png')} alt="" className="absolute right-[13%] top-10 hidden w-12 lg:block" />
            <img src={asset('chip-red.png')} alt="" className="absolute right-[18%] top-20 hidden w-10 lg:block" />

            <div className="relative">
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {SCHEDULE.map((d, di) => (
                  <div key={d.day} className="ticket overflow-hidden">
                    <div className="border-b border-dashed border-gold-400/40 p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="gold-text text-4xl font-black uppercase tracking-tight sm:text-5xl">{d.day}</h3>
                        <img src={asset(di === 0 ? 'chip-red.png' : 'chip-blue.png')} alt="" className="h-12 w-12 sm:h-14 sm:w-14" />
                      </div>
                      <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-gold-400">{d.date}</p>
                    </div>
                    <ol className="p-3 sm:p-4">
                      {d.items.map((it) => (
                        <li
                          key={it.time + it.label}
                          className={`flex items-baseline gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/5 sm:gap-6 sm:px-4 ${it.highlight ? 'bg-signal/10' : ''}`}
                        >
                          <span className="w-24 shrink-0 text-sm font-extrabold tabular-nums tracking-wide text-gold-200 sm:w-28 sm:text-base">{it.time}</span>
                          <span
                            className={`text-base font-semibold sm:text-lg ${it.highlight ? 'text-white' : 'text-mist'}`}
                            style={it.highlight ? { textShadow: '0 0 12px rgba(227,49,72,.8)' } : undefined}
                          >
                            {it.label}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
