import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeInUp from '../ui/FadeInUp'
import { usePackages, usePackagesByCategory } from '../../hooks/usePublicData'

function CategoryBadgeIcon({ slug }) {
  if (slug === 'wedding') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <circle cx="8" cy="14" r="4.5" />
        <circle cx="15.5" cy="14" r="4.5" />
        <path d="M11.5 7.5a2.5 2.5 0 0 1 5 0" />
        <path d="M14 4.5l1.5 2h-3z" />
      </svg>
    )
  }

  if (slug === 'puberty-ceremony') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <path d="M12 4.5c-2.5 0-4.5 1.8-4.5 4.1v1.4c0 1.1.4 2.2 1.1 3.1l1.1 1.4V18" />
        <path d="M12 4.5c2.5 0 4.5 1.8 4.5 4.1v1.4c0 1.1-.4 2.2-1.1 3.1l-1.1 1.4V18" />
        <path d="M9.2 12.4h5.6" />
        <path d="M7.8 18.5h8.4" />
      </svg>
    )
  }

  if (slug === 'birthday') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <path d="M5 19.5h14" />
        <path d="M6 19.5V11h12v8.5" />
        <path d="M8.5 11V8.8c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V11" />
        <path d="M12 11V7.8c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V11" />
        <path d="M9.5 6.5l.8-1.4M14.5 6.5l.8-1.4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
      <path d="M12 3.5l3.2 6.4 7.1 1-5.2 5.1 1.2 7.1-6.3-3.3-6.3 3.3 1.2-7.1-5.2-5.1 7.1-1z" />
    </svg>
  )
}

export default function Packages() {
  const { data: packageCards = [] } = usePackages()
  const [activeSlug, setActiveSlug] = useState('')
  const [showAll, setShowAll] = useState(false)
  const { data: categoryCards = [] } = usePackagesByCategory(activeSlug)

  const categories = useMemo(() => {
    const bySlug = new Map()
    packageCards.forEach((card) => {
      if (card.category?.slug && !bySlug.has(card.category.slug)) {
        bySlug.set(card.category.slug, card.category)
      }
    })
    return Array.from(bySlug.values())
  }, [packageCards])

  const displayedCards = activeSlug ? categoryCards : []
  const visibleCards = showAll ? displayedCards : displayedCards.slice(0, 3)

  useEffect(() => {
    if (!categories.length) return
    if (!activeSlug || !categories.some((category) => category.slug === activeSlug)) {
      setActiveSlug(categories[0].slug)
    }
  }, [activeSlug, categories])

  useEffect(() => {
    setShowAll(false)
  }, [activeSlug])

  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeInUp>
          <h2 className="font-times-italic text-center text-[2.5rem] leading-[0.98] tracking-[-0.02em] text-text sm:text-[3.25rem]">
            Packages
          </h2>
          <p className="mb-10 text-center font-cormorant-medium text-[1.26rem] leading-8 tracking-[0.018em] text-[#72665b] sm:text-[1.34rem]">
            Choose the package that fits your celebration best
          </p>
        </FadeInUp>

        {categories.length > 0 ? (
          <>
            <FadeInUp delay={0.1}>
              <div className="mb-12 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setActiveSlug(category.slug)}
                    className={`group inline-flex min-h-[4.1rem] items-center rounded-full border px-3 py-2 text-left shadow-[0_10px_30px_rgba(44,44,44,0.06)] transition-all duration-300 sm:px-4 sm:py-2.5 ${
                      activeSlug === category.slug
                        ? 'border-[#d4b98c] bg-gradient-to-r from-[#cfab6c] via-[#e7d2aa] to-[#f4e7cf] text-[#2d211a]'
                        : 'border-[#e5dccb] bg-[#fbf8f2] text-[#2d211a] hover:-translate-y-0.5 hover:border-[#d4b98c] hover:bg-[#fffaf2]'
                    }`}
                  >
                    <span
                      className={`mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.95rem] font-heading uppercase tracking-[0.18em] transition-colors duration-300 sm:h-11 sm:w-11 ${
                        activeSlug === category.slug
                          ? 'border-white/70 bg-white/20 text-white'
                          : 'border-[#e0d6c5] bg-white text-[#b8945b]'
                      }`}
                      aria-hidden="true"
                    >
                      <CategoryBadgeIcon slug={category.slug} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-modern text-[0.82rem] uppercase tracking-[0.16em] sm:text-[0.88rem]">
                        {category.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </FadeInUp>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
              >
                {visibleCards.map((card) => (
                  <article
                    key={card.id}
                    className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(44,44,44,0.1)] border border-sand/70"
                  >
                    <div className="rounded-[30px] bg-[#f8f3ea] p-4">
                      {card.image ? (
                        <div className="aspect-[768/1600] w-full overflow-hidden rounded-[22px] bg-[#f6efdf] shadow-[0_18px_40px_rgba(44,44,44,0.14)]">
                          <img
                            src={card.image}
                            alt={card.category?.name || 'Package card'}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[768/1600] w-full rounded-[22px] bg-white border border-sand flex items-center justify-center text-muted font-body">
                          No card image
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>

            {displayedCards.length > 3 ? (
              <FadeInUp delay={0.15}>
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setShowAll((value) => !value)}
                    className="px-8 py-3 rounded-full font-ui text-sm uppercase tracking-[0.18em] bg-accent text-white hover:bg-accent/80 transition-colors"
                  >
                    {showAll ? 'Show Less Cards' : 'View All Cards'}
                  </button>
                </div>
              </FadeInUp>
            ) : null}
          </>
        ) : (
          <FadeInUp delay={0.1}>
            <div className="rounded-3xl border border-sand bg-beige/60 px-6 py-12 text-center">
              <p className="font-times-italic text-2xl leading-none tracking-[-0.02em] text-text">Packages Coming Soon</p>
              <p className="font-cormorant-medium mt-2 text-[1.18rem] leading-7 text-[#72665b] sm:text-[1.24rem]">Add package cards from the admin panel to show them here.</p>
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  )
}
