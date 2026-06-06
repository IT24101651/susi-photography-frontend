import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCategories, usePortfolioAll } from '../hooks/usePublicData'
import PortfolioCategorySlider from '../components/sections/PortfolioCategorySlider'
import { getCardCaption } from '../utils/cardOverlay'
import TitleWithHeartDivider from '../components/ui/TitleWithHeartDivider'
import TitleWithAmpersand from '../components/ui/TitleWithAmpersand'
import {
  buildPortfolioCategories,
  getCategoryPhotoCollection,
  groupPubertyPhotos,
  groupGalleryImagesByPhase,
  groupWeddingPhotos,
  PUBERTY_TYPE_CONFIGS,
  WEDDING_TYPE_CONFIGS,
} from '../data/portfolioCategories'
import Lightbox from '../components/ui/Lightbox'

function LoadingCircle() {
  return (
    <motion.div
      aria-hidden="true"
      className="h-10 w-10 rounded-full bg-[#b8945b] shadow-[0_6px_14px_rgba(184,148,91,0.18)]"
      animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.72, 0.95, 0.72] }}
      transition={{ duration: 2.15, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function PortfolioCategoryPage() {
  const navigate = useNavigate()
  const { categorySlug, photoId } = useParams()
  const [searchParams] = useSearchParams()
  const { data: apiCategories = [], isLoading: isCategoriesLoading } = useCategories()
  const { data: allPhotos = [], isLoading: isPhotosLoading } = usePortfolioAll()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxPhotos, setLightboxPhotos] = useState([])
  const [isDetailImagesReady, setIsDetailImagesReady] = useState(!photoId)
  const categories = useMemo(() => buildPortfolioCategories(apiCategories), [apiCategories])
  const category = useMemo(
    () => categories.find((item) => item.slug === categorySlug) ?? null,
    [categories, categorySlug],
  )

  const photos = useMemo(() => {
    if (!category) return []
    return getCategoryPhotoCollection(allPhotos, category)
  }, [allPhotos, category])
  const activeType = searchParams.get('type') || ''
  const isWeddingCategory = category?.slug === 'wedding'
  const isPubertyCategory = category?.slug === 'puberty-ceremony'
  const weddingSections = useMemo(
    () => (isWeddingCategory ? groupWeddingPhotos(photos).filter((section) => section.photos.length > 0) : []),
    [isWeddingCategory, photos],
  )
  const pubertySections = useMemo(
    () => (isPubertyCategory ? groupPubertyPhotos(photos) : []),
    [isPubertyCategory, photos],
  )
  const pubertySectionOrder = useMemo(
    () => new Map([
      ['the_celebration', 0],
      ['before_the_blessing', 1],
      ['after_glow_portraits', 2],
    ]),
    [],
  )
  const pubertySectionsOrdered = useMemo(
    () =>
      [...pubertySections].sort(
        (left, right) =>
          (pubertySectionOrder.get(left.value) ?? 99) - (pubertySectionOrder.get(right.value) ?? 99),
      ),
    [pubertySectionOrder, pubertySections],
  )
  const activeWeddingSection = useMemo(
    () => weddingSections.find((section) => section.value === activeType) ?? null,
    [activeType, weddingSections],
  )
  const activePubertySection = useMemo(
    () => pubertySections.find((section) => section.value === activeType) ?? null,
    [activeType, pubertySections],
  )
  const visiblePhotos = useMemo(() => {
    if (!activeType) return photos
    if (isWeddingCategory) return activeWeddingSection?.photos ?? []
    if (isPubertyCategory) return activePubertySection?.photos ?? []
    return photos
  }, [activePubertySection, activeType, activeWeddingSection, isPubertyCategory, isWeddingCategory, photos])
  const currentDetailSuffix = activeType ? `?type=${activeType}` : ''

  const selectedPhoto = photoId ? photos.find((photo) => String(photo.id) === photoId) ?? null : null
  const activeGalleryItems = selectedPhoto
    ? [
        selectedPhoto,
        ...(selectedPhoto.gallery_images || []).map((image) => ({
          ...image,
          category: selectedPhoto.category,
          is_gallery_image: true,
          subtitle: selectedPhoto.subtitle,
          wedding_type: selectedPhoto.wedding_type,
          shoot_phase: selectedPhoto.shoot_phase,
        })),
      ]
    : []
  const activeWeddingTypeMeta = WEDDING_TYPE_CONFIGS.find((section) => section.value === activeType) ?? null
  const activePubertyTypeMeta = PUBERTY_TYPE_CONFIGS.find((section) => section.value === activeType) ?? null
  const isHyphenTitleCategory = category?.slug === 'wedding' || category?.slug === 'engagement'
  const cardOverlayCtaClass =
    'inline-flex items-center gap-3 self-start rounded-none border-t border-white/22 pt-3 font-ui text-[0.8rem] font-medium uppercase tracking-[0.4em] text-[#d7d3cf] drop-shadow-[0_2px_10px_rgba(0,0,0,0.48)] sm:text-[0.86rem]'
  const galleryPhaseSections = useMemo(
    () => groupGalleryImagesByPhase(selectedPhoto?.gallery_images || []).filter((section) => section.images.length > 0),
    [selectedPhoto],
  )
  const usePhasedWeddingGallery = Boolean(photoId && isWeddingCategory && galleryPhaseSections.length)
  const activeTitle = photoId
    ? selectedPhoto?.title
    : activeWeddingTypeMeta?.title || activePubertyTypeMeta?.title || category.title
  const displayActiveTitle = photoId && isHyphenTitleCategory && activeTitle
    ? String(activeTitle).replace(/\s*&\s*/g, '-')
    : activeTitle
  const detailImageSources = useMemo(() => {
    if (!photoId || !selectedPhoto) return []
    if (usePhasedWeddingGallery) {
      return galleryPhaseSections.flatMap((section) => section.images.map((image) => image.image)).filter(Boolean)
    }
    return activeGalleryItems.map((image) => image.image).filter(Boolean)
  }, [activeGalleryItems, galleryPhaseSections, photoId, selectedPhoto, usePhasedWeddingGallery])

  useEffect(() => {
    if (!photoId) {
      setIsDetailImagesReady(true)
      return undefined
    }

    if (!selectedPhoto) {
      setIsDetailImagesReady(false)
      return undefined
    }

    if (!detailImageSources.length) {
      setIsDetailImagesReady(true)
      return undefined
    }

    let cancelled = false
    let loadedCount = 0
    setIsDetailImagesReady(false)

    const markLoaded = () => {
      loadedCount += 1
      if (!cancelled && loadedCount >= detailImageSources.length) {
        setIsDetailImagesReady(true)
      }
    }

    detailImageSources.forEach((src) => {
      const image = new Image()
      image.onload = markLoaded
      image.onerror = markLoaded
      image.src = src

      if (image.complete) {
        markLoaded()
      }
    })

    return () => {
      cancelled = true
    }
  }, [detailImageSources, photoId, selectedPhoto])

  const openLightbox = (galleryItems, index) => {
    setLightboxPhotos(galleryItems)
    setLightboxIndex(index)
  }

  if (isCategoriesLoading && !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f0e6] px-6 py-24">
        <LoadingCircle />
      </div>
    )
  }

  if (!isCategoriesLoading && !category) {
    return (
      <div className="min-h-screen bg-[#f7f0e6] px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#decdaa] bg-white p-10 text-center shadow-[0_24px_60px_rgba(75,55,31,0.08)]">
          <h1 className="font-heading text-4xl text-[#2d211a]">Portfolio Not Found</h1>
          <p className="mt-4 font-body text-[#786453]">This portfolio category is not available right now.</p>
          <Link
            to="/"
            replace
            className="mt-8 inline-flex rounded-full bg-[#b8945b] px-6 py-3 font-body text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#a88348]"
          >
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  if (!isPhotosLoading && photoId && !selectedPhoto) {
    return (
      <div className="min-h-screen bg-[#f7f0e6] px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#decdaa] bg-white p-10 text-center shadow-[0_24px_60px_rgba(75,55,31,0.08)]">
          <h1 className="font-heading text-4xl text-[#2d211a]">Gallery Not Found</h1>
          <p className="mt-4 font-body text-[#786453]">This main portfolio photo is not available right now.</p>
          <Link
            to={activeType ? `${category.route}?type=${activeType}` : category.route}
            replace
            className="mt-8 inline-flex rounded-full bg-[#b8945b] px-6 py-3 font-body text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#a88348]"
          >
            Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f0e6]">
      <div className="fixed left-0 right-0 top-0 z-20 border-b border-[#d8c4a4] bg-[rgba(234,220,199,0.98)] shadow-[0_12px_34px_rgba(77,58,32,0.08)] backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => {
              if (photoId) {
                navigate(activeType ? `${category.route}?type=${activeType}` : category.route, { replace: true })
                return
              }
              navigate(`/#portfolio-${categorySlug}`, { replace: true })
            }}
            className="inline-flex items-center rounded-full border border-[#d8c6ab] bg-white px-4 py-2 font-body text-xs uppercase tracking-[0.18em] text-[#745d47] shadow-[0_10px_26px_rgba(75,55,31,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8945b] hover:text-[#b8945b] hover:shadow-[0_14px_30px_rgba(184,148,91,0.14)] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Back
          </button>
          <p className="font-heading text-[1.45rem] leading-none tracking-[-0.015em] text-[#2d211a]">
            <TitleWithAmpersand title={category.title} />
          </p>
          <button
            type="button"
            onClick={() => navigate('/#portfolio', { replace: true })}
            className="inline-flex items-center rounded-full border border-[#d8c6ab] bg-white px-4 py-2 font-body text-xs uppercase tracking-[0.18em] text-[#745d47] shadow-[0_10px_26px_rgba(75,55,31,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8945b] hover:text-[#b8945b] hover:shadow-[0_14px_30px_rgba(184,148,91,0.14)] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Home
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-[6.8rem] sm:pb-16 sm:pt-[7.3rem] lg:pb-20 lg:pt-[7.8rem]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-10"
        >
          <p className="font-body text-xs uppercase tracking-[0.34em] text-[#b8945b]">
            {photoId ? 'Gallery Story' : 'Curated Collection'}
          </p>
          <h1 className="mt-3 font-heading text-[2.45rem] leading-[0.98] tracking-[-0.025em] text-[#2d211a] sm:text-[3.8rem]">
            {displayActiveTitle}
          </h1>
          <p className="mt-4 max-w-3xl font-source-serif text-[1.26rem] leading-8 tracking-[0.01em] text-[#7f7265] sm:text-[1.36rem]">
            {photoId
              ? (selectedPhoto?.description?.trim() || 'Explore the full gallery for this main portfolio story.')
              : activeWeddingTypeMeta?.subtitle || activePubertyTypeMeta?.subtitle || category.subtitle}
          </p>
        </motion.div>

        {!photoId && (
          isWeddingCategory && !activeType ? (
            photos.length ? (
              <div className="space-y-10">
                {weddingSections.map((section, index) => (
                  section.photos.length ? (
                    <motion.div
                      key={section.value}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.18) }}
                      className="space-y-6"
                    >
                      <div className="max-w-2xl">
                        <p className="font-body text-xs uppercase tracking-[0.34em] text-[#b8945b]">Wedding Story</p>
                        <h3 className="mt-3 font-heading text-[2.1rem] leading-[0.95] tracking-[-0.02em] text-[#2d211a] sm:text-[2.85rem]">
                          <TitleWithAmpersand title={section.title} />
                        </h3>
                        {section.subtitle ? (
                          <p className="mt-3 max-w-xl font-source-serif text-[1.18rem] leading-7 tracking-[0.01em] text-[#7f7265] sm:text-[1.24rem]">
                            {section.subtitle}
                          </p>
                        ) : null}
                      </div>

                      <div className="columns-1 gap-5 space-y-5 sm:columns-2 xl:columns-3">
                        {section.photos.map((photo, photoIndex) => (
                          <motion.article
                            key={`${section.value}-${photo.id}-${photoIndex}`}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: Math.min(photoIndex * 0.05, 0.18) }}
                            className="group mb-5 break-inside-avoid overflow-hidden rounded-[18px]"
                          >
                            <Link to={`${category.route}/${photo.id}?type=${section.value}`} className="block">
                              <img
                                src={photo.image}
                                alt={photo.title}
                                loading="lazy"
                                decoding="async"
                                className="h-auto w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                              />
                            </Link>
                          </motion.article>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.section
                      key={section.value}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.18) }}
                      className="rounded-[34px] border border-[#d9c7a6] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(71,52,31,0.08)]"
                    >
                      <p className="font-body text-xs uppercase tracking-[0.34em] text-[#b8945b]">Wedding Collection</p>
                      <h3 className="mt-3 font-heading text-[2.1rem] leading-[0.95] tracking-[-0.02em] text-[#2d211a] sm:text-[2.85rem]">
                        <TitleWithAmpersand title={section.title} />
                      </h3>
                      <p className="mt-3 max-w-xl font-source-serif text-[1.18rem] leading-7 tracking-[0.01em] text-[#7f7265] sm:text-[1.24rem]">{section.subtitle}</p>
                      <div className="mt-6 rounded-[24px] border border-dashed border-[#d9c7a6] bg-white/70 px-6 py-10 text-center">
                        <p className="font-body text-sm uppercase tracking-[0.18em] text-[#745d47]">No photos added yet for this section.</p>
                      </div>
                    </motion.section>
                  )
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-[#ddceb2] bg-white px-8 py-14 text-center shadow-[0_22px_55px_rgba(75,55,31,0.09)]">
                <p className="font-heading text-3xl text-[#2d211a]">No Photos Yet</p>
              <p className="mt-4 font-source-serif text-[1.18rem] leading-8 tracking-[0.01em] text-[#7f7265]">This active collection does not have any portfolio photos yet.</p>
              </div>
            )
          ) : isPubertyCategory && !activeType ? (
            photos.length ? (
              <div className="space-y-10">
                {pubertySectionsOrdered.map((section, index) => (
                  section.photos.length ? (
                    <motion.div
                      key={section.value}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.18) }}
                    >
                      <PortfolioCategorySlider
                        category={category}
                        photos={section.photos}
                        title={section.title}
                        subtitle={section.subtitle}
                        eyebrow="Puberty Ceremony"
                        detailSuffix={`?type=${section.value}`}
                        sliderKey={`puberty-${section.value}`}
                        showAllCards
                      />
                    </motion.div>
                  ) : (
                    <motion.section
                      key={section.value}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.18) }}
                      className="rounded-[34px] border border-[#d9c7a6] bg-[#fffaf2] p-8 shadow-[0_24px_80px_rgba(71,52,31,0.08)]"
                    >
                      <p className="font-body text-xs uppercase tracking-[0.34em] text-[#b8945b]">Puberty Ceremony</p>
                      <h3 className="mt-3 font-heading text-[2.1rem] leading-[0.95] tracking-[-0.02em] text-[#2d211a] sm:text-[2.85rem]">
                        <TitleWithAmpersand title={section.title} />
                      </h3>
                      <p className="mt-3 max-w-xl font-source-serif text-[1.18rem] leading-7 tracking-[0.01em] text-[#7f7265] sm:text-[1.24rem]">{section.subtitle}</p>
                      <div className="mt-6 rounded-[24px] border border-dashed border-[#d9c7a6] bg-white/70 px-6 py-10 text-center">
                        <p className="font-body text-sm uppercase tracking-[0.18em] text-[#745d47]">No photos added yet for this section.</p>
                      </div>
                    </motion.section>
                  )
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-[#ddceb2] bg-white px-8 py-14 text-center shadow-[0_22px_55px_rgba(75,55,31,0.09)]">
                <p className="font-heading text-3xl text-[#2d211a]">No Photos Yet</p>
                <p className="mt-4 font-source-serif text-[1.18rem] leading-8 tracking-[0.01em] text-[#7f7265]">This active collection does not have any portfolio photos yet.</p>
              </div>
            )
          ) : isPhotosLoading ? (
            <div className="flex min-h-[44vh] items-center justify-center py-8 sm:min-h-[50vh]">
              <LoadingCircle />
            </div>
          ) : visiblePhotos.length ? (
            <>
              <div className="columns-1 gap-5 space-y-5 sm:columns-2 xl:columns-3">
                {visiblePhotos.map((photo, index) => (
                <motion.article
                  key={`${photo.id}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
                  className="group mb-5 break-inside-avoid overflow-hidden rounded-[16px] border border-[#ddceb2] bg-white shadow-[0_22px_55px_rgba(75,55,31,0.09)]"
                >
                  <Link to={`${category.route}/${photo.id}${currentDetailSuffix}`} className="block">
                    <div className="relative overflow-hidden rounded-[16px] bg-[#f3e6d1]">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="h-auto w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                      />
                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#5c4632] shadow-sm">
                        {photo.gallery_images?.length ? `${photo.gallery_images.length + 1} Photos` : 'Main Photo'}
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,4,0.86)_0%,rgba(8,6,4,0.62)_22%,rgba(8,6,4,0.18)_50%,rgba(8,6,4,0)_78%)] opacity-80" />
                      <div className="absolute inset-0 bg-black/12" />
                      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white sm:p-6">
                        <div className="max-w-[42%] pt-10 sm:pt-12">
                          <p className="max-w-[6ch] font-luxury-italic text-[2.05rem] leading-[0.88] tracking-[-0.035em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)] sm:text-[2.55rem] lg:text-[2.9rem]">
                            <TitleWithHeartDivider
                              title={photo.title}
                              heartClassName="h-[1.34em] w-[0.94em] -translate-y-[0.08em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)]"
                            />
                          </p>
                          <p className="mt-4 max-w-[14ch] border-t border-white/35 pt-4 font-cormorant-italic text-[0.98rem] leading-[1.25] tracking-[0.02em] text-white/86 drop-shadow-[0_2px_6px_rgba(0,0,0,0.32)] sm:text-[1.03rem]">
                            {getCardCaption({ categorySlug: category.slug, categoryName: category.title, photo })}
                          </p>
                        </div>
                        <p className={cardOverlayCtaClass}>Click to open gallery</p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
            </>
          ) : (
            <div className="rounded-[28px] border border-[#ddceb2] bg-white px-8 py-14 text-center shadow-[0_22px_55px_rgba(75,55,31,0.09)]">
              <p className="font-heading text-3xl text-[#2d211a]">No Photos Yet</p>
              <p className="mt-4 font-source-serif text-[1.18rem] leading-8 tracking-[0.01em] text-[#7f7265]">
                {activeWeddingTypeMeta
                  ? `This ${activeWeddingTypeMeta.title.toLowerCase()} collection does not have any photos yet.`
                  : 'This active collection does not have any portfolio photos yet.'}
              </p>
            </div>
          )
        )}

        {photoId && (!isDetailImagesReady || isPhotosLoading) ? (
          <div className="mt-12 flex min-h-[44vh] items-center justify-center py-8 sm:min-h-[50vh]">
            <LoadingCircle />
          </div>
        ) : photoId && usePhasedWeddingGallery && (
          <div className="mt-12 space-y-12">
            {galleryPhaseSections.map((section, sectionIndex) => {
              const previewImages = section.images

              return (
                <motion.section
                  key={section.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(sectionIndex * 0.08, 0.18), ease: 'easeOut' }}
                  className="space-y-5"
                >
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.28em] text-[#b8945b]">Wedding Story</p>
                    <h2 className="mt-3 font-heading text-[2rem] leading-[0.95] tracking-[-0.02em] text-[#2d211a] sm:text-[2.65rem]">
                      <TitleWithAmpersand title={section.title} />
                    </h2>
                  </div>

                  <div className="columns-1 sm:columns-2 xl:columns-3">
                    {previewImages.map((image, index) => (
                      <motion.article
                        key={`${section.value}-${image.id}-${index}`}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.18) }}
                        className="group mb-5 cursor-pointer break-inside-avoid overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(75,55,31,0.08)]"
                        onClick={() => openLightbox(section.images, section.images.findIndex((item) => item.id === image.id))}
                      >
                        <div className="relative overflow-hidden rounded-[16px] bg-[#f3e6d1]">
                          <img
                            src={image.image}
                            alt={image.title}
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-full object-contain object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#130d09]/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                      </motion.article>
                    ))}
                  </div>

                </motion.section>
              )
            })}
          </div>
        )}

        {photoId && isDetailImagesReady && !usePhasedWeddingGallery && activeGalleryItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-12"
          >
            <div className="columns-1 sm:columns-2 xl:columns-3">
              {activeGalleryItems.map((image, index) => (
                <motion.article
                  key={`${image.id}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
                  className="group mb-5 cursor-pointer break-inside-avoid overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(75,55,31,0.08)]"
                  onClick={() => openLightbox(activeGalleryItems, index)}
                >
                  <div className="relative overflow-hidden rounded-[16px] bg-[#f3e6d1]">
                    <img
                      src={image.image}
                      alt={image.title}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full object-contain object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#130d09]/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <Lightbox
        images={lightboxPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((current) => (current - 1 + lightboxPhotos.length) % lightboxPhotos.length)}
        onNext={() => setLightboxIndex((current) => (current + 1) % lightboxPhotos.length)}
      />
    </div>
  )
}
