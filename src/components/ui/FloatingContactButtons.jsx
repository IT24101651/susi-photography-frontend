import { FaWhatsapp } from 'react-icons/fa'
import { useEffect, useState } from 'react'
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
    whatsappHref: `https://wa.me/${internationalDigits}`,
  }
}

function WhatsAppIcon({ className = 'h-7 w-7' }) {
  return <FaWhatsapp className={className} aria-hidden="true" />
}

export default function FloatingContactButtons() {
  const { pathname } = useLocation()
  const { data: settings } = useSettings()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleMenuToggle = (event) => {
      setMenuOpen(Boolean(event?.detail?.open))
    }

    setMenuOpen(document.body.classList.contains('menu-open'))
    window.addEventListener('susi-menu-toggle', handleMenuToggle)

    return () => {
      window.removeEventListener('susi-menu-toggle', handleMenuToggle)
    }
  }, [])

  if (pathname.startsWith('/admin') || menuOpen) return null

  const phone = settings?.phone?.trim() || DEFAULT_PHONE
  const contact = normalizeSriLankanPhone(phone)

  return (
    <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_44px_rgba(12,18,37,0.28)] ring-1 ring-white/35 transition-transform duration-300 ease-out hover:scale-[1.04] hover:brightness-105 active:scale-[0.98] sm:h-16 sm:w-16"
      >
        <WhatsAppIcon />
      </a>

      <span className="sr-only">{`Contact us on WhatsApp at ${contact.localDisplay}`}</span>
    </div>
  )
}
