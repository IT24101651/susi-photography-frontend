import { useEffect, useState } from 'react'
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useSettings } from '../../hooks/usePublicData'

const DEFAULT_PHONE = '0775591068'

function stripDigits(value) {
  return `${value ?? ''}`.replace(/\D/g, '')
}

function formatLocalSriLankan(digits) {
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  return digits
}

function formatInternationalSriLankan(digits) {
  if (digits.length === 11 && digits.startsWith('94')) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }

  return digits.startsWith('+') ? digits : `+${digits}`
}

function normalizeSriLankanPhone(rawPhone) {
  const fallback = stripDigits(DEFAULT_PHONE)
  const digits = stripDigits(rawPhone) || fallback

  let localDigits = digits
  if (digits.startsWith('94') && digits.length >= 11) {
    localDigits = `0${digits.slice(2)}`
  } else if (!digits.startsWith('0')) {
    localDigits = `0${digits.slice(-9)}`
  }

  localDigits = stripDigits(localDigits).slice(0, 10) || fallback

  const internationalDigits = localDigits.startsWith('0')
    ? `94${localDigits.slice(1)}`
    : `94${localDigits}`

  return {
    localDisplay: formatLocalSriLankan(localDigits),
    internationalDisplay: formatInternationalSriLankan(internationalDigits),
    whatsappHref: `https://wa.me/${internationalDigits}`,
    callHref: `tel:+${internationalDigits}`,
  }
}

function ChatBubbleIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.2 13.3c0 4.2-3.6 7.7-8 7.7-1.4 0-2.8-.4-4-.9L4 21l1-3.8c-.8-1.3-1.2-2.8-1.2-4.4C3.8 8.6 7.4 5 11.9 5c4.4 0 8.3 3.4 8.3 8.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 11.6h.01M12 11.6h.01M15.2 11.6h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function XIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function WhatsAppIcon({ className = 'h-7 w-7' }) {
  return <FaWhatsapp className={className} aria-hidden="true" />
}

function PhoneIcon({ className = 'h-6 w-6' }) {
  return <FaPhoneAlt className={className} aria-hidden="true" />
}

function ActionRow({ href, label, icon, bgClass, hoverClass, onClick, target, rel }) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={label}
      className="group flex items-center justify-end gap-3"
    >
      <span
        className={[
          'grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_16px_34px_rgba(12,18,37,0.22)] transition-all duration-300 ease-out sm:h-16 sm:w-16',
          'ring-1 ring-white/50',
          bgClass,
          hoverClass,
        ].join(' ')}
      >
        {icon}
      </span>
    </a>
  )
}

export default function FloatingContactButtons() {
  const { pathname } = useLocation()
  const { data: settings } = useSettings()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (pathname.startsWith('/admin')) return null

  const phone = settings?.phone?.trim() || DEFAULT_PHONE
  const contact = normalizeSriLankanPhone(phone)
  const handleToggle = () => setIsOpen((current) => !current)
  const handleClose = () => setIsOpen(false)

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <div
        className={[
          'flex flex-col items-end gap-3 transition-all duration-300 ease-out',
          isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        ].join(' ')}
      >
        <ActionRow
          href={contact.whatsappHref}
          label="WhatsApp"
          target="_blank"
          rel="noreferrer"
          onClick={handleClose}
          bgClass="bg-[#25D366]"
          hoverClass="hover:brightness-105 hover:scale-[1.03] hover:shadow-[0_16px_38px_rgba(37,211,102,0.28)]"
          icon={<WhatsAppIcon />}
        />

        <ActionRow
          href={contact.callHref}
          label="Call"
          onClick={handleClose}
          bgClass="bg-[#5066d9]"
          hoverClass="hover:brightness-105 hover:scale-[1.03] hover:shadow-[0_16px_38px_rgba(80,102,217,0.28)]"
          icon={<PhoneIcon />}
        />
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isOpen}
        className={[
          'grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_18px_44px_rgba(12,18,37,0.28)] transition-transform duration-300 ease-out sm:h-16 sm:w-16',
          'bg-[#5066d9] ring-1 ring-white/35 hover:scale-[1.04] active:scale-[0.98]',
        ].join(' ')}
      >
        {isOpen ? <XIcon /> : <ChatBubbleIcon />}
      </button>

      <span className="sr-only">{`Contact us on WhatsApp at ${contact.localDisplay} or call ${contact.internationalDisplay}`}</span>
    </div>
  )
}
