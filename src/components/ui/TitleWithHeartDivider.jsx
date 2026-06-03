import { HEART_DIVIDER_TOKEN, formatCardTitleLines } from '../../utils/cardOverlay'
import HeartDivider from './HeartDivider'

export default function TitleWithHeartDivider({
  title,
  className = '',
  textClassName = '',
  heartClassName = '',
}) {
  return (
    <span className={className}>
      {formatCardTitleLines(title).map((line, lineIndex) => (
        <span
          key={`${String(title || '').slice(0, 32)}-${lineIndex}`}
          className={line === HEART_DIVIDER_TOKEN ? 'block py-[0.08em]' : 'block'}
        >
          {line === HEART_DIVIDER_TOKEN ? (
            <HeartDivider className={heartClassName || 'h-[1.3em] w-[0.92em] -translate-y-[0.03em] text-white'} />
          ) : (
            <span className={textClassName}>{line}</span>
          )}
        </span>
      ))}
    </span>
  )
}
