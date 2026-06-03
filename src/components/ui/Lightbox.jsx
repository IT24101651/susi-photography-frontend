import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (index === null) return null
  const photo = images[index]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-6 text-white text-4xl leading-none"
          onClick={onClose}
        >×</button>
        <button
          className="absolute left-4 text-white text-4xl px-4 py-2"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
        >‹</button>
        <motion.img
          key={index}
          src={photo.image}
          alt={photo.title}
          className="max-h-[90vh] max-w-[90vw] object-contain rounded"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="absolute right-4 text-white text-4xl px-4 py-2"
          onClick={(e) => { e.stopPropagation(); onNext() }}
        >›</button>
        {photo.title && (
          <p className="absolute bottom-6 text-white/80 text-sm font-body">{photo.title}</p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
