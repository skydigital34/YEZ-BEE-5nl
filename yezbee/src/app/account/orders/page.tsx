'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  ChevronRight,
  Truck,
} from 'lucide-react'
import { api } from '@/lib/api'

const ALL_ORDERS = Array.from({ length: 6 }, (_, i) => ({
  id: `2026${String(100 + i + 1).padStart(4, '0')}`,
  date: new Date(Date.now() - i * 86400000 * 7).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  status: ['Delivered', 'Shipped', 'Processing', 'Cancelled', 'Delivered', 'Shipped'][i],
  items: [2, 1, 3, 1, 2, 1][i],
  total: [10497, 3999, 7498, 2499, 12999, 5499][i],
  product: ['Luxe Crepe Silk Gown', 'Champagne Top', 'Navy Blazer', 'Blush Dress', 'Evening Gown', 'Silk Kurta'][i],
  size: ['M', 'L', 'S', 'XL', 'M', 'Free Size'][i],
}))

const TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'text-green-600 bg-green-50',
  Shipped: 'text-blue-600 bg-blue-50',
  Processing: 'text-gold bg-gold/10',
  Cancelled: 'text-red-500 bg-red-50',
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [ordersList, setOrdersList] = useState<any[]>(ALL_ORDERS)

  useEffect(() => {
    api.getOrders().then((res) => {
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((o: any) => {
          const firstItem = Array.isArray(o.items) && o.items[0] ? o.items[0] : null
          const rawStatus = (o.status || 'pending').toLowerCase()
          const capitalizedStatus =
            rawStatus === 'confirmed' || rawStatus === 'pending' || rawStatus === 'processing'
              ? 'Processing'
              : rawStatus === 'shipped' || rawStatus === 'out_for_delivery'
              ? 'Shipped'
              : rawStatus === 'delivered'
              ? 'Delivered'
              : rawStatus === 'cancelled'
              ? 'Cancelled'
              : 'Processing'

          return {
            id: o.orderNumber || o.id || o._id,
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Recent',
            status: capitalizedStatus,
            items: Array.isArray(o.items) ? o.items.length : 1,
            total: o.totalAmount || 0,
            product: firstItem?.name || 'Luxury Fashion Item',
            size: firstItem?.size || firstItem?.meta?.size || '',
          }
        })
        setOrdersList(formatted)
      }
    }).catch(() => {})
  }, [])

  const filtered = activeTab === 'All' ? ordersList : ordersList.filter((o) => o.status === activeTab)

  return (
    <div className="min-h-screen bg-warmWhite">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <Link href="/account" className="flex items-center gap-1 text-xs text-dark/40 hover:text-dark transition-colors mb-4">
          <ChevronRight size={12} className="rotate-180" /> Back to Account
        </Link>
        <h1 className="font-playfair text-3xl md:text-4xl text-dark mb-6">My Orders</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-dark text-white' : 'bg-white border border-dark/10 text-dark/60 hover:border-dark/30'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({ALL_ORDERS.filter((o) => o.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={64} className="text-dark/10 mb-6" />
            <h2 className="font-playfair text-xl text-dark mb-2">No Orders Found</h2>
            <p className="text-dark/50 text-sm mb-6">You haven&apos;t placed any orders yet</p>
            <Link href="/category/all" className="px-8 py-3 bg-gold text-dark text-sm rounded-lg hover:bg-gold/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="block bg-white rounded-xl border border-dark/5 p-4 md:p-6 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-xs text-dark/40">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 text-[10px] rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-dark/5 rounded-lg flex items-center justify-center text-[8px] text-dark/20 font-bold uppercase">YEZ BEE</div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-dark">{order.product}</p>
                            {order.size && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF7F2] text-[#8C6D23] border border-[#E8DFC8]">
                                Size: {order.size}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-dark/40 mt-0.5">{order.items} {order.items === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <span className="text-sm font-bold text-dark">₹{order.total.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/track-order?orderId=${order.id}`;
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark/5 hover:bg-gold hover:text-dark text-xs font-semibold rounded-lg transition-colors text-dark/80 cursor-pointer"
                          >
                            <Truck size={13} /> Track
                          </span>
                          <ChevronRight size={14} className="text-dark/20" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
