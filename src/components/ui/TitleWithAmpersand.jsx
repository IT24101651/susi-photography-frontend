export default function TitleWithAmpersand({
  title,
  className = '',
  textClassName = '',
  ampersandClassName = '',
}) {
  const cleanTitle = String(title || '').trim()
  if (!cleanTitle) return null

  const parts = cleanTitle.split('&')
  const resolvedAmpersandClassName =
    ampersandClassName ||
    'ml-[0.01em] mr-[0.14em] inline-flex items-center justify-center font-luxury-italic text-[0.88em] font-normal leading-none tracking-[-0.08em] translate-y-[-0.02em] scale-x-[0.97] opacity-90'

  if (parts.length < 2) {
    return <span className={className}>{cleanTitle}</span>
  }

  const left = parts[0].trim()
  const right = parts.slice(1).join('&').trim()

  return (
    <span className={className}>
      <span className={textClassName}>{left}</span>
      <span
        aria-hidden="true"
        className={resolvedAmpersandClassName}
        style={{ fontWeight: 400 }}
      >
        &amp;
      </span>
      <span className={textClassName}>{right}</span>
    </span>
  )
}
