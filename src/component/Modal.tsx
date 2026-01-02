import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  visible: boolean
  message: string | null
  variant?: 'error' | 'success'
  onClose: () => void
}

const Modal: React.FC<Props> = ({ visible, message, variant = 'error', onClose }) => {
  return (
    <AnimatePresence>
      {visible && message && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />


          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed md:left-1/2 transform -translate-x-1/2 top-6 z-50 w-full max-w-lg px-4"
          >
            <div className={`${variant === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg shadow-lg p-4 flex items-start gap-4`}>
              <div className="flex-1">
                <div className="font-semibold">{variant === 'error' ? 'Error' : 'Success'}</div>
                <div className="text-sm mt-1 break-words">{message}</div>
              </div>
              <button
                onClick={onClose}
                className="ml-2 text-white/90 hover:underline"
                aria-label="Close message"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
