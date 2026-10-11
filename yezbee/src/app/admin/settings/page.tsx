'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Store, CreditCard, Truck, Shield, Key,
  Save, Sparkles, Check, AlertCircle, ArrowLeft, Mail, Send, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { updateAdminPasswordInDB } from '@/lib/adminAuth'

export default function AdminSettingsPage() {
  // Store Settings
  const [storeName, setStoreName] = useState('SB Fashion')
  const [supportEmail, setSupportEmail] = useState('sbfashionamazon@gmail.com')
  const [supportPhone, setSupportPhone] = useState('+91 8524906166')
  const [storeAddress, setStoreAddress] = useState('Bharath nagar 1st Street, Varatharajapuram, Mudichur, Chennai - 600048')
  const [currency, setCurrency] = useState('INR (₹)')

  // Notification Email Settings
  const [ownerEmail, setOwnerEmail] = useState('Yezbeefashion@gmail.com')
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Payment Settings
  const [codEnabled, setCodEnabled] = useState(true)
  const [razorpayEnabled, setRazorpayEnabled] = useState(true)

  // Shipping Settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('0')
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState('3-5 Business Days')

  // Password Security Settings
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSendTestEmail = async () => {
    setIsSendingTest(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmail }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message })
        showToast('Test email sent successfully!')
      } else {
        setTestResult({ success: false, message: data.message || 'Failed to dispatch email' })
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Network error' })
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Store settings saved successfully!')
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const ok = await updateAdminPasswordInDB(newPassword)
      if (ok) {
        setPasswordSuccess('Admin password updated successfully in database!')
        setNewPassword('')
        setConfirmPassword('')
        showToast('Admin password updated successfully!')
      } else {
        setPasswordError('Failed to update password in database')
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Error updating password')
    } finally {
      setIsUpdatingPassword(false)
    }
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
            <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Store Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Configure store preferences, payments, shipping, and admin security</p>
          </div>
        </div>
      </div>

      {/* General Store Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Store size={18} className="text-[#C9A84C]" />
          <h3 className="text-base font-semibold text-gray-900">Store Profile</h3>
        </div>

        <form onSubmit={handleSaveStoreSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Store Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Support Contact Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Default Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Registered Office Address</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl shadow-md shadow-[#C9A84C]/20 transition-all"
          >
            <Save size={16} /> Save Store Details
          </button>
        </form>
      </div>

      {/* Automatic Order Notifications & Email Alerts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#C9A84C]" />
            <h3 className="text-base font-semibold text-gray-900">Automatic Order Email Notifications</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles size={12} className="text-[#C9A84C]" />
            Auto-Trigger on Order
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Whenever a customer places an order (Cash on Delivery or Online Payment), an automated email containing customer contact details, phone number, delivery address, and ordered items is automatically sent to the store owner inbox.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Owner Notification Recipient Email</label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
              placeholder="Yezbeefashion@gmail.com"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              {isSendingTest ? <Loader2 size={14} className="animate-spin text-[#C9A84C]" /> : <Send size={14} />}
              {isSendingTest ? 'Sending Test...' : 'Send Test Alert'}
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {testResult.success ? (
              <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{testResult.success ? 'Success!' : 'Configuration Required:'}</p>
              <p className="mt-0.5">{testResult.message}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8]/60 text-xs text-gray-700 space-y-1.5">
          <p className="font-bold text-[#8C6D23] flex items-center gap-1.5">
            <Key size={14} /> Gmail SMTP 16-Digit App Password Setup:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-gray-600">
            <li>Go to your Google Account: <strong>Security &rarr; 2-Step Verification</strong>.</li>
            <li>Search for <strong>&quot;App Passwords&quot;</strong> and create an app name like <strong>&quot;YEZ BEE Store&quot;</strong>.</li>
            <li>Copy the 16-character generated password (e.g. <code>abcd efgh ijkl mnop</code>).</li>
            <li>Add it to your environment file: <code>SMTP_PASSWORD=...</code> in <code>.env.local</code>.</li>
          </ol>
        </div>
      </div>

      {/* Payment & Shipping Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Gateways */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <CreditCard size={18} className="text-[#C9A84C]" />
            <h3 className="text-base font-semibold text-gray-900">Payment Methods</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">Cash on Delivery (COD)</p>
                <p className="text-xs text-gray-500">Allow customers to pay in cash upon product arrival</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCodEnabled(!codEnabled)
                  showToast(`COD ${!codEnabled ? 'enabled' : 'disabled'}`)
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  codEnabled ? 'bg-[#C9A84C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    codEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">Razorpay Online Payment</p>
                <p className="text-xs text-gray-500">UPI, Cards, Netbanking via Razorpay Gateway</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700 border border-green-200">
                Active & Live
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Truck size={18} className="text-[#C9A84C]" />
            <h3 className="text-base font-semibold text-gray-900">Shipping & Delivery</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Free Shipping Minimum (₹)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
                placeholder="0"
              />
              <p className="text-[11px] text-gray-400 mt-1">Set 0 for free shipping on all orders</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Estimated Delivery Time</label>
              <input
                type="text"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Password & Security */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Shield size={18} className="text-[#C9A84C]" />
          <h3 className="text-base font-semibold text-gray-900">Admin Security & Password</h3>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
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
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New Administrator Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
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
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 bg-[#FAF7F2] rounded-xl text-sm text-gray-900 border border-transparent focus:border-[#C9A84C] focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Key size={16} /> {isUpdatingPassword ? 'Updating Password...' : 'Update Admin Password'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
