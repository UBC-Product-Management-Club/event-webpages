import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import WhyJoin from './components/WhyJoin'
import Schedule from './components/Schedule'
import Sponsors from './components/Sponsors'
import Mentors from './components/Mentors'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="page-bg">
      <Nav />
      <main>
        <Hero />
        <About />
        <WhyJoin />
        <Schedule />
        <Sponsors />
        <Mentors />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
