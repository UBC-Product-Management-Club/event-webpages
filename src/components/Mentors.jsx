import { MENTORS } from '../data/content'
import ShuffleDeal from './ShuffleDeal'
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

const personItems = (people) =>
  people.map((p, i) => {
    const rank = RANKS[i % RANKS.length]
    const suit = REAL_SUITS[i % REAL_SUITS.length]
    return {
      key: p.name,
      href: p.linkedin,
      card: (
        <PlayingCard suit={suit} rank={String(rank)} className="h-full w-full">
          <div className="absolute inset-x-[19cqw] bottom-[14cqw] top-[10cqw] overflow-hidden rounded-[3cqw] border-[0.8cqw] border-[#c98a2f]/80 bg-charcoal">
            <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
          </div>
        </PlayingCard>
      ),
      caption: (
        <div className="text-center">
          <h3 className="text-lg font-extrabold leading-tight">{p.name}</h3>
          <p className="mt-1 text-sm text-mist/75">{p.role}</p>
          {p.company && <p className="text-sm font-bold text-gold-200">@ {p.company}</p>}
          {p.type && <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-400">{p.type}</p>}
        </div>
      ),
    }
  })

export default function Mentors() {
  const has = MENTORS.length > 0
  return (
    <Section id="mentors">
      <div className="gold-lines opacity-40" aria-hidden />
      <SectionHeading>
        Mentors <span className="brand-text">& judges</span>
      </SectionHeading>

      <div className="mx-auto max-w-6xl">
        <ShuffleDeal
          className={has ? 'grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4' : 'grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4'}
          items={has ? personItems(MENTORS) : placeholderItems}
        />
      </div>
    </Section>
  )
}
