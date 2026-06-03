import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { postContact } from '../../api/endpoints'
import { buildPortfolioCategories } from '../../data/portfolioCategories'
import { useCategories, useSettings } from '../../hooks/usePublicData'
import { normalizeUrl } from '../../utils/normalizeUrl'
import FadeInUp from '../ui/FadeInUp'

const SUBJECT_PACKAGE_OPTIONS = {
  'Wedding Photography': ['Dimand', 'Silvar', 'Platinum', 'Vip', 'Premium package', 'Gold'],
  'Birthday Photography': ['Normal 1', 'Normal 2', 'Platinum', 'Silver'],
  'Puberty Ceremony': ['Silver', 'Platinum', 'Vip', 'Gold'],
  'Engagement Photography': ['Silver 1', 'Silver 2', 'Gold', 'Platinum'],
}

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-1 block text-sm font-body text-text">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
)

const inputCls = 'w-full rounded-lg border border-sand bg-white px-4 py-2.5 font-body text-sm text-text transition-colors focus:border-accent focus:outline-none'
const mapTitle = 'Susi Photography head office map'
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BRANCH_LOCATIONS = [
  {
    name: 'Susi Digital Photography Head Office',
    brandLine: 'Susi Digital Photography',
    branchLine: 'Head Office',
    label: 'Suthumalai South, Anaicoddai',
    address: 'Susi Digital Photography, Suthumalai South Anaicoddai, Jaffna, Sri Lanka',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Susi+Digital+Photography,+Suthumalai+South+Anaicoddai,+Jaffna,+Sri+Lanka',
  },
  {
    name: 'Susi Digital Photography Kokkuvil Branch',
    brandLine: 'Susi Digital Photography',
    branchLine: 'Kokkuvil Branch',
    label: 'Kokkuvil Church Lane, Jaffna',
    address: 'SUSI PHOTOGRAPHY - KOKKUVIL BRANCH, Kokkuvil Church Lane, Jaffna, Sri Lanka',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SUSI+PHOTOGRAPHY+-+KOKKUVIL+BRANCH,+Kokkuvil+Church+Lane,+Jaffna,+Sri+Lanka',
  },
]
const namePattern = /^[A-Za-z\s]+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const messagePattern = /^[A-Za-z0-9\s.,!?'"()\-/:;&@#\n\r]+$/

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps)
      return
    }

    const existingScript = document.querySelector('script[data-google-maps="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps), { once: true })
      existingScript.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => resolve(window.google.maps)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function BranchMap() {
  const mapRef = useRef(null)
  const [mapState, setMapState] = useState('loading')

  useEffect(() => {
    if (!googleMapsApiKey || !mapRef.current) {
      setMapState('missing-key')
      return
    }

    let cancelled = false

    const initializeMap = async () => {
      try {
        const maps = await loadGoogleMapsScript(googleMapsApiKey)
        if (cancelled || !mapRef.current) return

        const map = new maps.Map(mapRef.current, {
          center: { lat: 9.70, lng: 80.03 },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        const geocoder = new maps.Geocoder()
        const bounds = new maps.LatLngBounds()

        class BranchLabel extends maps.OverlayView {
          constructor(position, branch) {
            super()
            this.position = position
            this.branch = branch
            this.div = null
          }

          onAdd() {
            const div = document.createElement('div')
            div.className = 'branch-map-label'
            div.innerHTML = `
              <span class="branch-map-label__brand">${this.branch.brandLine}</span>
              <span class="branch-map-label__branch">${this.branch.branchLine}</span>
            `
            this.div = div

            const panes = this.getPanes()
            panes?.overlayMouseTarget.appendChild(div)
          }

          draw() {
            if (!this.div) return

            const projection = this.getProjection()
            if (!projection) return

            const point = projection.fromLatLngToDivPixel(this.position)
            if (!point) return

            this.div.style.left = `${point.x + 18}px`
            this.div.style.top = `${point.y - 12}px`
          }

          onRemove() {
            if (this.div?.parentNode) {
              this.div.parentNode.removeChild(this.div)
            }
            this.div = null
          }
        }

        const geocodeResults = await Promise.all(
          BRANCH_LOCATIONS.map(
            (branch) =>
              new Promise((resolve) => {
                geocoder.geocode({ address: branch.address }, (results, status) => {
                  if (status === 'OK' && results?.[0]?.geometry?.location) {
                    resolve({
                      ...branch,
                      location: results[0].geometry.location,
                    })
                    return
                  }

                  resolve(null)
                })
              }),
          ),
        )

        const branchesWithLocations = geocodeResults.filter(Boolean)

        if (!branchesWithLocations.length) {
          setMapState('error')
          return
        }

        branchesWithLocations.forEach((branch) => {
          const marker = new maps.Marker({
            map,
            position: branch.location,
            title: branch.name,
          })

          marker.addListener('click', () => {
            window.open(branch.mapsUrl, '_blank', 'noopener,noreferrer')
          })
          const label = new BranchLabel(branch.location, branch)
          label.setMap(map)

          bounds.extend(branch.location)
        })

        if (branchesWithLocations.length === 1) {
          map.setCenter(branchesWithLocations[0].location)
          map.setZoom(15)
        } else {
          map.fitBounds(bounds, 70)
        }

        setMapState('ready')
      } catch {
        if (!cancelled) {
          setMapState('error')
        }
      }
    }

    initializeMap()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-sand bg-white min-h-[320px]">
      <div ref={mapRef} className="min-h-[320px] h-[320px] w-full" aria-label={mapTitle} />
      {mapState !== 'ready' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f7f0e6] px-6 text-center">
          <p className="max-w-sm font-body text-sm leading-7 text-[#786453]">
            {mapState === 'missing-key'
              ? 'Add your Google Maps API key in frontend/.env under VITE_GOOGLE_MAPS_API_KEY to display the branch map here.'
              : mapState === 'error'
                ? 'The Google map could not load both branch locations yet. Please make sure Maps JavaScript API and Geocoding are enabled for this key.'
                : 'Loading branch map...'}
          </p>
        </div>
      ) : null}
    </div>
  )
}

const restrictNameInput = (event) => {
  const filteredValue = event.target.value.replace(/[^A-Za-z\s]/g, '')
  if (filteredValue !== event.target.value) {
    event.target.value = filteredValue
  }
}

const restrictPhoneInput = (event) => {
  const filteredValue = event.target.value.replace(/(?!^\+)[^\d\s()-]/g, '')
  let digitCount = 0
  const limitedValue = filteredValue
    .split('')
    .filter((char, index) => {
      if (/\d/.test(char)) {
        digitCount += 1
        return digitCount <= 15
      }

      if (char === '+') {
        return index === 0
      }

      return /[\s()-]/.test(char)
    })
    .join('')

  if (limitedValue !== event.target.value) {
    event.target.value = limitedValue
  }
}

const InstagramIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.4-.1-1.2-.2-2.2-.2-2.2 0-3.8 1.3-3.8 3.9V11H7.5v3H10v7h3.5Z" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.5 3c.3 1.8 1.4 3.3 3 4.2 1 .6 2 .8 3 .8v3.1c-1.6 0-3.2-.5-4.6-1.4v5.5c0 3.2-2.6 5.8-5.8 5.8S4.3 18.4 4.3 15.2s2.6-5.8 5.8-5.8c.4 0 .8 0 1.1.1v3.2a2.8 2.8 0 0 0-1.1-.2c-1.5 0-2.7 1.2-2.7 2.7S8.6 18 10.1 18s2.7-1.2 2.7-2.7V3h1.7Z" />
  </svg>
)

const SocialIconLink = ({ href, label, children }) => {
  if (!href) {
    return (
      <span className="text-muted/70" aria-label={label}>
        {children}
      </span>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent" aria-label={label}>
      {children}
    </a>
  )
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm()
  const { data: apiCategories = [] } = useCategories()
  const { data: settings } = useSettings()
  const subjectField = register('subject', { required: 'Subject is required' })
  const subjectOptions = useMemo(
    () => buildPortfolioCategories(apiCategories).map((category) => category.title),
    [apiCategories],
  )
  const selectedSubject = watch('subject')
  const selectedPackageOptions = selectedSubject ? SUBJECT_PACKAGE_OPTIONS[selectedSubject] ?? [] : []
  const showPackageDropdown = selectedPackageOptions.length > 0
  const defaultTikTokUrl = 'https://www.tiktok.com/@susi.digital.photo?_r=1&_t=ZS-96YP6m5NUX6'
  const instagramUrl = normalizeUrl(settings?.instagram_url)
  const facebookUrl = normalizeUrl(settings?.facebook_url) || 'https://web.facebook.com/SusiDigital'
  const tiktokUrl = normalizeUrl(settings?.tiktok_url) || defaultTikTokUrl

  const { mutate, isPending } = useMutation({
    mutationFn: postContact,
    onSuccess: () => { toast.success('Message sent! We\'ll be in touch soon.'); reset() },
    onError: () => toast.error('Something went wrong. Please try again.'),
  })

  const validatePhoneNumber = (value) => {
    const trimmedValue = value?.trim()

    if (!trimmedValue) return true
    if (/[A-Za-z]/.test(trimmedValue)) return 'Phone number cannot contain letters'
    if (!/^\+?[\d\s()-]+$/.test(trimmedValue)) return 'Enter a valid phone number'

    const digits = trimmedValue.replace(/\D/g, '')

    if (digits.length > 15) {
      return 'Phone number must be 15 digits or fewer'
    }

    return (digits.length >= 8 && digits.length <= 15) || 'International phone numbers must be 8 to 15 digits'
  }

  const onSubjectChange = (event) => {
    subjectField.onChange(event)
    setValue('subjectPackage', '', { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = (data) => {
    mutate({
      ...data,
      subject: data.subjectPackage ? `${data.subject} - ${data.subjectPackage}` : data.subject,
    })
  }

  return (
    <section id="contact" className="bg-beige py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <FadeInUp delay={0.1}>
            <div className="space-y-10">
              <div className="space-y-5">
                <div>
                  <p className="font-editorial text-[0.78rem] font-semibold uppercase tracking-[0.36em] text-[#6f5743] [font-variant:small-caps]">
                    Stay Connected
                  </p>
                  <h3 className="mt-3 font-times-italic text-[2rem] leading-[1.02] tracking-[-0.02em] text-text">
                    Follow our work and find us easily.
                  </h3>
                  <p className="mt-3 max-w-md font-cormorant-medium text-[1.18rem] leading-7 tracking-[0.018em] text-[#72665b] sm:text-[1.24rem]">
                    Your address, phone, and email now live in the footer bar below for a cleaner contact section.
                  </p>
                </div>
                <div className="pointer-events-auto relative z-10 flex items-center gap-5 text-muted">
                  <SocialIconLink href={instagramUrl} label="Instagram">
                    <InstagramIcon />
                  </SocialIconLink>
                  <SocialIconLink href={facebookUrl} label="Facebook">
                    <FacebookIcon />
                  </SocialIconLink>
                  <SocialIconLink href={tiktokUrl} label="TikTok">
                    <TikTokIcon />
                  </SocialIconLink>
                </div>
              </div>

              <BranchMap />
            </div>
          </FadeInUp>

          <div>
            <FadeInUp>
              <h2 className="mb-2 text-center font-times-italic text-[2.5rem] leading-[0.98] tracking-[-0.02em] text-text lg:text-left">
                Get in Touch
              </h2>
              <p className="mb-12 text-center font-cormorant-medium text-[1.18rem] leading-8 tracking-[0.018em] text-[#72665b] lg:text-left sm:text-[1.24rem]">
                We'd love to hear about your story
              </p>
            </FadeInUp>
            <FadeInUp delay={0.1}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name *" error={errors.name}>
                    <input
                      className={inputCls}
                      placeholder="Your name"
                      onInput={restrictNameInput}
                      {...register('name', {
                        required: 'Name is required',
                        validate: (value) => value.trim().length > 0 || 'Name is required',
                        pattern: { value: namePattern, message: 'Name can only contain letters and spaces' },
                      })}
                    />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input
                      className={inputCls}
                      placeholder="your@email.com"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) => value.trim().length > 0 || 'Email is required',
                        pattern: { value: emailPattern, message: 'Enter a valid email address' },
                      })}
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone *" error={errors.phone}>
                    <input
                      className={inputCls}
                      placeholder="+1 234 567 890"
                      onInput={restrictPhoneInput}
                      {...register('phone', {
                        required: 'Phone number is required',
                        validate: validatePhoneNumber,
                      })}
                    />
                  </Field>
                  <Field label="Subject *" error={errors.subject}>
                    <select className={inputCls} defaultValue="" {...subjectField} onChange={onSubjectChange}>
                      <option value="" disabled>Select a category</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                {showPackageDropdown && (
                  <Field label="Package *" error={errors.subjectPackage}>
                    <select className={inputCls} defaultValue="" {...register('subjectPackage', { required: 'Package is required' })}>
                      <option value="" disabled>Select a package</option>
                      {selectedPackageOptions.map((packageName) => (
                        <option key={packageName} value={packageName}>{packageName}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Message" error={errors.message}>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={5}
                    placeholder="Tell us about your vision..."
                    {...register('message', {
                      validate: (value) => {
                        if (!value?.trim()) return true
                        if (value.trim().length < 10) return 'Message must be at least 10 characters'
                        if (value.length > 500) return 'Message must be 500 characters or less'
                        if (!messagePattern.test(value)) return 'Message contains invalid characters'
                        return true
                      },
                    })}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-accent py-3 font-body text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
                >
                  {isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  )
}
