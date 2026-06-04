export default function TitleWithAmpersand({
  title,
  className = '',
  textClassName = '',
  ampersandClassName = '',
}) {
  const cleanTitle = String(title || '').trim()
  if (!cleanTitle) return null

  const parts = cleanTitle.split('&')

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
        className={`mx-[0.08em] inline-flex items-center justify-center font-luxury-italic leading-none tracking-[-0.06em] ${ampersandClassName}`}
      >
        &amp;
      </span>
      <span className={textClassName}>{right}</span>
    </span>
  )
}
