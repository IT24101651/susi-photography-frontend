import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../../hooks/usePublicData'
import { normalizeUrl } from '../../utils/normalizeUrl'

const NAV_LINKS = [
  { label: 'Portfolio', href: '#portfolio', subtitle: 'Explore our latest work', icon: 'portfolio' },
  { label: 'Packages', href: '#packages', subtitle: 'Choose the perfect package', icon: 'packages' },
  { label: 'About', href: '#about', subtitle: 'Our story & vision', icon: 'about' },
  { label: 'Proprietors', href: '#team', subtitle: 'Meet the proprietors', icon: 'team' },
  { label: 'Testimonials', href: '#testimonials', subtitle: 'Words from our clients', icon: 'testimonials' },
]

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.4-.1-1.2-.2-2.2-.2-2.2 0-3.8 1.3-3.8 3.9V11H7.5v3H10v7h3.5Z" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.5 3c.3 1.8 1.4 3.3 3 4.2 1 .6 2 .8 3 .8v3.1c-1.6 0-3.2-.5-4.6-1.4v5.5c0 3.2-2.6 5.8-5.8 5.8S4.3 18.4 4.3 15.2s2.6-5.8 5.8-5.8c.4 0 .8 0 1.1.1v3.2a2.8 2.8 0 0 0-1.1-.2c-1.5 0-2.7 1.2-2.7 2.7S8.6 18 10.1 18s2.7-1.2 2.7-2.7V3h1.7Z" />
  </svg>
)

const PortfolioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h3l1.7-2h6.6L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const PackagesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2.5" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const AboutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="7" r="3" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
)

const TeamIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="3.2" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M15.5 3.3a3.2 3.2 0 0 1 0 6.1" />
  </svg>
)

const TestimonialsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h8M8 7h5" />
  </svg>
)

function NavItemIcon({ type }) {
  if (type === 'portfolio') return <PortfolioIcon />
  if (type === 'packages') return <PackagesIcon />
  if (type === 'about') return <AboutIcon />
  if (type === 'team') return <TeamIcon />
  return <TestimonialsIcon />
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: settings } = useSettings()
  const defaultFacebookUrl = 'https://web.facebook.com/SusiDigital'
  const defaultTikTokUrl = 'https://www.tiktok.com/@susi.digital.photo?_r=1&_t=ZS-96YP6m5NUX6'
  const instagramUrl = normalizeUrl(settings?.instagram_url)
  const facebookUrl = normalizeUrl(settings?.facebook_url) || defaultFacebookUrl
  const tiktokUrl = normalizeUrl(settings?.tiktok_url) || defaultTikTokUrl

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.body.classList.toggle('menu-open', menuOpen)
    window.dispatchEvent(new CustomEvent('susi-menu-toggle', { detail: { open: menuOpen } }))

    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
      window.dispatchEvent(new CustomEvent('susi-menu-toggle', { detail: { open: false } }))
    }
  }, [menuOpen])

  useEffect(() => {
    const updateScrolled = () => {
      const hero = document.getElementById('hero')
      if (!hero) {
        setScrolled(window.scrollY > 60)
        return
      }

      const heroBottom = hero.offsetTop + hero.offsetHeight - 120
      setScrolled(window.scrollY > heroBottom)
    }

    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    window.addEventListener('resize', updateScrolled)

    return () => {
      window.removeEventListener('scroll', updateScrolled)
      window.removeEventListener('resize', updateScrolled)
    }
  }, [])

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,box-shadow,border-color,opacity] duration-300 ${
          menuOpen
            ? 'pointer-events-none opacity-0'
            : 'pointer-events-auto opacity-100'
        } ${
          scrolled
            ? 'border-b border-[#e7d7bc] bg-[rgba(251,246,237,0.96)] shadow-[0_10px_30px_rgba(77,58,32,0.08)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, transform: 'none' }}
      >
        <div className="relative mx-auto h-[5.4rem] w-full max-w-[120rem] overflow-hidden px-3 sm:h-[5.9rem] sm:px-6 lg:h-[6.4rem] lg:px-12">
          <div className="pointer-events-none absolute inset-0">
            <a
              href="#hero"
              onClick={closeMenu}
              className={`pointer-events-auto absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-logo text-[1.7rem] uppercase leading-[0.88] tracking-[0.01em] transition-colors sm:text-[2.6rem] lg:text-[4.1rem] ${
                scrolled ? 'text-[#18110b]' : 'text-white'
              }`}
              style={{ textShadow: scrolled ? 'none' : '0 8px 22px rgba(8, 5, 3, 0.18)' }}
              aria-label="Susi home"
            >
              SUSI
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-colors sm:right-6 sm:h-11 sm:w-11 lg:right-12 lg:h-12 lg:w-12 ${
              scrolled
                ? 'border-[#b8945b] bg-white/70 text-[#2f2116]'
                : 'border-white/70 bg-transparent text-white'
            }`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-[2px] w-5 origin-center rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 top-[14px] h-[2px] w-5 origin-center rounded-full bg-current transition-transform duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <div className="fixed inset-0 z-[60]">
            <motion.button
              type="button"
              className="absolute inset-0 bg-[rgba(245,238,228,0.72)] backdrop-blur-[3px] sm:bg-black/45"
              onClick={closeMenu}
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />

            <motion.aside
              className="fixed inset-0 bg-[#f8f1e7] text-[#2d211a] shadow-[0_24px_80px_rgba(13,8,5,0.16)] sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[25rem] sm:max-w-[92vw] sm:border-l sm:border-[#f6e7d3]/10 sm:bg-[linear-gradient(180deg,#19120e_0%,#231913_55%,#2b1f17_100%)] sm:text-[#f6e7d3] sm:shadow-[0_24px_80px_rgba(13,8,5,0.42)]"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-full flex-col px-6 pb-6 pt-6 sm:px-8 sm:pb-7 sm:pt-8">
                <div className="relative flex items-center justify-center pb-5 sm:mb-8 sm:items-start sm:justify-between sm:border-b sm:border-[#f6e7d3]/10 sm:pb-6">
                  <p className="font-logo text-[1.9rem] uppercase leading-none tracking-[0.01em] text-[#2d211a] sm:hidden">
                    SUSI
                  </p>
                  <div className="hidden pr-6 sm:block">
                    <p className="mb-3 font-ui text-[0.78rem] uppercase tracking-[0.42em] text-[#d4b17a]">
                      Menu
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeMenu}
                    className="absolute right-0 inline-flex h-14 w-14 items-center justify-center text-[#2d211a] transition-colors hover:text-[#b8945b] sm:static sm:h-12 sm:w-12 sm:rounded-full sm:border sm:border-[#d9b170]/65 sm:bg-transparent sm:text-[#f6e7d3] sm:hover:bg-[#f6e7d3]/10"
                    aria-label="Close menu"
                  >
                    <span className="text-[2.15rem] font-light leading-none sm:text-2xl">&times;</span>
                  </button>
                </div>
                <div className="mb-7 h-px bg-[#d7c4a5]/70 sm:hidden" />

                <div className="flex flex-1 flex-col sm:flex sm:flex-1 sm:flex-col">
                  <nav className="flex flex-1 flex-col items-center justify-center gap-8 pb-10 pt-8 text-center sm:items-stretch sm:justify-start sm:gap-6 sm:pb-0 sm:pt-0 sm:text-left">
                    {NAV_LINKS.map(({ label, href, subtitle, icon }, index) => (
                      <motion.a
                        key={href}
                        href={href}
                        onClick={closeMenu}
                        className="group w-full border-b border-[#d7c4a5]/50 pb-6 pt-1 text-[#2d211a] transition-colors duration-300 hover:text-[#b8945b] sm:flex sm:items-start sm:justify-between sm:border-b sm:border-[#f6e7d3]/10 sm:py-4 sm:text-[#f6e7d3] sm:hover:text-[#fff8ee]"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut', delay: menuOpen ? 0.12 + index * 0.06 : 0 }}
                      >
                        <div className="flex items-start gap-4 sm:gap-4">
                          <span className="mt-0.5 hidden text-[#d4b17a] transition-colors duration-300 group-hover:text-[#e2bf86] sm:block">
                            <NavItemIcon type={icon} />
                          </span>
                          <div>
                            <p className="font-heading text-[2.1rem] leading-none tracking-[-0.02em] sm:text-[1.45rem] sm:tracking-[-0.01em]">
                              {label}
                            </p>
                            <p className="mt-1.5 hidden font-editorial text-[0.95rem] leading-6 tracking-[0.01em] text-[#e3d6c3]/82 transition-colors duration-300 group-hover:text-[#f1e7d8]/92 sm:block sm:text-[1rem]">
                              {subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="hidden pt-1 text-3xl leading-none text-[#d4b17a] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#e2bf86] sm:block">
                          &rarr;
                        </span>
                      </motion.a>
                    ))}
                  </nav>

                  <div className="mt-auto border-t border-[#d7c4a5]/70 pt-5 sm:mt-6 sm:border-t sm:border-[#f6e7d3]/10 sm:pt-6 sm:pb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-ui text-[0.92rem] uppercase tracking-[0.34em] text-[#2d211a] sm:text-[0.95rem] sm:text-[#f6e7d3]">
                        Follow Us
                      </p>
                      <div className="flex items-center gap-5 text-[#2d211a]/85 sm:text-[#f6e7d3]/85">
                        <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#b8945b] sm:hover:text-[#d4b17a]">
                          <FacebookIcon />
                        </a>
                        <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#b8945b] sm:hover:text-[#d4b17a]">
                          <InstagramIcon />
                        </a>
                        <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="transition-colors hover:text-[#b8945b] sm:hover:text-[#d4b17a]">
                          <TikTokIcon />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
