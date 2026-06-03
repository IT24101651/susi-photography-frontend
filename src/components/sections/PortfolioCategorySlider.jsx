import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { getCardCaption } from '../../utils/cardOverlay'
import TitleWithHeartDivider from '../ui/TitleWithHeartDivider'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function PortfolioCategorySlider({
  category,
  photos,
  title,
  subtitle,
  eyebrow = '',
  viewAllTo,
  detailSuffix = '',
  sliderKey,
  sectionId,
}) {
  const sliderId = sliderKey || category.slug
  const navPrevClass = `portfolio-prev-${sliderId}`
  const navNextClass = `portfolio-next-${sliderId}`
  const paginationClass = `portfolio-pagination-${sliderId}`
  const heading = title || category.title
  const supportingText = subtitle || category.subtitle
  const viewAllHref = viewAllTo || category.route
  const cardOverlayCtaClass =
    'inline-flex items-center gap-3 self-start rounded-none border-t border-white/22 pt-3 font-ui text-[0.82rem] font-medium uppercase tracking-[0.4em] text-[#d7d3cf] drop-shadow-[0_2px_10px_rgba(0,0,0,0.48)] sm:text-[0.88rem]'

  return (
    <>
      <section
        id={sectionId}
        className="rounded-[34px] border border-[#d9c7a6] bg-[#fffaf2] p-5 shadow-[0_24px_80px_rgba(71,52,31,0.08)] sm:p-7 lg:p-8"
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="font-body text-xs uppercase tracking-[0.34em] text-[#b8945b]">{eyebrow}</p>
            ) : null}
            <h3 className="mt-3 font-times-italic text-[2.2rem] leading-[0.95] tracking-[-0.02em] text-[#2d211a] sm:text-[2.9rem]">{heading}</h3>
            <p className="mt-3 max-w-xl font-cormorant-medium text-[1.26rem] leading-7 tracking-[0.018em] text-[#7f7265] sm:text-[1.34rem]">{supportingText}</p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              className={`${navPrevClass} inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d7c3a0] bg-white/92 text-[#6f5743] shadow-[0_16px_36px_rgba(86,66,42,0.11)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8945b] hover:text-[#b8945b]`}
              aria-label={`Previous ${heading} slides`}
            >
              &larr;
            </button>
            <button
              type="button"
              className={`${navNextClass} inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d7c3a0] bg-white/92 text-[#6f5743] shadow-[0_16px_36px_rgba(86,66,42,0.11)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8945b] hover:text-[#b8945b]`}
              aria-label={`Next ${heading} slides`}
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px]">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            speed={1200}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            rewind={photos.length > 1}
            navigation={{ prevEl: `.${navPrevClass}`, nextEl: `.${navNextClass}` }}
            pagination={{ clickable: true, el: `.${paginationClass}` }}
            watchSlidesProgress
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 22 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="portfolio-category-swiper overflow-hidden"
          >
            {photos.map((photo, photoIndex) => (
              <SwiperSlide key={`${category.slug}-${photo.id}-${photoIndex}`}>
                <Link to={`${category.route}/${photo.id}${detailSuffix}`} className="block">
                  <motion.article
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="group cursor-pointer overflow-hidden rounded-[18px] border border-[#e3d3b7]/80 bg-[#f7efe3] shadow-[0_28px_60px_rgba(73,53,30,0.14)]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#eadcc7]">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 opacity-80" />
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,4,0.86)_0%,rgba(8,6,4,0.62)_22%,rgba(8,6,4,0.18)_50%,rgba(8,6,4,0)_78%)] opacity-80 transition-opacity duration-[1200ms] group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-[1200ms] group-hover:bg-black/12" />
                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#5c4632] shadow-sm">
                        {photo.gallery_images?.length ? `${photo.gallery_images.length + 1} Photos` : 'Main Photo'}
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white sm:p-6 lg:p-7">
                        <div className="max-w-[42%] pt-10 sm:pt-12">
                          <p className="max-w-[6ch] font-luxury-italic text-[2.25rem] leading-[0.88] tracking-[-0.035em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)] sm:text-[2.9rem] lg:text-[3.35rem]">
                            <TitleWithHeartDivider
                              title={photo.title}
                              heartClassName="h-[1.34em] w-[0.94em] -translate-y-[0.08em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.38)]"
                            />
                          </p>
                          <p className="mt-4 max-w-[14ch] border-t border-white/35 pt-4 font-cormorant-italic text-[0.98rem] leading-[1.25] tracking-[0.02em] text-white/86 drop-shadow-[0_2px_6px_rgba(0,0,0,0.32)] sm:text-[1.03rem]">
                            {getCardCaption({ categorySlug: category.slug, categoryName: heading, photo })}
                          </p>
                        </div>
                        <p className={cardOverlayCtaClass}>Click to open gallery</p>
                      </div>
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/15"
                        initial={false}
                      />
                    </div>
                  </motion.article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`${paginationClass} flex min-h-6 items-center gap-2 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:bg-[#ccb38a] [&_.swiper-pagination-bullet]:opacity-40 [&_.swiper-pagination-bullet-active]:!w-7 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:!bg-[#b8945b] [&_.swiper-pagination-bullet-active]:opacity-100`} />
          <Link
            to={viewAllHref}
            className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#c9ab74] bg-gradient-to-r from-[#f6ead3] via-[#edd3a4] to-[#d8ae62] px-6 py-3 font-body text-sm uppercase tracking-[0.16em] text-[#3b2815] shadow-[0_18px_34px_rgba(184,148,91,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8945b] hover:from-[#f9eed9] hover:via-[#f0d8ab] hover:to-[#c99847] hover:shadow-[0_22px_38px_rgba(184,148,91,0.3)]"
          >
            View All
            <span aria-hidden="true" className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </section>

    </>
  )
}
