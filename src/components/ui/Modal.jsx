import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children, panelClassName = '', contentClassName = '' }) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${panelClassName}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
            <h3 className="font-heading text-lg text-text">{title}</h3>
            <button onClick={onClose} className="text-muted hover:text-text text-2xl leading-none">×</button>
          </div>
          <div className={`px-6 py-5 ${contentClassName}`}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
