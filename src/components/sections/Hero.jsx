import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSlides, useSettings } from '../../hooks/usePublicData'

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="4" width="18" height="18" rx="2.5" />
    <path d="M8 2v4M16 2v4" />
    <path d="M3 9h18" />
  </svg>
)

const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="3.2" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M15.5 3.3a3.2 3.2 0 0 1 0 6.1" />
  </svg>
)

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h3l1.7-2h6.6L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 20.5-1.4-1.27C5.4 14.5 2 11.4 2 7.63 2 4.56 4.42 2.2 7.5 2.2c1.74 0 3.41.8 4.5 2.06A6 6 0 0 1 16.5 2.2C19.58 2.2 22 4.56 22 7.63c0 3.77-3.4 6.88-8.6 11.6L12 20.5Z" />
  </svg>
)

export default function Hero() {
  const { data: slides, isLoading: slidesLoading } = useSlides()
  const { data: settings } = useSettings()
  const fallbackHeroImage = '/hero/10.jpg'
  const items = slides ?? []
  const slideSources = items.map((item) => `${item.id}:${item.image ?? ''}`).join('|')
  const hasSlides = items.length > 0
  const [current, setCurrent] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const [imageVersion, setImageVersion] = useState(0)
  const loadedImagesRef = useRef(new Set())
  const lengthRef = useRef(Math.max(items.length, 1))
  lengthRef.current = Math.max(items.length, 1)

  useEffect(() => {
    if (!hasSlides) {
      loadedImagesRef.current = new Set()
      setDisplayedIndex(0)
      return
    }

    let cancelled = false

    items.forEach((item) => {
      if (!item.image || loadedImagesRef.current.has(item.image)) return
      const img = new Image()
      const markLoaded = () => {
        if (cancelled || loadedImagesRef.current.has(item.image)) return
        loadedImagesRef.current.add(item.image)
        setImageVersion((value) => value + 1)
      }
      img.onload = markLoaded
      img.onerror = markLoaded
      img.src = item.image
      if (img.complete) markLoaded()
    })

    return () => {
      cancelled = true
    }
  }, [hasSlides, slideSources])

  useEffect(() => {
    if (!hasSlides) return undefined
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % lengthRef.current)
    }, 3000)
    return () => clearInterval(id)
  }, [hasSlides])

  useEffect(() => {
    if (!hasSlides || current < items.length) return
    setCurrent(0)
  }, [current, hasSlides, items.length])

  useEffect(() => {
    if (!hasSlides || items.length === 0) {
      setDisplayedIndex(0)
      return
    }
    const nextImage = items[current]?.image
    if (!nextImage || loadedImagesRef.current.has(nextImage)) {
      setDisplayedIndex(current)
    }
  }, [current, hasSlides, imageVersion, items])

  const activeIndex = hasSlides ? displayedIndex : 0
  const activeSlide = hasSlides ? items[activeIndex] : null
  const capturedMomentsCount = Number.isFinite(Number(settings?.captured_moments_count))
    ? Number(settings.captured_moments_count)
    : 1000
  const luxurySubtitle = !slidesLoading && activeSlide?.subtitle ? activeSlide.subtitle : ''

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden">
      <img
        src={fallbackHeroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {hasSlides ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity' }}
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-full w-full object-cover object-[66%_center] sm:object-center"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,160,106,0.22),_transparent_45%),linear-gradient(180deg,_#1b1a1f_0%,_#121117_100%)]" />
      )}

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(9,6,4,0.88)_0%,rgba(19,12,8,0.76)_27%,rgba(28,18,12,0.48)_48%,rgba(38,25,17,0.18)_70%,rgba(46,31,22,0.10)_100%)]" />
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(10,8,6,0.48)_0%,rgba(24,16,11,0.22)_28%,rgba(26,18,12,0.34)_100%)]" />
      <div className="absolute inset-x-4 top-[5.2rem] z-[3] h-px bg-[linear-gradient(90deg,rgba(190,147,86,0.68)_0%,rgba(190,147,86,0.4)_45%,rgba(190,147,86,0.12)_100%)] sm:inset-x-6 sm:top-[5.85rem] lg:inset-x-10 lg:top-[6.45rem]" />

      <div className="absolute inset-0 z-10 flex items-start px-4 pb-5 pt-[5.35rem] text-white sm:items-start sm:px-6 sm:pb-12 sm:pt-[9.9rem] lg:items-center lg:px-10 lg:pb-14 lg:pt-0">
        <div className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`content-${activeIndex}`}
              className="flex max-w-[18rem] flex-col items-start text-left sm:max-w-[22rem] md:max-w-[26rem] lg:mt-32 lg:max-w-[33rem]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              style={{ willChange: 'opacity, transform' }}
            >
              <h1
                className="mb-4 font-heading text-[2.72rem] leading-[0.88] tracking-[-0.05em] text-[#f9f3eb] sm:mb-5 sm:text-[3.1rem] md:text-[3.9rem] lg:text-[4.9rem]"
                style={{ textShadow: '0 18px 38px rgba(5, 3, 2, 0.42)' }}
              >
                <span className="block">Capturing</span>
                <span className="block text-[#d2aa67]">every moment</span>
                <span className="block">of your beautiful</span>
                <span className="block">life</span>
              </h1>

              <div className="mb-4 h-px w-10 bg-[#c39a59] sm:mb-6 sm:w-16 lg:w-20" />

              <p className="min-h-[4.5rem] max-w-[17rem] font-editorial text-[1.1rem] leading-7 text-[#f3ebe0]/88 text-balance sm:min-h-[5.5rem] sm:max-w-[21rem] sm:text-[1.35rem] sm:leading-9 md:max-w-[24rem] md:text-[1.42rem] lg:max-w-[28rem] lg:text-[1.55rem] lg:leading-10">
                {luxurySubtitle}
              </p>

              <div className="mt-5 flex w-full max-w-[18rem] flex-col items-stretch gap-3 sm:mt-8 sm:max-w-[22rem] md:max-w-[24rem] lg:mt-10 lg:max-w-none lg:flex-row lg:items-center lg:gap-4">
                <a
                  href="#portfolio"
                  className="inline-flex min-w-0 items-center justify-center gap-3 rounded-md bg-[#d2aa67] px-5 py-3.5 font-ui text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#26180f] shadow-[0_16px_32px_rgba(164,123,58,0.24)] transition-colors hover:bg-[#debc82] sm:px-6 sm:py-3.5 sm:text-sm lg:min-w-[14.5rem] lg:py-4"
                >
                  View Portfolio
                  <span aria-hidden="true"><ArrowIcon /></span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-md border border-[#9f7845] bg-[#1a110c]/34 px-5 py-3.5 font-ui text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#f7eddc] backdrop-blur-sm transition-colors hover:bg-[#24160d]/42 sm:px-6 sm:py-3.5 sm:text-sm lg:min-w-[14.5rem] lg:py-4"
                >
                  <span className="whitespace-nowrap">Book a Session</span>
                  <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
                    <CalendarIcon />
                  </span>
                </a>
              </div>

              <div className="mt-6 grid w-full max-w-[18rem] grid-cols-1 gap-x-4 gap-y-3 text-[#efdfc6] sm:max-w-[22rem] sm:grid-cols-1 md:max-w-[24rem] lg:mt-10 lg:max-w-none lg:grid-cols-[auto_1px_auto_1px_auto] lg:items-start lg:gap-5">
                <div className="flex min-w-0 items-center gap-2 sm:items-start sm:gap-3">
                  <span className="mt-0.5 scale-90 text-[#d2aa67] sm:scale-100"><PeopleIcon /></span>
                  <div>
                    <p className="font-body text-[1.08rem] font-semibold leading-none sm:text-lg">{capturedMomentsCount}+</p>
                    <p className="font-body text-[0.86rem] leading-tight text-[#cbb79a] sm:text-sm">Captured Moments</p>
                  </div>
                </div>
                <div className="col-span-full h-px w-full max-w-[7rem] bg-[linear-gradient(90deg,rgba(195,154,89,0.88)_0%,rgba(195,154,89,0.42)_70%,rgba(195,154,89,0.08)_100%)] sm:hidden" />
                <div className="hidden h-10 w-px self-center bg-[#89663d]/55 lg:block" />
                <div className="flex min-w-0 items-center gap-2 sm:items-start sm:gap-3">
                  <span className="mt-0.5 scale-90 text-[#d2aa67] sm:scale-100"><CameraIcon /></span>
                  <div>
                    <p className="font-body text-[1.08rem] font-semibold leading-none sm:text-lg">Cinematic</p>
                    <p className="font-body text-[0.86rem] leading-tight text-[#cbb79a] sm:text-sm">Storytelling</p>
                  </div>
                </div>
                <div className="col-span-full h-px w-full max-w-[7rem] bg-[linear-gradient(90deg,rgba(195,154,89,0.88)_0%,rgba(195,154,89,0.42)_70%,rgba(195,154,89,0.08)_100%)] sm:hidden" />
                <div className="hidden h-10 w-px self-center bg-[#89663d]/55 lg:block" />
                <div className="col-span-1 flex min-w-0 items-center gap-2 sm:items-start sm:gap-3 lg:col-span-1">
                  <span className="mt-0.5 scale-90 text-[#d2aa67] sm:scale-100"><HeartIcon /></span>
                  <div>
                    <p className="font-body text-[1.08rem] font-semibold leading-none sm:text-lg">Since 2009</p>
                    <p className="font-body text-[0.86rem] leading-tight text-[#cbb79a] sm:text-sm">Capturing Emotions</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 h-px w-full max-w-[7rem] bg-[linear-gradient(90deg,rgba(195,154,89,0.88)_0%,rgba(195,154,89,0.42)_70%,rgba(195,154,89,0.08)_100%)] sm:hidden" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
