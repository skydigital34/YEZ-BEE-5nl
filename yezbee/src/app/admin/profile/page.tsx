'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Shield, Key, Check, AlertCircle,
  Save, Sparkles, LogOut, ArrowLeft, Lock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getAdminSession,
  saveAdminSession,
  updateAdminPasswordInDB,
  clearAdminSession,
  AdminUser
} from '@/lib/adminAuth'

export default function AdminProfilePage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Profile save toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  useEffect(() => {
    const session = getAdminSession()
    if (session) {
      setAdmin(session)
      setName(session.name || 'SB Fashion Admin')
      setEmail(session.email || 'sbfashionamazon@gmail.com')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Name cannot be empty')
      return
    }

    if (admin) {
      const updated: AdminUser = {
        ...admin,
        name: name.trim(),
        email: email.trim(),
      }
      setAdmin(updated)
      saveAdminSession(updated, true)
      showToast('Profile updated successfully!')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setIsChangingPassword(true)
    try {
      const success = await updateAdminPasswordInDB(newPassword)
      if (success) {
        setPasswordSuccess('Password changed successfully in database!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        showToast('Password updated successfully!')
      } else {
        setPasswordError('Failed to update password in database')
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Error updating password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    window.location.href = '/admin/login'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-[#C9A84C]"
          >
            <Sparkles size={16} className="text-[#C9A84C]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500 hover:text-[#C9A84C] transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Admin Profile</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your administrator account details and security</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-[#C9A84C] to-[#A8882E] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#C9A84C]/20 flex-shrink-0">
          {(name || 'SB').split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{name || 'SB Fashion Admin'}</h2>
            <span className="inline-flex items-center self-center sm:self-auto gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">
              <Shield size={12} /> Super Admin
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">{email || 'sbfashionamazon@gmail.com'}</p>
          <p className="text-xs text-gray-400 mt-0.5">Role: Super Administrator &bull; Access: Full Portal Privileges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <User size={18} className="text-[#C9A84C]" />
            <h3 className="text-base font-semibold text-gray-900">Account Details</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Administrator Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                placeholder="Admin Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
              <input
                type="text"
                disabled
                value="Super Administrator"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-400 border border-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl shadow-md shadow-[#C9A84C]/20 transition-all pt-3"
            >
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Lock size={18} className="text-[#C9A84C]" />
            <h3 className="text-base font-semibold text-gray-900">Security & Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 border border-green-100">
                <Check size={14} className="flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Key size={16} /> {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
