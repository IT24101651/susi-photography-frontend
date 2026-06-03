import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useCategories, usePortfolioAll } from '../../hooks/usePublicData'
import FadeInUp from '../ui/FadeInUp'
import PortfolioCategorySlider from './PortfolioCategorySlider'
import { buildCategoryPhotos, buildPortfolioCategories } from '../../data/portfolioCategories'

export default function Portfolio() {
  const { hash, pathname } = useLocation()
  const { data: apiCategories = [] } = useCategories()
  const { data: allPhotos = [] } = usePortfolioAll()
  const categorySections = useMemo(
    () => buildPortfolioCategories(apiCategories)
      .map((category) => ({
        ...category,
        photos: buildCategoryPhotos(allPhotos, category),
      }))
      .filter((category) => category.photos.length > 0),
    [allPhotos, apiCategories],
  )

  useEffect(() => {
    if (pathname !== '/' || !hash || !categorySections.length) return

    const targetId = hash.replace('#', '')
    const target = document.getElementById(targetId)
    if (!target) return

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [categorySections.length, hash, pathname])

  return (
    <section id="portfolio" className="py-24 bg-[#f7f0e6] sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <FadeInUp>
          <p className="text-center font-editorial text-[0.8rem] font-semibold uppercase tracking-[0.38em] text-[#6f5743] [font-variant:small-caps] sm:text-[0.85rem]">
            Curated Signature Work
          </p>
          <h2 className="mt-3 text-center font-times-italic text-[2.5rem] leading-[0.98] tracking-[-0.02em] text-[#2d211a] sm:text-[3.5rem]">
            Portfolio Collections
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center font-cormorant-medium text-[1.26rem] leading-8 tracking-[0.018em] text-[#7f7265] sm:text-[1.36rem]">
            Explore each story through refined category sliders designed for a modern luxury studio presentation.
          </p>
        </FadeInUp>

        <div className="mt-14 space-y-10 sm:space-y-12">
          {categorySections.map((category, index) => (
            <PortfolioCategorySlider
              key={category.slug}
              category={category}
              photos={category.photos}
              index={index}
              sectionId={`portfolio-${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
