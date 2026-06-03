const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const CATEGORY_CAPTIONS = {
  wedding: 'Wedding Story',
  birthday: 'Birthday Celebration',
  engagement: 'Engagement Story',
  portrait: 'Portrait Session',
  graduation: 'Graduation Moment',
  'puberty-ceremony': 'Puberty Ceremony',
  'baby-shoot': 'Baby Story',
}

const WEDDING_TYPE_CAPTIONS = {
  hindu: 'Hindu Wedding',
  christian: 'Christian Wedding',
  sinhala: 'Sinhala Wedding',
}

const WEDDING_PHASE_CAPTIONS = {
  pre_wedding: 'Bridal Portraits',
  wedding_day: 'Wedding Portraits',
  post_wedding: 'Post-Wedding Shoot',
}

const PUBERTY_PHASE_CAPTIONS = {
  before_the_blessing: 'Before The Blessing',
  the_celebration: 'The Celebration',
  after_glow_portraits: 'After Glow Portraits',
}

export const HEART_DIVIDER_TOKEN = '__HEART_DIVIDER__'

export function formatCardTitleLines(title) {
  const cleanTitle = String(title || '').trim()
  if (!cleanTitle) return []

  const ampersandMatch = cleanTitle.match(/^(.+?)\s*&\s*(.+)$/)
  if (ampersandMatch) {
    return [ampersandMatch[1].trim(), HEART_DIVIDER_TOKEN, ampersandMatch[2].trim()]
  }

  const andMatch = cleanTitle.match(/^(.+?)\s+and\s+(.+)$/i)
  if (andMatch) {
    return [andMatch[1].trim(), HEART_DIVIDER_TOKEN, andMatch[2].trim()]
  }

  const slashParts = cleanTitle.split(/\s*\/\s*/).filter(Boolean)
  if (slashParts.length > 1) {
    return slashParts
  }

  const words = cleanTitle.split(/\s+/)
  if (words.length === 2) {
    return words
  }

  if (words.length === 3 && words[1].length <= 2) {
    return [words[0], `${words[1]} ${words[2]}`]
  }

  return [cleanTitle]
}

export function getCardCaption({
  categorySlug,
  categoryName,
  photo,
}) {
  const normalizedSlug = normalize(categorySlug || photo?.category?.slug || photo?.category?.name)
  const isGalleryImage = Boolean(photo?.is_gallery_image || photo?.parent)

  if (isGalleryImage) {
    if (normalizedSlug === 'wedding') {
      return WEDDING_PHASE_CAPTIONS[normalize(photo?.shoot_phase)]
        || WEDDING_TYPE_CAPTIONS[normalize(photo?.wedding_type)]
        || CATEGORY_CAPTIONS.wedding
    }

    if (normalizedSlug === 'puberty-ceremony') {
      return PUBERTY_PHASE_CAPTIONS[normalize(photo?.shoot_phase)] || CATEGORY_CAPTIONS['puberty-ceremony']
    }
  }

  const subtitle = String(photo?.subtitle || '').trim()
  if (subtitle) {
    return subtitle
  }

  if (normalizedSlug === 'wedding') {
    return WEDDING_TYPE_CAPTIONS[normalize(photo?.wedding_type)] || CATEGORY_CAPTIONS.wedding
  }

  if (normalizedSlug === 'puberty-ceremony') {
    return PUBERTY_PHASE_CAPTIONS[normalize(photo?.shoot_phase)] || CATEGORY_CAPTIONS['puberty-ceremony']
  }

  return CATEGORY_CAPTIONS[normalizedSlug] || categoryName || 'Story'
}
