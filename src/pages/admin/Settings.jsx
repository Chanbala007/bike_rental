import { motion } from 'framer-motion'
import { Settings as SettingsIcon } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'

const Settings = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your account and preferences</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <SettingsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Settings page coming soon</p>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export default Settings

