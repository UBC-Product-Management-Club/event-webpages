// ─────────────────────────────────────────────────────────────
//  All editable content for the Product Jackpot site lives here.
// ─────────────────────────────────────────────────────────────

export const EVENT = {
  name: 'Product Jackpot',
  tagline: "PMC'S 24 HOUR PRODUCT CHALLENGE",
  dateLabel: 'November 21–22, 2026',
  // Event start: Saturday Nov 21, 2026, 9:00 AM Pacific
  startISO: '2026-11-21T09:00:00-08:00',
  // Countdown targets: registration opens Wednesday Nov 4, 2026, 8:00 AM,
  // then closes Tuesday Nov 17, 2026, 11:59 PM Pacific (UTC-8). Register buttons follow these.
  registrationOpensISO: '2026-11-04T08:00:00-07:00',
  registrationClosesISO: '2026-11-17T23:59:00-08:00',

  registerUrl: 'https://portal.ubcpmc.com/',

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
    summary: 'Team formation, check-in, breakfast, opening, kickoff, mentor rotations, lunch, mentors, networking',
    items: [
      { time: '9:00 AM', label: 'Team Formation' },
      { time: '9:15 AM', label: 'Check-In' },
      { time: '9:30 AM', label: 'Breakfast' },
      { time: '9:45 AM', label: 'Opening Ceremony' },
      { time: '10:15 AM', label: 'Kickoff' },
      { time: '10:45 AM', label: 'Mentor Rotations' },
      { time: '12:00 PM', label: 'Lunch' },
      { time: '1:00 PM', label: 'Mentor Office Hours' },
      { time: '2:00 PM', label: 'Networking' },
    ],
  },
  {
    day: 'Day 2',
    date: 'Sunday, November 22',
    summary: 'Breakfast, check-in, submissions, judging, presentations, games, closing',
    items: [
      { time: '9:30 AM', label: 'Breakfast' },
      { time: '10:00 AM', label: 'Check-In Deadline' },
      { time: '12:00 PM', label: 'Submission Deadline', highlight: true },
      { time: '12:15 PM', label: 'Lunch and First Round Judging' },
      { time: '1:30 PM', label: 'Finalists Announced' },
      { time: '1:55 PM', label: 'Final Presentations', highlight: true },
      { time: '3:00 PM', label: 'TypeRacer & Higher or Lower' },
      { time: '3:30 PM', label: 'Closing Ceremony' },
    ],
  },
]

// Main (title) sponsor: gets its own featured section above the glasses. Logo file lives in public/assets.
export const MAIN_SPONSOR = {
  name: 'GeoComply',
  logo: 'geocomply-logo.png',
  url: 'https://www.geocomply.com',
  description:
    'GeoComply is a Vancouver-based tech unicorn that specializes in fraud prevention, helping businesses figure out who’s really using their apps and where they really are. It started in legal online sports betting, where every bet has to come from someone physically inside a state that allows it. Today, the same technology helps streaming services keep shows in the right countries and helps banking apps catch fraud. Since location is one of the hardest things to fake online, GeoComply combines GPS, Wi-Fi, and device signals to detect VPNs, spoofing, and other fraud tactics.',
}

// Add confirmed sponsors here. Logo files live in public/assets and are loaded with asset().
// { name: 'Acme', logo: 'acme.png', url: 'https://acme.com', description: 'Case sponsor. Acme builds…', tier: 'Case Sponsor' }
export const SPONSORS = [
  { name: 'Bon Macaron', logo: 'bon-macaron.png', url: 'https://bonmacaronpatisserie.com/' },
  { name: 'Loafe', logo: 'loafe.webp', url: 'https://loafe.ca/' },
  { name: 'Teadot', logo: 'teadot.webp', url: 'https://www.teadotdrinks.com/' },
]

// Add confirmed mentors/judges here. Photos live in public/assets/mentors (judges in public/assets/judges), company logos in public/assets/logos.
// type: 'Mentor' or 'Judge'. bio shows on the card when someone hovers or taps it.
export const MENTORS = [
  {
    name: 'Nathaniel Wong',
    pronouns: 'He/Him',
    role: 'Senior Product Manager',
    company: 'Asana',
    companyLogo: 'logos/asana.svg',
    photo: 'mentors/nathaniel-wong.jpeg',
    type: 'Mentor',
    bio: "Hey all, I'm Nat! I was born and raised in Ottawa, studied Computer Engineering at Queen's University, and now working at Asana as a Senior Product Manager. Previously, I worked at Microsoft on Word/Excel/PowerPoint.",
  },
  {
    name: 'Nishita Alagh',
    pronouns: 'She/Her',
    role: 'B2B Product Marketing Manager',
    company: 'Pictory AI',
    companyLogo: 'logos/pictory.png',
    photo: 'mentors/nishita-alagh.jpg',
    type: 'Mentor',
    bio: "Nishita is a Product Marketing Manager, who operates at the intersection of product, marketing, and research. She leads B2B GTM at Pictory, but had accidentally found her way into the field in 2021, when her researcher role at an early-stage SaaS startup quietly evolved into a founding PMM position. Since then, she's stepped into the role two more times, learning to use her focus on understanding people as the foundation for effective marketing strategy. When she's not doing that, she feeds her psychologist brain by reading memoirs and learning new languages.",
  },
  {
    name: 'Subhash Bhushan',
    pronouns: 'He/Him',
    role: 'CTO and VP',
    company: 'Team8 Solutions LLC',
    companyLogo: 'logos/team8.svg',
    photo: 'mentors/subhash-bhushan.jpg',
    photoZoom: '90%',
    type: 'Mentor',
    bio: "I've built software products for twenty-three years. I co-founded JustBooks, a chain of lending libraries in India that grew from one store to 63 across eleven cities on software I built, and I'm now co-founder and CTO of Team8 Solutions, where I also build Protean, an open-source framework. I can help teams at any stage from idea to working demo, and most of all with narrowing the problem, cutting the scope down to a buildable first version, and judging what's technically feasible, including where AI helps and where it doesn't.",
  },
  {
    name: 'Harshad Shinde',
    pronouns: 'He/Him',
    role: 'Senior Product Manager',
    company: 'Versapay',
    companyLogo: 'logos/versapay.svg',
    photo: 'mentors/harshad-shinde.jpeg',
    type: 'Mentor',
    bio: "I'm a Senior Product Manager with 8+ years in B2B SaaS, specializing in fintech, payments, tax compliance, and ERP integrations, currently building AR automation on a ledger platform. I've spent my career taking messy, early-stage ideas and shaping them into validated problems and shippable products, working closely with engineering, design, and customers along the way. Outside of work I mentor aspiring product managers breaking into tech, and I'm a builder at heart who loves a good hackathon sprint.",
  },
  {
    name: 'Nasmaan Ibrahim',
    pronouns: 'He/Him',
    role: 'Strategy & Special Projects Associate',
    company: 'Elective',
    companyLogo: 'logos/elective.jpg',
    photo: 'mentors/nasmaan-ibrahim.jpg',
    type: 'Mentor',
    bio: "Hi everyone, I'm Nasmaan! I graduated from UBC Sauder, co-founded a couple of startups, and now work at Elective, a Vancouver fintech. I'm most useful early on, when you're still working out what the problem actually is and what to build first, and again at the end when it's time to pitch. Bring me your half-formed ideas. Every good product started as one, and I'd love to help you shape yours.",
  },
  {
    name: 'Madiha Thaver',
    pronouns: 'She/Her',
    role: 'AI Product Manager',
    company: 'Casper Studios',
    companyLogo: 'logos/casper-studios.png',
    photo: 'mentors/madiha-thaver.jpeg',
    type: 'Mentor',
    bio: "Hey everyone, I'm Madiha! I studied Marketing and Entrepreneurship at UBC Sauder and currently work as an AI Product Manager at Casper Studios. I help businesses identify opportunities to leverage AI and build solutions that improve how they work. I'm excited to help students with product discovery, strategy, and turning their ideas into real-world solutions!",
  },
  {
    name: 'Bhavesh Ratanpal',
    pronouns: 'He/Him',
    role: 'Founder',
    company: 'Xappert Incorporated',
    companyLogo: 'logos/xappert.png',
    photo: 'mentors/bhavesh-ratanpal.png',
    type: 'Mentor',
    bio: "I'm Bhavesh Ratanpal, founder of Xappert Inc — I help teams with product strategy, PM coaching, and shipping SaaS, including NitiCodeAI, a governance-first AI product for BC strata councils. Day to day I work across discovery and problem framing, prioritization, MVP scoping, and early go-to-market with real users. I can best support participants from problem discovery through first release and early traction, especially founder-led and B2B SaaS products.",
  },
  {
    name: 'Simran Sran',
    pronouns: 'He/Him',
    role: 'Senior Technical Product Manager',
    company: 'Amazon',
    companyLogo: 'logos/amazon.png',
    photo: 'mentors/simran-sran.jpeg',
    type: 'Mentor',
    bio: "I have 12 years of experience turning ideas into products (and occasionally turning coffee into roadmaps). From “I have an idea” to “Why aren’t customers using it?”, I can help at every stage of the product journey.",
  },
  {
    name: 'Michelle Mak',
    pronouns: 'She/Her',
    role: 'Product Manager',
    company: 'Ticketmaster',
    companyLogo: 'logos/ticketmaster.png',
    photo: 'mentors/michelle-mak.png',
    type: 'Mentor',
    bio: "Toronto-born and West Coast based, Michelle originally joined Ticketmaster as an intern while pursuing her Master’s degree at SFU. In that time, she was quick to take initiative in leading her own team & owning project lifecycles. Outside of work, Michelle prioritizes movement & keeping active through sports. Off the court/field, Michelle is always looking for ways to innovate & integrate AI into her day to day & automate the PM process!",
  },
  {
    name: 'Alexandre Morin',
    pronouns: 'He/Him',
    role: 'Vice-President / Founder',
    company: 'ProductBC / Borealis',
    companyLogo: 'logos/productbc.png',
    photo: 'judges/alexandre-morin.png',
    type: 'Judge',
    bio: "Alexandre Morin is an AI-product builder and product management leader with a background in mobile device management and security. Ex-Apple, he was previously Product Management Lead at Mosyle and spent three years at Kandji as a Senior Product Manager. Today he runs Borealis, and works with Apple as an independent contractor on AI product building and local AI. Alexandre is passionate about mentorship, helping the next generation of product people find their place as AI reshapes the profession.",
  },
  {
    name: 'Priya Vinayagam',
    pronouns: 'She/Her',
    role: 'Product Manager',
    company: 'Workday',
    companyLogo: 'logos/workday.png',
    photo: 'judges/priya-vinayagam.jpg',
    type: 'Judge',
    bio: "Hi All! I am a fintech Product Manager, currently at Workday Financials. I have also worked at places like Deloitte & SAP as well as startups previously. University of Waterloo alum. I have a background in Management Engineering & Information Systems. Started off as a developer & technical analyst, and pivoted to Product Management a few years ago. Excited to share my experience and professional insights.",
  },
  {
    name: 'Oliver Xie',
    pronouns: 'He/Him',
    role: 'Product Manager',
    company: 'Workday',
    companyLogo: 'logos/workday.png',
    photo: 'judges/oliver-xie.jpeg',
    type: 'Judge',
    bio: "With a background in Integrated Engineering from UBC, Oliver began his journey with careers in implementation consulting, project management, and technical sales before taking on product management at a Vancouver based B2B SaaS company. Experienced with the full product lifecycle and product strategic thinking, he currently is a Product Manager at Workday taking on enterprise-level industry challenges in the Workday Financials realm.",
  },
  {
    name: 'Tunir Kapil',
    pronouns: 'He/Him',
    role: 'Senior Manager - Product Management @ BDC - Analytics',
    company: 'SAP SE',
    companyLogo: 'logos/sap.svg',
    photo: 'judges/tunir-kapil.jpg',
    type: 'Judge',
    bio: "Hi, I'm Tunir Kapil, a strategic product leader in Enterprise Analytics. I lead a team of Product Managers driving the product strategy for Business Data Cloud - Analytics (SAP Analytics Cloud), one of SAP's flagship Planning & Analytics platforms. With a deep background in data-driven product development, roadmap definition, and customer discovery, I work at the intersection of Development, User Experience, and Customers to deliver solutions that drive measurable adoption and business impact.",
  },
  {
    name: 'Eleanor Hawkins',
    role: 'Talent Program Manager',
    company: 'GeoComply',
    companyLogo: 'logos/geocomply.png',
    photo: 'judges/eleanor-hawkins.jpg',
    type: 'Judge',
  },
]

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
