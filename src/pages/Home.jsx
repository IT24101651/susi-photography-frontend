import Navbar from '../components/sections/Navbar'
import Hero from '../components/sections/Hero'
import Portfolio from '../components/sections/Portfolio'
import Packages from '../components/sections/Packages'
import About from '../components/sections/About'
import Team from '../components/sections/Team'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import Footer from '../components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Portfolio />
      <Packages />
      <Team />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
