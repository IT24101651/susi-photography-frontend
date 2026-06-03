export default function HeartDivider({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center font-times-italic italic leading-none tracking-[-0.08em] ${className}`}
    >
      &
    </span>
  )
}
