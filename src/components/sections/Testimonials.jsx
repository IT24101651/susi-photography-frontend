import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules'
import { useTestimonials } from '../../hooks/usePublicData'
import FadeInUp from '../ui/FadeInUp'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const SAMPLE_TESTIMONIALS = [
  {
    id: 'sample-1',
    client_name: 'Kavin & Nirosha',
    event_type: 'Wedding Photography',
    quote:
      'Susi Studio captured every emotional moment beautifully. The photos are absolutely stunning and unforgettable.',
    rating: 5,
    client_photo: null,
  },
  {
    id: 'sample-2',
    client_name: 'Tharushi',
    event_type: 'Birthday Shoot',
    quote:
      'Professional service, creative photography, and amazing editing quality. Highly recommended!',
    rating: 5,
    client_photo: null,
  },
  {
    id: 'sample-3',
    client_name: 'Akilan & Pooja',
    event_type: 'Pre Wedding Shoot',
    quote:
      'Our pre-shoot experience was fantastic. The team made us feel comfortable and the pictures came out perfect.',
    rating: 5,
    client_photo: null,
  },
]

function StarIcon({ active = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${active ? 'fill-[#d4af37] text-[#d4af37]' : 'fill-transparent text-[#d4af37]/25'}`}
    >
      <path
        stroke="currentColor"
        strokeWidth="1.15"
        d="m12 3.55 2.66 5.4 5.96.87-4.31 4.2 1.02 5.92L12 17.12l-5.33 2.82 1.02-5.92-4.31-4.2 5.96-.87L12 3.55Z"
      />
    </svg>
  )
}

function QuoteIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M9.36 6.35c-1.95.76-4.2 2.83-4.2 6.3 0 2.85 1.82 4.98 4.63 4.98 2.17 0 3.87-1.57 3.87-3.78 0-2.15-1.39-3.51-3.34-3.7.28-1.2 1.24-2.28 2.73-2.98l-3.69-.82Zm8.62 0c-1.95.76-4.2 2.83-4.2 6.3 0 2.85 1.82 4.98 4.63 4.98 2.17 0 3.87-1.57 3.87-3.78 0-2.15-1.39-3.51-3.34-3.7.28-1.2 1.24-2.28 2.73-2.98l-3.69-.82Z"
      />
    </svg>
  )
}

function ClientAvatar({ item }) {
  if (item.client_photo) {
    return (
      <img
        src={item.client_photo}
        alt={item.client_name}
        className="h-14 w-14 rounded-full object-cover shadow-[0_14px_28px_rgba(30,30,30,0.10)] sm:h-16 sm:w-16"
      />
    )
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f1f] font-heading text-lg text-white shadow-[0_14px_28px_rgba(30,30,30,0.10)] sm:h-16 sm:w-16">
      {item.client_name?.[0] ?? 'S'}
    </div>
  )
}

function TestimonialCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.42, ease: 'easeOut', delay: Math.min(index * 0.08, 0.2) }}
      className="group h-full rounded-[28px] border border-[#ece7df] bg-white p-6 shadow-[0_20px_55px_rgba(25,25,25,0.08)] transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(25,25,25,0.14)] sm:p-7"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ClientAvatar item={item} />
            <div>
              <p className="font-luxury text-[1.45rem] leading-none tracking-[-0.02em] text-[#161616] sm:text-[1.6rem]">
                {item.client_name}
              </p>
              <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.22em] text-[#8a8a8a]">
                {item.event_type || item.event || 'Photography Session'}
              </p>
            </div>
          </div>
          <QuoteIcon className="h-9 w-9 flex-none text-[#d4af37] sm:h-10 sm:w-10" />
        </div>

        <div className="mt-6 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, starIndex) => (
            <StarIcon key={starIndex} active={starIndex < (item.rating ?? 5)} />
          ))}
        </div>

        <p className="mt-6 flex-1 font-cormorant-medium text-[1.18rem] leading-8 tracking-[0.01em] text-[#4f4f4f] sm:text-[1.26rem] sm:leading-9">
          {item.quote}
        </p>
      </div>
    </motion.article>
  )
}

export function TestimonialsSection() {
  const { data: apiItems = [] } = useTestimonials()
  const items = apiItems.length ? apiItems : SAMPLE_TESTIMONIALS
  const navPrevClass = 'testimonials-prev'
  const navNextClass = 'testimonials-next'
  const paginationClass = 'testimonials-pagination'

  return (
    <section id="testimonials" className="bg-[#f6f4f1] py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <p className="font-editorial text-[0.78rem] font-semibold uppercase tracking-[0.36em] text-[#6f5743] [font-variant:small-caps] sm:text-[0.82rem]">
            Client Testimonials
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-times-italic text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-[#161616] sm:text-[3.75rem]">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-cormorant-medium text-[1.26rem] leading-8 tracking-[0.018em] text-[#72665b] sm:text-[1.34rem] sm:leading-9">
            Real moments. Real memories. Real feedback from our happy clients.
          </p>
        </FadeInUp>

        <div className="mt-14 sm:mt-16">
          <div className="mb-8 flex items-center justify-center gap-4 lg:mb-10">
            <button
              type="button"
              className={`${navPrevClass} inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e4ddd2] bg-white text-[#1a1a1a] shadow-[0_14px_34px_rgba(25,25,25,0.08)] transition-all duration-300 hover:-translate-x-1 hover:border-[#d4af37] hover:text-[#d4af37] hover:shadow-[0_18px_42px_rgba(212,175,55,0.16)] sm:h-14 sm:w-14`}
              aria-label="Previous testimonial"
            >
              <span className="text-xl leading-none">&larr;</span>
            </button>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d6cec1] to-transparent sm:w-28" />
            <button
              type="button"
              className={`${navNextClass} inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e4ddd2] bg-white text-[#1a1a1a] shadow-[0_14px_34px_rgba(25,25,25,0.08)] transition-all duration-300 hover:translate-x-1 hover:border-[#d4af37] hover:text-[#d4af37] hover:shadow-[0_18px_42px_rgba(212,175,55,0.16)] sm:h-14 sm:w-14`}
              aria-label="Next testimonial"
            >
              <span className="text-xl leading-none">&rarr;</span>
            </button>
          </div>

          <Swiper
            modules={[Autoplay, Navigation, Pagination, A11y]}
            loop
            grabCursor
            speed={1000}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: `.${navPrevClass}`, nextEl: `.${navNextClass}` }}
            pagination={{ clickable: true, el: `.${paginationClass}` }}
            slidesPerView={1}
            spaceBetween={18}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 22 },
              1200: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {items.map((item, index) => (
              <SwiperSlide key={item.id} className="!h-auto pb-4">
                <TestimonialCard item={item} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className={`${paginationClass} mt-10 flex min-h-6 items-center justify-center gap-2 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:bg-[#d7cfc3] [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:!w-8 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:!bg-[#d4af37]`}
          />
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
