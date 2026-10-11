'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, MessageSquare, CheckCircle, XCircle, Trash2,
  Search, Filter, Reply, AlertTriangle, Sparkles, X,
  Check, User, Package, Calendar, ShieldCheck
} from 'lucide-react'

export interface Review {
  id: string
  productName: string
  productSlug: string
  productImage: string
  customerName: string
  customerEmail: string
  rating: number
  title: string
  comment: string
  date: string
  status: 'approved' | 'pending' | 'rejected'
  verified: boolean
  adminReply?: string
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productName: 'Royal Velvet Evening Gown',
    productSlug: 'royal-velvet-evening-gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@gmail.com',
    rating: 5,
    title: 'Exquisite stitching and luxury feel!',
    comment: 'The velvet finish is so rich, and the fitting was absolutely on point. Wore it to a wedding reception and received endless compliments!',
    date: '2026-10-10',
    status: 'approved',
    verified: true,
    adminReply: 'Thank you so much Ananya! We are delighted that you loved the fabric and fit.',
  },
  {
    id: 'rev-2',
    productName: 'Handloom Pure Silk Saree',
    productSlug: 'handloom-pure-silk-saree',
    productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    customerName: 'Kavitha Rangarajan',
    customerEmail: 'kavitha.r@outlook.com',
    rating: 5,
    title: 'Authentic silk weave & pure zari',
    comment: 'The zari border has a genuine luster. The saree is lightweight yet looks regal. Fast delivery as well.',
    date: '2026-10-09',
    status: 'approved',
    verified: true,
  },
  {
    id: 'rev-3',
    productName: 'Embroidered Anarkali Set',
    productSlug: 'embroidered-anarkali-set',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    customerName: 'Meera Patel',
    customerEmail: 'meera.patel92@gmail.com',
    rating: 4,
    title: 'Beautiful color, slight delay in delivery',
    comment: 'The dupatta embroidery is stunning. The parcel arrived a day later than expected, but the product quality made up for it.',
    date: '2026-10-08',
    status: 'pending',
    verified: true,
  },
  {
    id: 'rev-4',
    productName: 'Peplum Top & Dhoti Set',
    productSlug: 'peplum-top-dhoti-set',
    productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    customerName: 'Sneha Kapoor',
    customerEmail: 'sneha.k@yahoo.com',
    rating: 5,
    title: 'Super chic Indo-western look',
    comment: 'Comfortable cotton lining with beautiful mirror work. Very trendy for festive parties.',
    date: '2026-10-05',
    status: 'approved',
    verified: false,
  },
  {
    id: 'rev-5',
    productName: 'Handcrafted Cotton Kurti',
    productSlug: 'handcrafted-cotton-kurti',
    productImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
    customerName: 'Pooja V.',
    customerEmail: 'pooja.v@gmail.com',
    rating: 2,
    title: 'Color looked slightly different from photos',
    comment: 'The fabric is comfortable but the shade of mustard was darker than depicted on the screen.',
    date: '2026-10-02',
    status: 'pending',
    verified: true,
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Reply Modal State
  const [replyingReview, setReplyingReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')

  // Delete Modal State
  const [deletingReview, setDeletingReview] = useState<Review | null>(null)

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yezbee_admin_reviews')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed)
        }
      }
    } catch (e) {
      console.error('Error loading saved reviews:', e)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const persistReviews = (newReviews: Review[]) => {
    setReviews(newReviews)
    try {
      localStorage.setItem('yezbee_admin_reviews', JSON.stringify(newReviews))
    } catch (e) {
      console.error('Error saving reviews:', e)
    }
  }

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    persistReviews(updated)
    showToast(`Review status updated to "${newStatus}"`)
  }

  const handleOpenReplyModal = (review: Review) => {
    setReplyingReview(review)
    setReplyText(review.adminReply || '')
  }

  const handleSaveReply = () => {
    if (!replyingReview) return
    const updated = reviews.map((r) =>
      r.id === replyingReview.id ? { ...r, adminReply: replyText.trim() || undefined } : r
    )
    persistReviews(updated)
    showToast('Reply published successfully!')
    setReplyingReview(null)
    setReplyText('')
  }

  const handleConfirmDelete = () => {
    if (!deletingReview) return
    const updated = reviews.filter((r) => r.id !== deletingReview.id)
    persistReviews(updated)
    showToast('Review removed from database')
    setDeletingReview(null)
  }

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter
      const matchesSearch =
        !search ||
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase())

      return matchesStatus && matchesRating && matchesSearch
    })
  }, [reviews, statusFilter, ratingFilter, search])

  // Aggregate Metrics
  const summary = useMemo(() => {
    const total = reviews.length
    const approved = reviews.filter((r) => r.status === 'approved').length
    const pending = reviews.filter((r) => r.status === 'pending').length
    const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0'

    const starCounts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
      pct: total > 0 ? Math.round((reviews.filter((r) => r.rating === star).length / total) * 100) : 0,
    }))

    return { total, approved, pending, avg, starCounts }
  }, [reviews])

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
            <Star size={24} className="text-[#C9A84C] fill-[#C9A84C]" />
            Customer Reviews & Ratings
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Moderate customer feedback, approve ratings for storefront display, and publish official store replies.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-gray-900 font-display flex items-center justify-center gap-1">
              <span>{summary.avg}</span>
              <Star size={24} className="text-[#C9A84C] fill-[#C9A84C]" />
            </div>
            <p className="text-xs text-gray-400 mt-1">{summary.total} verified ratings</p>
          </div>
          <div className="flex-1 space-y-1.5 border-l border-gray-100 pl-6">
            {summary.starCounts.map((sc) => (
              <div key={sc.star} className="flex items-center gap-2 text-xs">
                <span className="w-4 font-semibold text-gray-600">{sc.star}★</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C9A84C] h-1.5 rounded-full" style={{ width: `${sc.pct}%` }} />
                </div>
                <span className="w-6 text-[10px] text-gray-400 text-right">{sc.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Moderation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              {summary.pending}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600">{summary.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting approval before appearing on storefront</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live & Approved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">{summary.approved}</p>
            <p className="text-xs text-gray-400 mt-1">Currently visible to shoppers</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'pending', label: `Pending (${summary.pending})` },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 bg-white rounded-xl text-xs font-semibold text-gray-700 border border-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-medium text-gray-700 placeholder-gray-400 border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400 shadow-sm">
            No reviews match the selected filters.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 hover:text-[#C9A84C] transition-colors">
                      {review.productName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-800">{review.title}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 self-start">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      review.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : review.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs font-medium text-gray-700 leading-relaxed pl-16">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Admin Reply If Any */}
              {review.adminReply && (
                <div className="ml-16 p-3 bg-amber-50/60 rounded-xl border border-[#E8DFC8] text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C6D23] mb-1">
                    <Reply size={13} />
                    <span>Store Response from YEZ BEE</span>
                  </div>
                  <p className="text-gray-700 text-xs">{review.adminReply}</p>
                </div>
              )}

              {/* Customer meta & action bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-50 text-xs">
                <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                  <span className="font-semibold text-gray-800 flex items-center gap-1">
                    <User size={12} className="text-gray-400" />
                    {review.customerName}
                  </span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      <ShieldCheck size={11} /> Verified Buyer
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar size={11} />
                    {review.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReplyModal(review)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-[#FAF7F2] rounded-xl border border-gray-200 transition-colors"
                  >
                    <Reply size={13} className="text-[#C9A84C]" />
                    {review.adminReply ? 'Edit Reply' : 'Reply'}
                  </button>

                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id, 'approved')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                    >
                      <CheckCircle size={13} />
                      Approve
                    </button>
                  )}

                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(review.id, 'rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingReview(review)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setReplyingReview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Reply size={16} className="text-[#C9A84C]" />
                  Reply to {replyingReview.customerName}
                </h3>
                <button onClick={() => setReplyingReview(null)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                <span className="font-bold text-gray-800">Review: </span>
                &ldquo;{replyingReview.comment}&rdquo;
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Official Store Reply</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer or address their concern warmly..."
                  className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReply}
                  className="px-5 py-2 bg-[#C9A84C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#B8973B] transition-all"
                >
                  Publish Reply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setDeletingReview(null)}
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Review</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Are you sure you want to permanently delete this customer review?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingReview(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Keep Review
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
