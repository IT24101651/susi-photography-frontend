export default function HeartDivider({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center font-luxury-italic leading-none tracking-[-0.06em] ${className}`}
    >
      &amp;
    </span>
  )
}
