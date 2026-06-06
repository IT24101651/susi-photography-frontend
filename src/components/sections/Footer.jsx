import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '../../hooks/usePublicData'
import { normalizeUrl } from '../../utils/normalizeUrl'
import BrandLogo from '../ui/BrandLogo'

const ABOUT_TEXT = 'Timeless storytelling through refined portraiture, heartfelt moments, and elegant visual craft shaped for every chapter of your life.'

const sectionTitleClass =
  'font-body text-[11px] uppercase tracking-[0.28em] text-[#d4b17a]'

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.4-.1-1.2-.2-2.2-.2-2.2 0-3.8 1.3-3.8 3.9V11H7.5v3H10v7h3.5Z" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.5 3c.3 1.8 1.4 3.3 3 4.2 1 .6 2 .8 3 .8v3.1c-1.6 0-3.2-.5-4.6-1.4v5.5c0 3.2-2.6 5.8-5.8 5.8S4.3 18.4 4.3 15.2s2.6-5.8 5.8-5.8c.4 0 .8 0 1.1.1v3.2a2.8 2.8 0 0 0-1.1-.2c-1.5 0-2.7 1.2-2.7 2.7S8.6 18 10.1 18s2.7-1.2 2.7-2.7V3h1.7Z" />
  </svg>
)

const PhoneIcon = ({ className = 'h-[18px] w-[18px]' }) => <FaPhoneAlt className={className} aria-hidden="true" />

const WhatsAppIcon = ({ className = 'h-[18px] w-[18px]' }) => <FaWhatsapp className={className} aria-hidden="true" />

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m5.5 8 6.5 5 6.5-5" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
)

function ContactItem({ href, icon: Icon, children }) {
  const content = (
    <div className="group flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#7c5a32]/45 bg-[#3a2415]/55 text-[#c9a46d] transition-all duration-300 group-hover:border-[#d4b17a] group-hover:text-[#e3c185]">
        <Icon />
      </span>
      <span className="min-w-0 font-body text-sm leading-7 text-[#ccb89a] transition-colors duration-300 group-hover:text-[#f0dfc6]">
        {children}
      </span>
    </div>
  )

  if (!href) return content

  return (
    <a href={href} className="block">
      {content}
    </a>
  )
}

function SocialIconLink({ href, label, children }) {
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex items-center gap-3 font-body text-sm leading-7 text-[#ccb89a] transition-all duration-300 hover:translate-x-1 hover:text-[#f0dfc6]"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7c5a32]/45 bg-[#3a2415]/55 text-[#c9a46d] transition-all duration-300 hover:border-[#d4b17a] hover:bg-[#4a2e1a] hover:text-[#e3c185] hover:shadow-[0_16px_36px_rgba(120,82,43,0.18)]">
        {children}
      </span>
      <span>{label}</span>
    </a>
  )
}

function ContactNumberGroup({ icon: Icon, values = [], type }) {
  const items = values.filter(Boolean)

  if (!items.length) return null

  return (
    <div className="group flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#7c5a32]/45 bg-[#3a2415]/55 text-[#c9a46d] transition-all duration-300 group-hover:border-[#d4b17a] group-hover:text-[#e3c185]">
        <Icon />
      </span>
      <div className="min-w-0 space-y-1.5 font-body text-sm leading-7 text-[#ccb89a] transition-colors duration-300 group-hover:text-[#f0dfc6]">
        {items.map((value) => {
          const href = type === 'whatsapp'
            ? `https://wa.me/94${value.replace(/\D/g, '').replace(/^0/, '')}`
            : `tel:${value}`

          return (
            <a key={`${type}-${value}`} href={href} className="block">
              {value}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function Footer() {
  const { data: settings } = useSettings()
  const defaultFacebookUrl = 'https://web.facebook.com/SusiDigital'
  const defaultTikTokUrl = 'https://www.tiktok.com/@susi.digital.photo?_r=1&_t=ZS-96YP6m5NUX6'
  const phone = settings?.phone?.trim() || '0775591068'
  const phoneSecondary = settings?.phone_secondary?.trim()
  const phoneNumbers = [phone, phoneSecondary].filter(Boolean)
  const email = settings?.email?.trim() || 'P.susi26@gmail.com'
  const address = settings?.address?.trim() || 'HEAD OFFICE - Suthumalai south Anaicoddai, BRANCH - Kokkuvil church lane, Jaffna, Sri Lanka, 40000'
  const instagramUrl = normalizeUrl(settings?.instagram_url)
  const facebookUrl = normalizeUrl(settings?.facebook_url) || defaultFacebookUrl
  const tiktokUrl = normalizeUrl(settings?.tiktok_url) || defaultTikTokUrl
  const footerText = settings?.footer_text?.trim() || ABOUT_TEXT

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,#130e0b_0%,#1c140f_46%,#261913_100%)] text-[#dfc7a3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,177,122,0.12),_transparent_28%),radial-gradient(circle_at_right,_rgba(255,255,255,0.05),_transparent_20%)]" />
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-12 sm:px-8 lg:px-12 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.95fr)_minmax(0,0.9fr)] lg:gap-10">

          <div className="border-b border-[#6e5435]/35 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-3">
              <BrandLogo
                light
                name={settings?.shop_name || 'Susi Photography'}
                textColorClass="text-[#f4e0bb]"
                className="[&_span:last-child]:text-[1rem] [&_span:last-child]:tracking-[0.18em] sm:[&_span:last-child]:text-[1.12rem]"
                imageClassName="rounded-full object-cover ring-1 ring-[#f1d39a]/20"
              />
            </div>
            <p className="mt-4 max-w-md font-source-serif text-[1.08rem] leading-8 tracking-[0.01em] text-[#c7ad89] sm:text-[1.14rem]">
              {footerText}
            </p>
            <div className="relative mt-5 w-full max-w-[260px]">
              <div className="absolute inset-[-12px] rounded-[28px] bg-[radial-gradient(circle_at_center,_rgba(232,194,120,0.40),_rgba(206,151,74,0.16)_42%,_transparent_74%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[22px] border border-[#7b5a3a]/35 bg-[#1a120d]">
                <img
                  src="/Camara.jpg"
                  alt="Photography camera"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-[#6e5435]/35 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <p className={sectionTitleClass}>Contact</p>
            <div className="mt-5 space-y-4">
              <ContactNumberGroup icon={PhoneIcon} values={phoneNumbers} type="phone" />
              <ContactNumberGroup icon={WhatsAppIcon} values={phoneNumbers} type="whatsapp" />
              <ContactItem href={`mailto:${email}`} icon={MailIcon}>
                {email}
              </ContactItem>
              <ContactItem icon={MapPinIcon}>
                <span className="block space-y-1">
                  <span className="block">HEAD OFFICE - Suthumalai south Anaicoddai</span>
                  <span className="block">BRANCH - Kokkuvil church lane, Jaffna</span>
                </span>
              </ContactItem>
            </div>
          </div>

          <div>
            <p className={sectionTitleClass}>Social</p>
            <div className="mt-5 space-y-3">
              <SocialIconLink href={instagramUrl} label="Instagram">
                <InstagramIcon />
              </SocialIconLink>
              <SocialIconLink href={tiktokUrl} label="TikTok">
                <TikTokIcon />
              </SocialIconLink>
              <SocialIconLink href={facebookUrl} label="Facebook">
                <FacebookIcon />
              </SocialIconLink>
            </div>
            <div className="mt-8 rounded-[18px] border border-[#725238]/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_100%)] px-5 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
              <p className="font-editorial text-[0.9rem] uppercase tracking-[0.28em] text-[#e7cfab] [font-variant:small-caps]">
                Capturing moments.
              </p>
              <p className="mt-2 font-editorial text-[0.9rem] uppercase tracking-[0.28em] text-[#e7cfab] [font-variant:small-caps]">
                Creating memories.
              </p>
              <div className="mx-auto mt-4 h-px w-10 bg-[#c79b5b]" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#6e5435]/45 pt-5">
          <p className="text-center font-body text-xs tracking-[0.18em] text-[#8f7657] sm:text-left">
            {'\u00A9'} 2026 SUSI Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
