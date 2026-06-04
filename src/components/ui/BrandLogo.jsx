export default function BrandLogo({
  light = false,
  compact = false,
  hideNameOnMobile = false,
  showImage = true,
  name = 'Susi Photography',
  className = '',
  textColorClass = '',
  imageClassName = '',
}) {
  const textCls = textColorClass || (light ? 'text-white' : 'text-text')

  return (
    <span className={`inline-flex items-center ${showImage ? (compact ? 'gap-3' : 'gap-4') : ''} ${className}`}>
      {showImage ? (
        <img
          src="/Susi_logo.jpg"
          alt="Susi Photography logo"
          className={`${compact ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-12 w-12'} object-contain flex-shrink-0 ${imageClassName}`}
        />
      ) : null}
      <span className={`${textCls} font-wordmark uppercase tracking-[0.22em] sm:tracking-[0.34em] ${compact ? 'text-[11px] sm:text-sm' : 'text-lg'} ${hideNameOnMobile ? 'hidden sm:inline' : ''}`}>
        {name}
      </span>
    </span>
  )
}
