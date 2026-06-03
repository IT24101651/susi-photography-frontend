import { useEffect, useState } from 'react'
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

    return () => {
      document.body.style.overflow = ''
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

      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          onClick={closeMenu}
          aria-label="Close menu overlay"
        />
        <aside className={`absolute right-0 top-0 h-full w-[25rem] max-w-[92vw] border-l border-[#f6e7d3]/10 bg-[linear-gradient(180deg,#19120e_0%,#231913_55%,#2b1f17_100%)] text-[#f6e7d3] shadow-[0_24px_80px_rgba(13,8,5,0.42)] transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-full flex-col px-8 pb-7 pt-8">
            <div className="mb-8 flex items-start justify-between border-b border-[#f6e7d3]/10 pb-6">
              <div className="pr-6">
                <p className="mb-3 font-ui text-[0.78rem] uppercase tracking-[0.42em] text-[#d4b17a]">
                  Menu
                </p>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b170]/65 bg-transparent text-[#f6e7d3] transition-colors hover:bg-[#f6e7d3]/10"
                aria-label="Close menu"
              >
                <span className="text-2xl font-light leading-none">&times;</span>
              </button>
            </div>

            <nav className="flex flex-1 flex-col">
              {NAV_LINKS.map(({ label, href, subtitle, icon }) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="group flex items-start justify-between border-b border-[#f6e7d3]/10 py-5 transition-colors duration-300 hover:text-[#fff8ee]"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-[#d4b17a] transition-colors duration-300 group-hover:text-[#e2bf86]">
                      <NavItemIcon type={icon} />
                    </span>
                    <div>
                      <p className="font-luxury text-[1.45rem] leading-none tracking-[-0.01em] text-[#f6e7d3] sm:text-[1.65rem]">
                        {label}
                      </p>
                      <p className="mt-1.5 font-editorial text-[0.95rem] leading-6 tracking-[0.01em] text-[#e3d6c3]/82 transition-colors duration-300 group-hover:text-[#f1e7d8]/92 sm:text-[1rem]">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="pt-1 text-3xl leading-none text-[#d4b17a] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#e2bf86]">
                    →
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-7 hidden overflow-hidden rounded-[1.65rem] border border-[#5c4330]/55 bg-[linear-gradient(90deg,#17110d_0%,#221913_55%,#2c2018_100%)] sm:block">
              <div className="grid grid-cols-[7.25rem_minmax(0,1fr)]">
                {settings?.hero_card_image ? (
                  <img
                    src={settings.hero_card_image}
                    alt="Featured wedding detail"
                    className="h-full min-h-[11.5rem] w-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-[11.5rem] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,177,122,0.22),_transparent_42%),linear-gradient(180deg,#5a3c26_0%,#2e1d13_100%)] px-4 text-center">
                    <p className="font-logo text-3xl uppercase tracking-[0.06em] text-[#f6e7d3]">
                      SUSI
                    </p>
                  </div>
                )}
                <div className="flex flex-col justify-between px-5 py-5">
                  <div>
                    <p className="font-ui text-[0.78rem] uppercase tracking-[0.34em] text-[#f6e7d3]">
                      Let's Create
                    </p>
                    <p className="mt-1 font-ui text-[0.78rem] uppercase tracking-[0.34em] text-[#f6e7d3]">
                      Something Beautiful
                    </p>
                    <p className="mt-4 font-outfit-light text-[0.96rem] leading-7 tracking-[0.01em] text-[#d5c1a5]/82">
                      Every love story is unique. Let's capture yours.
                    </p>
                  </div>
                  <a
                    href="#contact"
                    onClick={closeMenu}
                    className="mt-4 inline-flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-[#d4b17a] transition-transform duration-300 hover:translate-x-1"
                  >
                    Book a Session
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="font-ui text-[0.95rem] uppercase tracking-[0.34em] text-[#f6e7d3]">
                Follow Us
              </p>
              <div className="flex items-center gap-5 text-[#f6e7d3]/85">
                <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#d4b17a]">
                  <FacebookIcon />
                </a>
                <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#d4b17a]">
                  <InstagramIcon />
                </a>
                <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="transition-colors hover:text-[#d4b17a]">
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
