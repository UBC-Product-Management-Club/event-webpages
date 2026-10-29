// ─────────────────────────────────────────────────────────────
//  All editable content for the Product Jackpot site lives here.
// ─────────────────────────────────────────────────────────────

export const EVENT = {
  name: 'Product Jackpot',
  tagline: "PMC'S 24 HOUR PRODUCT CHALLENGE",
  dateLabel: 'November 21–22, 2026',
  // Event start: Saturday Nov 21, 2026, 9:00 AM Pacific
  startISO: '2026-11-21T09:00:00-08:00',
  // Countdown target: registration opens Wednesday Nov 4, 2026, 12:00 AM Pacific (PST)
  registrationOpensISO: '2026-11-04T00:00:00-08:00',

  registerUrl: '', // TODO: paste the registration link, e.g. https://portal.ubcpmc.com/events/<id>/register
  pricing: '$9 for members\n$15 for non-members',

  contactEmail: 'connect@ubcpmc.com',
  // Loops "custom form" endpoint for the footer newsletter (public, no API key needed)
  newsletterEndpoint: 'https://app.loops.so/api/newsletter-form/cm0fr4vhn014puiozc8lbi63j',
}

export const ABOUT = {
  lead:
    'Product Jackpot is PMC’s product competition where students turn ideas into solutions. Participants go through the full PM process: understanding users, brainstorming solutions, creating a product strategy, and pitching their ideas.',
  more:
    'It’s a beginner-friendly, 24 hour challenge built around a real-world product case from an industry sponsor, with guidance from experienced mentors along the way. Every successful product starts with a bet. Compete to find the strongest opportunity and build the next winning solution.',
  steps: [
    { suit: 'heart', title: 'Understand users', text: 'Dig into who you’re building for and what they actually need.' },
    { suit: 'diamond', title: 'Brainstorm solutions', text: 'Generate ideas, then place your bet on the strongest one.' },
    { suit: 'club', title: 'Create a product strategy', text: 'Turn the idea into a plan, a mockup, and a reason to win.' },
    { suit: 'spade', title: 'Pitch your idea', text: 'Take the final hand to a panel of industry judges.' },
  ],
}

export const WHY_JOIN = [
  'Learn product management fundamentals',
  'Build a project for your portfolio',
  'Connect with industry mentors',
  'Network with other students',
  'Compete for prizes',
]

export const SCHEDULE = [
  {
    day: 'Day 1',
    date: 'Saturday, November 21',
    summary: 'Registration, kickoff, workshop, team formation, hacking, mentorship',
    items: [
      { time: '9:00 AM', label: 'Registration' },
      { time: '9:30 AM', label: 'Opening Ceremonies' },
      { time: '10:00 AM', label: 'Kickoff', highlight: true },
      { time: '12:00 PM', label: 'Lunch' },
      { time: '3:00 PM', label: 'Workshop' },
      { time: '4:00 PM', label: 'Mentorship' },
    ],
  },
  {
    day: 'Day 2',
    date: 'Sunday, November 22',
    summary: 'Final submissions, judging, finals, awards',
    items: [
      { time: '10:00 AM', label: 'Check-In Deadline' },
      { time: '12:00 PM', label: 'Submission Deadline', highlight: true },
      { time: '12:30 PM', label: 'Preliminary Announcement' },
      { time: '12:45 PM', label: 'Preliminary Round' },
      { time: '2:00 PM', label: 'Grand Finals + Closing Ceremonies', highlight: true },
      { time: '3:15 PM', label: 'Post Event Social' },
      { time: '4:00 PM', label: 'End of Event' },
    ],
  },
]

// Add confirmed sponsors here. Example:
// { name: 'Acme', logo: '/assets/sponsors/acme.png', url: 'https://acme.com', description: 'Case sponsor. Acme builds…', tier: 'Case Sponsor' }
export const SPONSORS = []

// Add confirmed mentors/judges here. Example:
// { name: 'Jane Doe', role: 'Senior PM', company: 'Acme', photo: '/assets/people/jane.jpg', type: 'Mentor', linkedin: 'https://linkedin.com/in/…' }
export const MENTORS = []

export const FAQ = [
  {
    q: 'Who can join?',
    a: 'Product Jackpot is open to students of all years, faculties, and experience levels who are interested in Product Management, technology, startups, or innovation. Whether this is your first product challenge or you have competed before, everyone is welcome to participate.',
  },
  {
    q: 'Do I need coding experience?',
    a: 'No coding experience is required! Product Jackpot focuses on product thinking, problem-solving, user needs, and creating impactful solutions rather than building a fully functional product.',
  },
  {
    q: 'Do I need a team?',
    a: 'No, you do not need a team before registering! While signing up with a team increases chances of you working with your preferred teammates, participants can sign up individually and we will do our best to assign you to a team!',
  },
  {
    q: 'What should I bring?',
    a: 'Bring your laptop, charger, student ID, and anything else you need to comfortably work with your team. Come ready to collaborate, learn, meet new people, and bring your ideas to life.',
  },
  {
    q: 'How does judging work?',
    a: 'Teams will pitch their final product solutions to judges at the end of the challenge. Projects will be evaluated based on criteria such as user impact, creativity, feasibility, product thinking, and presentation quality.',
  },
]

export const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Why Join', href: '#why' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'FAQ', href: '#faq' },
]

// Same footer as the other PMC event pages
export const FOOTER_LINKS = [
  { label: 'Home', href: 'https://ubcpmc.com/' },
  { label: 'About Us', href: 'https://ubcpmc.com/about' },
  { label: 'Events', href: 'https://ubcpmc.com/events' },
  { label: 'Become a member', href: 'https://portal.ubcpmc.com/' },
]

export const CONTACT_EMAILS = ['partnerships@ubcpmc.com', 'connect@ubcpmc.com']

export const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/ubcpmc', icon: 'instagram' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/ubc-product-management-club/', icon: 'linkedin' },
  { name: 'Linktree', href: 'https://linktr.ee/ubcpmc', icon: 'link' },
]
