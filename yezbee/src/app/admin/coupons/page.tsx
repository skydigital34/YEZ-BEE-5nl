'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag, Plus, Search, Calendar, Copy, Check,
  Edit2, Trash2, ToggleLeft, ToggleRight, Sparkles,
  AlertTriangle, X, CheckCircle2, Percent, ArrowUpDown,
  ShoppingBag, Clock
} from 'lucide-react'

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount: number
  maxDiscountAmount?: number
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  status: 'active' | 'inactive' | 'expired'
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    description: '10% discount on first purchase for new customers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscountAmount: 300,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 142,
    status: 'active',
  },
  {
    id: 'coup-2',
    code: 'FESTIVE20',
    description: '20% off on all festive and ethnic collection',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1499,
    maxDiscountAmount: 500,
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    usageLimit: 200,
    usageCount: 88,
    status: 'active',
  },
  {
    id: 'coup-3',
    code: 'FLAT500',
    description: 'Flat ₹500 off on premium orders above ₹2,499',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2499,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 35,
    status: 'active',
  },
  {
    id: 'coup-4',
    code: 'SUMMERFLASH',
    description: 'Summer season clearance coupon',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 799,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    usageLimit: 300,
    usageCount: 298,
    status: 'expired',
  },
]

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<{
    code: string
    description: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minOrderAmount: number
    maxDiscountAmount: number
    startDate: string
    endDate: string
    usageLimit: number
    status: 'active' | 'inactive'
  }>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscountAmount: 500,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    status: 'active',
  })

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yezbee_admin_coupons')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoupons(parsed)
        }
      }
    } catch (e) {
      console.error('Error restoring coupons:', e)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const persistCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons)
    try {
      localStorage.setItem('yezbee_admin_coupons', JSON.stringify(newCoupons))
    } catch (e) {
      console.error('Error saving coupons:', e)
    }
  }

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    showToast(`Coupon code "${code}" copied to clipboard!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerateCode = () => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
    const generated = `YZB${randomChars}`
    setFormData((prev) => ({ ...prev, code: generated }))
  }

  const handleToggleStatus = (target: Coupon) => {
    const newStatus: 'active' | 'inactive' = target.status === 'active' ? 'inactive' : 'active'
    const updated = coupons.map((c) => (c.id === target.id ? { ...c, status: newStatus } : c))
    persistCoupons(updated)
    showToast(`Coupon "${target.code}" marked as ${newStatus}`)
  }

  const openCreateModal = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 999,
      maxDiscountAmount: 500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      status: 'active',
    })
    setShowModal(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      status: coupon.status === 'expired' ? 'inactive' : coupon.status,
    })
    setShowModal(true)
  }

  const handleSaveCoupon = () => {
    const cleanCode = formData.code.trim().toUpperCase()
    if (!cleanCode) {
      alert('Please enter a coupon code')
      return
    }

    if (formData.discountValue <= 0) {
      alert('Discount value must be greater than 0')
      return
    }

    if (editingCoupon) {
      const updated = coupons.map((c) => {
        if (c.id === editingCoupon.id) {
          return {
            ...c,
            code: cleanCode,
            description: formData.description.trim(),
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            minOrderAmount: Number(formData.minOrderAmount),
            maxDiscountAmount: Number(formData.maxDiscountAmount) || undefined,
            startDate: formData.startDate,
            endDate: formData.endDate,
            usageLimit: Number(formData.usageLimit),
            status: formData.status,
          }
        }
        return c
      })
      persistCoupons(updated)
      showToast(`Coupon "${cleanCode}" updated successfully!`)
    } else {
      const exists = coupons.some((c) => c.code === cleanCode)
      if (exists) {
        alert('A coupon with this code already exists. Please choose another code.')
        return
      }

      const newCoupon: Coupon = {
        id: `coup-${Date.now()}`,
        code: cleanCode,
        description: formData.description.trim() || `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '₹'} discount coupon`,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        maxDiscountAmount: Number(formData.maxDiscountAmount) || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: Number(formData.usageLimit),
        usageCount: 0,
        status: formData.status,
      }
      persistCoupons([newCoupon, ...coupons])
      showToast(`Coupon "${cleanCode}" created successfully!`)
    }

    setShowModal(false)
    setEditingCoupon(null)
  }

  const handleDeletePrompt = (coupon: Coupon) => {
    setDeletingCoupon(coupon)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!deletingCoupon) return
    const updated = coupons.filter((c) => c.id !== deletingCoupon.id)
    persistCoupons(updated)
    setShowDeleteModal(false)
    showToast(`Coupon "${deletingCoupon.code}" deleted!`)
    setDeletingCoupon(null)
  }

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return coupons.filter((c) => {
      const isExpired = c.endDate < today
      const effectiveStatus = isExpired ? 'expired' : c.status

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'expired' && isExpired) ||
        (statusFilter === 'active' && effectiveStatus === 'active') ||
        (statusFilter === 'inactive' && effectiveStatus === 'inactive')

      const matchesSearch =
        !search ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [coupons, statusFilter, search])

  // Summary Metrics
  const statsSummary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const total = coupons.length
    const active = coupons.filter((c) => c.status === 'active' && c.endDate >= today).length
    const totalRedeemed = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0)
    return { total, active, totalRedeemed }
  }, [coupons])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 relative"
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight font-display flex items-center gap-2.5">
            <Tag size={24} className="text-[#C9A84C]" />
            Coupons & Discounts
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Create promotional coupon codes, percentage discounts, minimum order requirements, and usage caps.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl shadow-md shadow-[#C9A84C]/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Coupon
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Coupons</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C9A84C] flex items-center justify-center">
              <Tag size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{statsSummary.total}</p>
          <p className="text-[11px] text-gray-400 mt-1">Configured in store promotions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{statsSummary.active}</p>
          <p className="text-[11px] text-gray-400 mt-1">Live and redeemable by shoppers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Redemptions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{statsSummary.totalRedeemed.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400 mt-1">Times coupons were applied at checkout</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Coupons' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-medium text-gray-700 placeholder-gray-400 border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 transition-all"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Coupon Code</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Min. Order</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Usage Progress</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Validity Period</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                    No coupons found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const today = new Date().toISOString().split('T')[0]
                  const isExpired = coupon.endDate < today
                  const usagePercent = Math.min(Math.round((coupon.usageCount / (coupon.usageLimit || 1)) * 100), 100)

                  return (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#FAF7F2] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-amber-50 text-[#8C6D23] border border-[#E8DFC8] rounded-lg tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.id, coupon.code)}
                            className="p-1 text-gray-400 hover:text-[#C9A84C] transition-colors"
                            title="Copy Code"
                          >
                            {copiedId === coupon.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{coupon.description}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                        </span>
                        {coupon.maxDiscountAmount && (
                          <p className="text-[10px] text-gray-400">Capped at ₹{coupon.maxDiscountAmount}</p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-gray-700">
                        ₹{coupon.minOrderAmount.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[11px] font-medium text-gray-500 mb-1">
                            <span>{coupon.usageCount} used</span>
                            <span>{coupon.usageLimit} max</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#C9A84C] h-1.5 rounded-full transition-all"
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-600">
                        <p className="flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-gray-400" />
                          {coupon.startDate} to {coupon.endDate}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            isExpired
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : coupon.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {isExpired ? 'Expired' : coupon.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(coupon)}
                            className="p-1.5 text-gray-400 hover:text-[#C9A84C] transition-colors"
                            title={coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {coupon.status === 'active' ? <ToggleRight size={22} className="text-emerald-600" /> : <ToggleLeft size={22} className="text-gray-300" />}
                          </button>
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 text-gray-400 hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#F5E6C8]/40"
                            title="Edit Coupon"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(coupon)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete Coupon"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C9A84C] flex items-center justify-center">
                    <Tag size={16} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingCoupon ? 'Edit Coupon Campaign' : 'Create New Coupon'}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Coupon Code *</label>
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-[11px] text-[#C9A84C] hover:underline font-semibold"
                    >
                      + Generate Random
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE25"
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-mono font-bold text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. 25% off festive kurtis"
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-700 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      min={1}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Min. Order Value (₹)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      min={0}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Max Cap (₹) [Optional]</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount || ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      placeholder="Optional cap"
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Max Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      min={1}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-700 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCoupon}
                  className="px-5 py-2 bg-[#C9A84C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#B8973B] transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Publish Coupon'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Coupon</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Are you sure you want to delete coupon <span className="font-mono font-bold text-gray-900">&quot;{deletingCoupon.code}&quot;</span>? Shoppers will no longer be able to use it.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Keep Coupon
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
