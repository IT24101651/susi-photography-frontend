export const PORTFOLIO_CATEGORY_CONFIGS = [
  {
    slug: 'wedding',
    title: 'Wedding Photography',
    subtitle: 'Grand celebrations, intimate glances, and heirloom-worthy frames.',
    route: '/portfolio/wedding',
    aliases: ['wedding'],
    fallbackImages: [],
  },
  {
    slug: 'birthday',
    title: 'Birthday Photography',
    subtitle: 'Playful storytelling for milestone birthdays and lively family moments.',
    route: '/portfolio/birthday',
    aliases: ['birthday'],
    fallbackImages: [],
  },
  {
    slug: 'engagement',
    title: 'Engagement Photography',
    subtitle: 'Romantic sessions with cinematic light, detail, and emotion.',
    route: '/portfolio/engagement',
    aliases: ['engagement', 'reception'],
    fallbackImages: [],
  },
  {
    slug: 'portrait',
    title: 'Portrait Photography',
    subtitle: 'Editorial-inspired portraits shaped with poise, styling, and depth.',
    route: '/portfolio/portrait',
    aliases: ['portrait', 'model shot', 'model-shot'],
    fallbackImages: [],
  },
  {
    slug: 'graduation',
    title: 'Graduation Photography',
    subtitle: 'Confident portraits that celebrate achievement with polish and pride.',
    route: '/portfolio/graduation',
    aliases: ['graduation', 'outdoor'],
    fallbackImages: [],
  },
  {
    slug: 'puberty-ceremony',
    title: 'Puberty Ceremony',
    subtitle: 'Graceful storytelling for cherished family traditions, celebration, and detail.',
    route: '/portfolio/puberty-ceremony',
    aliases: ['puberty ceremony', 'puberty-ceremony', 'puberty', 'poverty'],
    fallbackImages: [],
  },
  {
    slug: 'baby-shoot',
    title: 'Newborn Baby Shoot',
    subtitle: 'Tender newborn and baby portraits filled with softness, warmth, and precious detail.',
    route: '/portfolio/baby-shoot',
    aliases: ['newborn', 'newborn shoot', 'newborn baby shoot', 'new born shoot', 'baby born shoot', 'baby shoot', 'baby-shoot', 'baby'],
    fallbackImages: [],
  },
]

export const WEDDING_TYPE_CONFIGS = [
  {
    value: 'hindu',
    title: 'Hindu Wedding',
    subtitle: 'Sacred rituals, vibrant details, and heartfelt family moments woven into every frame.',
  },
  {
    value: 'christian',
    title: 'Christian Wedding',
    subtitle: 'Elegant ceremonies, timeless portraits, and meaningful vows captured with softness and grace.',
  },
  {
    value: 'sinhala',
    title: 'Sinhala Wedding',
    subtitle: 'Rich traditions, celebratory energy, and refined storytelling for every unforgettable chapter.',
  },
]

export const PUBERTY_TYPE_CONFIGS = [
  {
    value: 'before_the_blessing',
    title: 'Mehendi Moments',
    subtitle: 'Quiet moments, preparation, and tender details before the ceremony begins.',
  },
  {
    value: 'the_celebration',
    title: 'The Celebration',
    subtitle: 'Joyful family gatherings, ceremony highlights, and the heart of the day.',
  },
  {
    value: 'after_glow_portraits',
    title: 'After Glow Portraits',
    subtitle: 'Refined portraits and soft post-ceremony frames with a warm, elegant finish.',
  },
]

export const SHOOT_PHASE_CONFIGS = [
  {
    value: 'pre_wedding',
    title: 'Bridal Portraits',
  },
  {
    value: 'wedding_day',
    title: 'Wedding Portraits',
  },
  {
    value: 'post_wedding',
    title: 'Post-Wedding Shoot',
  },
]

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-')
const DEFAULT_SUBTITLE = 'A curated collection of meaningful moments captured with warmth, elegance, and story.'
const WEDDING_PHASE_VALUES = SHOOT_PHASE_CONFIGS.map((config) => config.value)

const sortByOrderThenId = (items = []) =>
  [...items]
    .filter(Boolean)
    .sort((left, right) => {
      const leftOrder = Number.isFinite(Number(left?.order)) ? Number(left.order) : Number.MAX_SAFE_INTEGER
      const rightOrder = Number.isFinite(Number(right?.order)) ? Number(right.order) : Number.MAX_SAFE_INTEGER

      if (leftOrder !== rightOrder) return leftOrder - rightOrder

      const leftId = Number(left?.id)
      const rightId = Number(right?.id)
      if (Number.isFinite(leftId) && Number.isFinite(rightId) && leftId !== rightId) {
        return leftId - rightId
      }

      return String(left?.id ?? '').localeCompare(String(right?.id ?? ''))
    })

const resolveWeddingFallbackPhase = (index, total) => {
  if (total <= WEDDING_PHASE_VALUES.length) {
    return WEDDING_PHASE_VALUES[Math.min(index, WEDDING_PHASE_VALUES.length - 1)] || ''
  }

  const firstCut = Math.floor(total / 3)
  const secondCut = Math.floor((total * 2) / 3)

  if (index < firstCut) return 'pre_wedding'
  if (index < secondCut) return 'wedding_day'
  return 'post_wedding'
}

export const buildWeddingGalleryPhaseLookup = (images = []) => {
  const orderedImages = sortByOrderThenId(images)
  const lookup = new Map()

  orderedImages.forEach((image, index) => {
    const explicitPhase = normalize(image?.shoot_phase)
    lookup.set(image.id, explicitPhase || resolveWeddingFallbackPhase(index, orderedImages.length))
  })

  return lookup
}

export const resolveWeddingGalleryPhase = (image, images = []) => {
  if (!image) return ''

  const lookup = buildWeddingGalleryPhaseLookup(images)
  return lookup.get(image.id) || normalize(image?.shoot_phase)
}

const findCategoryConfig = (value) => {
  const normalizedValue = normalize(value)

  return PORTFOLIO_CATEGORY_CONFIGS.find((category) => {
    const aliases = new Set([category.slug, ...category.aliases].map(normalize))
    return aliases.has(normalizedValue)
  })
}

export const buildPortfolioCategory = (category) => {
  const matchedConfig = findCategoryConfig(category?.slug) || findCategoryConfig(category?.name)
  const slug = category?.slug || matchedConfig?.slug || normalize(category?.name)
  const name = category?.name || matchedConfig?.title || 'Portfolio'

  return {
    id: category?.id,
    name,
    slug,
    title: matchedConfig?.title || name,
    subtitle: matchedConfig?.subtitle || DEFAULT_SUBTITLE,
    route: `/portfolio/${slug}`,
    aliases: Array.from(new Set([slug, name, ...(matchedConfig?.aliases || [])])),
    fallbackImages: matchedConfig?.fallbackImages || [],
    is_active: category?.is_active ?? true,
  }
}

export const buildPortfolioCategories = (categories = []) =>
  categories.map(buildPortfolioCategory)

const repeatToLength = (items, length) => {
  if (!items.length) return []
  const repeated = []
  while (repeated.length < length) {
    repeated.push(...items)
  }
  return repeated.slice(0, length)
}

const buildFallbackPhotos = (config) =>
  repeatToLength(
    config.fallbackImages.map((image, index) => ({
      id: `${config.slug}-fallback-${index + 1}`,
      title: `${config.title} ${index + 1}`,
      image,
      category: { name: config.title.replace(' Photography', '') },
    })),
    6,
  )

export const getPortfolioCategoryBySlug = (slug) =>
  buildPortfolioCategory({ slug, name: findCategoryConfig(slug)?.title || slug })

export const getCategoryPhotoCollection = (photos, config) => {
  const aliases = new Set([config.slug, ...config.aliases].map(normalize))
  const matched = (photos || []).filter((photo) => {
    const photoSlug = normalize(photo.category?.slug)
    const photoName = normalize(photo.category?.name)
    return aliases.has(photoSlug) || aliases.has(photoName)
  })

  if (matched.length) {
    return matched
  }

  return buildFallbackPhotos(config)
}

export const buildCategoryPhotos = (photos, config) =>
  getCategoryPhotoCollection(photos, config).slice(0, 6)

export const groupWeddingPhotos = (photos = []) =>
  WEDDING_TYPE_CONFIGS.map((config) => ({
    ...config,
    photos: photos.filter((photo) => photo.wedding_type === config.value),
  }))

export const groupPubertyPhotos = (photos = []) =>
  PUBERTY_TYPE_CONFIGS.map((config) => ({
    ...config,
    photos: photos.filter((photo) => photo.shoot_phase === config.value),
  }))

export const groupGalleryImagesByPhase = (images = []) => {
  const lookup = buildWeddingGalleryPhaseLookup(images)
  return SHOOT_PHASE_CONFIGS.map((config) => ({
    ...config,
    images: images.filter((image) => lookup.get(image.id) === config.value),
  }))
}
