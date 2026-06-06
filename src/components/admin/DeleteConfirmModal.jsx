import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Delete Bike?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete "{itemName}"? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex gap-4 mt-6">
              <motion.button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DeleteConfirmModal

