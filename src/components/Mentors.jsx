import { useState } from 'react'
import { MENTORS } from '../data/content'
import FanHand from './FanHand'
import { PlayingCard, Section, SectionHeading, SUITS, asset } from './ui'

// pip positions (x%, y%, upside-down?) for the number cards
const PIPS = {
  2: [[50, 25], [50, 75, 1]],
  3: [[50, 24], [50, 50], [50, 76, 1]],
  4: [[36, 25], [64, 25], [36, 75, 1], [64, 75, 1]],
  5: [[36, 25], [64, 25], [50, 50], [36, 75, 1], [64, 75, 1]],
}

function NumberCard({ rank, suit }) {
  return (
    <PlayingCard suit={suit} rank={String(rank)} className="h-full w-full">
      {PIPS[rank].map(([x, y, flip], i) => (
        <img
          key={i}
          src={asset(SUITS[suit].img)}
          alt=""
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: '24cqw',
            height: '26cqw',
            objectFit: 'contain',
            transform: `translate(-50%, -50%) ${flip ? 'rotate(180deg)' : ''}`,
          }}
        />
      ))}
    </PlayingCard>
  )
}

const PLACEHOLDERS = [
  { rank: 2, suit: 'spade' },
  { rank: 3, suit: 'heart' },
  { rank: 4, suit: 'club' },
  { rank: 5, suit: 'diamond' },
]
const RANKS = [2, 3, 4, 5]
const REAL_SUITS = ['spade', 'heart', 'club', 'diamond']

const placeholderItems = PLACEHOLDERS.map((c, i) => ({
  key: `ph-${i}`,
  card: <NumberCard {...c} />,
  caption: <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-mist/60">To be announced</p>,
}))

function PersonCard({ person, rank, suit }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="group relative h-full w-full outline-none"
      data-open={open || undefined}
      tabIndex={person.bio ? 0 : undefined}
      role={person.bio ? 'button' : undefined}
      aria-expanded={person.bio ? open : undefined}
      aria-label={person.bio ? `${person.name}. Show introduction` : undefined}
      onClick={() => person.bio && setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (!person.bio || (e.key !== 'Enter' && e.key !== ' ')) return
        e.preventDefault()
        setOpen((v) => !v)
      }}
    >
      <PlayingCard suit={suit} rank={String(rank)} className="h-full w-full">
        <div className={`absolute inset-x-[19cqw] bottom-[14cqw] top-[10cqw] overflow-hidden rounded-[3cqw] border-[0.8cqw] border-[#c98a2f]/80 ${person.photoZoom ? 'bg-white' : 'bg-charcoal'}`}>
          {person.photo && <img
            src={asset(person.photo)}
            alt={person.name}
            className={
              person.photoZoom
                ? 'absolute left-1/2 top-1/2 w-auto max-w-none -translate-x-1/2 -translate-y-1/2'
                : 'h-full w-full object-cover object-[center_30%]'
            }
            style={person.photoZoom ? { height: person.photoZoom } : undefined}
          />}
        </div>
      </PlayingCard>
      {person.bio && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-y-auto rounded-[6%/4.3%] bg-[#2a0610] opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-data-[open=true]:pointer-events-auto group-data-[open=true]:opacity-100 motion-reduce:transition-none">
          <div className="flex min-h-full items-center px-3 py-4">
            <p className="text-left font-sans text-[0.62rem] font-medium leading-snug text-mist">{person.bio}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const personItems = (people) =>
  people.map((p, i) => {
    const rank = RANKS[i % RANKS.length]
    const suit = REAL_SUITS[i % REAL_SUITS.length]
    return {
      key: p.name,
      href: p.linkedin,
      card: <PersonCard person={p} rank={rank} suit={suit} />,
      caption: (
        <div className="text-center">
          <h3 className="text-lg font-extrabold leading-tight">{p.name}</h3>
          {p.pronouns && <p className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.08em] text-mist/60">{p.pronouns}</p>}
          <p className="mt-1 text-sm text-mist/75">{p.role}</p>
          {p.company && (
            <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-sm font-bold text-gold-200">
              {p.companyLogo && <img src={asset(p.companyLogo)} alt="" className="h-4 w-4 shrink-0" />}
              {p.company}
            </p>
          )}
        </div>
      ),
    }
  })

// Five across on large screens. Nine mentors wrap as 5 then 4; five judges sit on their own row.
const ROW = 'flex flex-wrap justify-center gap-x-6 gap-y-10'
const SLOT = 'min-w-0 w-[calc(50%-0.75rem)] shrink-0 md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] max-w-[210px]'

export default function Mentors() {
  const mentors = MENTORS.filter((p) => String(p.type || '').toLowerCase() !== 'judge')
  const judges = MENTORS.filter((p) => String(p.type || '').toLowerCase() === 'judge')
  const has = MENTORS.length > 0
  return (
    <Section id="mentors">
      <div className="gold-lines opacity-40" aria-hidden />
      <SectionHeading>
        Mentors <span className="brand-text">& judges</span>
      </SectionHeading>

      <div className="mx-auto max-w-6xl">
        {has ? (
          <>
            {mentors.length > 0 && <FanHand className={ROW} itemClassName={SLOT} items={personItems(mentors)} />}
            {judges.length > 0 && (
              <FanHand className={`${ROW} mt-16`} itemClassName={SLOT} items={personItems(judges)} />
            )}
          </>
        ) : (
          <FanHand className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4" items={placeholderItems} />
        )}
      </div>
    </Section>
  )
}
