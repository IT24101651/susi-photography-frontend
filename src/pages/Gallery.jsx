import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategories, usePortfolioAll, usePortfolioByCategory } from '../hooks/usePublicData'
import Lightbox from '../components/ui/Lightbox'
import { getCardCaption } from '../utils/cardOverlay'
import TitleWithHeartDivider from '../components/ui/TitleWithHeartDivider'

const INITIAL_BATCH_SIZE = 12
const REVEAL_BATCH_SIZE = 12
const REVEAL_DELAY_MS = 24

const flattenPortfolioPhotos = (photos) =>
  (photos || []).flatMap((photo) => [photo, ...(photo.gallery_images || []).map((image) => ({
    ...image,
    category: photo.category,
    is_gallery_image: true,
    subtitle: photo.subtitle,
    wedding_type: photo.wedding_type,
    shoot_phase: photo.shoot_phase,
  }))])

function preloadImage(src) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !src) {
      resolve()
      return
    }

    const image = new Image()
    image.decoding = 'async'

    image.onload = () => resolve()
    image.onerror = () => resolve()

    image.src = src

    if (typeof image.decode === 'function') {
      image.decode().then(resolve).catch(() => resolve())
    }
  })
}

function GalleryLoader() {
  const circles = [0, 1, 2]

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#f8f1e7]/95 px-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-7 text-center">
        <div className="relative flex h-44 w-44 items-center justify-center">
          {circles.map((index) => (
            <motion.span
              key={index}
              className="absolute rounded-full border border-[#c4a882]/30 bg-white/60 shadow-[0_16px_50px_rgba(75,55,31,0.06)]"
              style={{
                width: `${88 + index * 30}px`,
                height: `${88 + index * 30}px`,
              }}
              animate={{
                scale: [0.92, 1.08, 0.92],
                opacity: [0.38, 0.9, 0.38],
              }}
              transition={{
                duration: 1.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.16,
              }}
            />
          ))}
          <motion.span
            className="h-5 w-5 rounded-full bg-[#c4a882] shadow-[0_0_0_12px_rgba(196,168,130,0.12)]"
            animate={{ scale: [0.9, 1.15, 0.9] }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div>
          <p className="font-heading text-2xl text-[#2d211a] sm:text-[2.15rem]">Preparing Gallery</p>
          <p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#786453] sm:text-[0.95rem]">
            We are loading the first set of photos so the gallery opens smoothly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const navigate = useNavigate()
  const { data: apiCategories = [], isLoading: isCategoriesLoading } = useCategories()
  const { data: allPhotos = [], isLoading: isAllPhotosLoading } = usePortfolioAll()
  const [activeSlug, setActiveSlug] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxPhotos, setLightboxPhotos] = useState([])
  const { data: categoryPhotos = [], isLoading: isCategoryPhotosLoading } = usePortfolioByCategory(activeSlug)
  const [visibleCount, setVisibleCount] = useState(0)
  const [isPreparingGallery, setIsPreparingGallery] = useState(true)

  const categories = apiCategories

  const flatAllPhotos = useMemo(() => flattenPortfolioPhotos(allPhotos), [allPhotos])
  const flatCategoryPhotos = useMemo(() => flattenPortfolioPhotos(categoryPhotos), [categoryPhotos])
  const filtered = useMemo(
    () => (activeSlug ? flatCategoryPhotos : flatAllPhotos),
    [activeSlug, flatAllPhotos, flatCategoryPhotos],
  )
  const isGalleryDataLoading = activeSlug ? isCategoryPhotosLoading : isAllPhotosLoading
  const openLightbox = (photos, i) => { setLightboxPhotos(photos); setLightboxIndex(i) }

  useEffect(() => {
    let isCancelled = false

    const prepareGallery = async () => {
      setVisibleCount(0)

      if (isGalleryDataLoading) {
        setIsPreparingGallery(true)
        return
      }

      if (!filtered.length) {
        setIsPreparingGallery(false)
        return
      }

      setIsPreparingGallery(true)

      const initialCount = Math.min(INITIAL_BATCH_SIZE, filtered.length)

      await Promise.all(filtered.slice(0, initialCount).map((photo) => preloadImage(photo.image)))

      if (isCancelled) return

      setVisibleCount(initialCount)
      setIsPreparingGallery(false)
    }

    prepareGallery()

    return () => {
      isCancelled = true
    }
  }, [filtered, isGalleryDataLoading])

  useEffect(() => {
    if (isGalleryDataLoading || isPreparingGallery) return undefined
    if (visibleCount >= filtered.length) return undefined

    const timeoutId = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + REVEAL_BATCH_SIZE, filtered.length))
    }, visibleCount < INITIAL_BATCH_SIZE ? 0 : REVEAL_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [filtered.length, isGalleryDataLoading, isPreparingGallery, visibleCount])

  const showLoader = isCategoriesLoading || isGalleryDataLoading || (isPreparingGallery && filtered.length > 0 && visibleCount === 0)
  const visiblePhotos = filtered.slice(0, visibleCount || (showLoader ? 0 : filtered.length))

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="font-body text-sm text-muted hover:text-accent transition-colors flex items-center gap-2">
            ← Back
          </button>
          <h1 className="font-heading text-xl tracking-widest text-text">Full Gallery</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveSlug('')}
            className={`px-5 py-2 rounded-full text-sm font-body transition-colors ${
              activeSlug === '' ? 'bg-accent text-white' : 'bg-sand text-text hover:bg-accent/20'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveSlug(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-body transition-colors ${
                activeSlug === cat.slug ? 'bg-accent text-white' : 'bg-sand text-text hover:bg-accent/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          {visiblePhotos.length ? (
            <motion.div
              key={activeSlug || 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-[200px]"
            >
              {visiblePhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`cursor-pointer overflow-hidden rounded-xl group relative ${
                    i % 3 === 0 ? 'row-span-2' : 'row-span-1'
                  }`}
                  onClick={() => openLightbox(filtered, i)}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,4,0.86)_0%,rgba(8,6,4,0.62)_22%,rgba(8,6,4,0.18)_50%,rgba(8,6,4,0)_78%)] opacity-80" />
                  <div className="absolute inset-0 bg-black/12" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-white sm:p-5">
                    <div className="max-w-[42%] pt-10 sm:pt-12">
                      <p className="max-w-[6ch] font-luxury-italic text-[1.95rem] leading-[0.88] tracking-[-0.035em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)] sm:text-[2.35rem]">
                        <TitleWithHeartDivider
                          title={photo.title}
                          heartClassName="h-[1.34em] w-[0.94em] -translate-y-[0.08em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)]"
                        />
                      </p>
                      <p className="mt-4 max-w-[14ch] border-t border-white/35 pt-4 font-cormorant-italic text-[0.95rem] leading-[1.25] tracking-[0.02em] text-white/82 drop-shadow-[0_2px_6px_rgba(0,0,0,0.32)]">
                        {getCardCaption({
                          categorySlug: activeSlug,
                          categoryName: photo.category?.name ?? photo.category,
                          photo,
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : !showLoader ? (
            <motion.div
              key={activeSlug || 'all-empty'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-sand bg-white px-6 py-16 text-center shadow-sm"
            >
              <p className="font-heading text-2xl text-text">No gallery photos yet</p>
              <p className="mt-3 font-body text-sm text-muted">
                Add portfolio images from the admin panel to show them here.
              </p>
              </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <Lightbox
        images={lightboxPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(i => (i - 1 + lightboxPhotos.length) % lightboxPhotos.length)}
        onNext={() => setLightboxIndex(i => (i + 1) % lightboxPhotos.length)}
      />

      {showLoader && <GalleryLoader />}
    </div>
  )
}
