'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  Plus, Eye, FolderTree, ExternalLink, ChevronRight,
  RefreshCw, Sparkles
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import Chart from '@/components/admin/Chart'
import { api } from '@/lib/api'
import { useAdminAuth } from '@/app/admin/layout'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

const statusColors: Record<string, string> = {
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  Processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  Pending: 'bg-orange-100 text-orange-700 border-orange-200',
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  Returned: 'bg-gray-100 text-gray-700 border-gray-200',
  returned: 'bg-gray-100 text-gray-700 border-gray-200',
}

const DATE_RANGES = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '1y', label: '1 Year' },
  { id: 'all', label: 'All Time' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { adminName } = useAdminAuth()
  const [selectedRange, setSelectedRange] = useState('30d')
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good day')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Dynamic greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Restore saved date range from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yezbee_admin_date_range')
      if (saved) setSelectedRange(saved)
    }
  }, [])

  const handleRangeSelect = (rangeId: string) => {
    setSelectedRange(rangeId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('yezbee_admin_date_range', rangeId)
    }
  }

  // Fetch real orders from Firestore
  const fetchOrders = async () => {
    try {
      const res = await api.getOrders()
      if (res && res.success && Array.isArray(res.data)) {
        setAllOrders(res.data)
      } else {
        setAllOrders([])
      }
    } catch (err) {
      console.error('Failed to fetch real orders for dashboard:', err)
      setAllOrders([])
    } finally {
      setOrdersLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    fetchOrders()
  }

  // Dynamic calculation of stats, revenue, customers, charts from real database
  const { calculatedStats, revenueChartData, ordersChartData, rangeLabelText } = useMemo(() => {
    const totalAllRevenue = allOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)

    const now = new Date()
    const isAllTime = selectedRange === 'all'
    const days = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : selectedRange === '90d' ? 90 : 365
    const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const prevRangeStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000)

    const inRangeOrders = isAllTime
      ? allOrders
      : allOrders.filter((o) => {
          if (!o.createdAt) return true
          const d = new Date(o.createdAt)
          return d >= rangeStart && d <= now
        })

    const prevOrders = isAllTime
      ? []
      : allOrders.filter((o) => {
          if (!o.createdAt) return false
          const d = new Date(o.createdAt)
          return d >= prevRangeStart && d < rangeStart
        })

    const rangeRevenue = inRangeOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)

    const prevRevenue = prevOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)

    // Unique customers in range
    const uniqueCustomers = new Set(
      inRangeOrders
        .map((o) => o.shippingAddress?.email || o.shippingAddress?.phone || o.customer || o.email)
        .filter(Boolean)
    ).size

    const prevUniqueCustomers = new Set(
      prevOrders
        .map((o) => o.shippingAddress?.email || o.shippingAddress?.phone || o.customer || o.email)
        .filter(Boolean)
    ).size

    // Trend calculations
    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0
      return Number((((curr - prev) / prev) * 100).toFixed(1))
    }

    const revTrend = calcTrend(rangeRevenue, prevRevenue)
    const ordTrend = calcTrend(inRangeOrders.length, prevOrders.length)
    const custTrend = calcTrend(uniqueCustomers, prevUniqueCustomers)

    // Average order value
    const nonCancelledOrdersCount = inRangeOrders.filter((o) => o.status !== 'cancelled').length
    const aov = nonCancelledOrdersCount > 0 ? Math.round(rangeRevenue / nonCancelledOrdersCount) : 0
    const prevAov = prevOrders.length > 0 ? Math.round(prevRevenue / prevOrders.length) : 0
    const aovTrend = calcTrend(aov, prevAov)

    // Chart buckets
    const numBuckets = isAllTime ? 12 : days <= 7 ? 7 : days <= 30 ? 30 : 12
    const revBuckets: number[] = new Array(numBuckets).fill(0)
    const ordBuckets: number[] = new Array(numBuckets).fill(0)

    if (isAllTime) {
      // Month-by-month for past 12 months
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const yr = monthDate.getFullYear()
        const mo = monthDate.getMonth()
        allOrders.forEach((o) => {
          if (!o.createdAt) return
          const od = new Date(o.createdAt)
          if (od.getFullYear() === yr && od.getMonth() === mo) {
            if (o.status !== 'cancelled') {
              revBuckets[i] += Number(o.totalAmount) || 0
            }
            ordBuckets[i] += 1
          }
        })
      }
    } else {
      // Day-by-day buckets
      for (let i = 0; i < numBuckets; i++) {
        const bucketDate = new Date(now.getTime() - (numBuckets - 1 - i) * 24 * 60 * 60 * 1000)
        const dateStr = bucketDate.toISOString().split('T')[0]
        inRangeOrders.forEach((o) => {
          if (!o.createdAt) return
          const odStr = new Date(o.createdAt).toISOString().split('T')[0]
          if (odStr === dateStr) {
            if (o.status !== 'cancelled') {
              revBuckets[i] += Number(o.totalAmount) || 0
            }
            ordBuckets[i] += 1
          }
        })
      }
    }

    const rangeLabel =
      selectedRange === '7d'
        ? 'Last 7 days'
        : selectedRange === '30d'
        ? 'Last 30 days'
        : selectedRange === '90d'
        ? 'Last 90 days'
        : selectedRange === '1y'
        ? 'Past 1 year'
        : 'All-time historical'

    const statCards = [
      {
        icon: DollarSign,
        label: 'Total Revenue',
        value: `₹${rangeRevenue.toLocaleString()}`,
        trend: revTrend,
        change:
          prevRevenue > 0
            ? `${revTrend >= 0 ? '+' : ''}${revTrend}% vs previous period`
            : `${inRangeOrders.length} order(s) · All-time: ₹${totalAllRevenue.toLocaleString()}`,
        color: '#C9A84C',
        data: revBuckets,
      },
      {
        icon: ShoppingBag,
        label: 'Total Orders',
        value: inRangeOrders.length.toLocaleString(),
        trend: ordTrend,
        change:
          prevOrders.length > 0
            ? `${ordTrend >= 0 ? '+' : ''}${ordTrend}% vs previous period`
            : `${allOrders.length} total orders recorded in Firestore`,
        color: '#3B82F6',
        data: ordBuckets,
      },
      {
        icon: Users,
        label: 'Total Customers',
        value: uniqueCustomers.toLocaleString(),
        trend: custTrend,
        change: `${uniqueCustomers} customer(s) placed orders`,
        color: '#10B981',
        data: ordBuckets.map((b) => (b > 0 ? 1 : 0)),
      },
      {
        icon: TrendingUp,
        label: 'Avg Order Value',
        value: `₹${aov.toLocaleString()}`,
        trend: aovTrend,
        change:
          nonCancelledOrdersCount > 0
            ? `Across ${nonCancelledOrdersCount} active order(s)`
            : 'No active orders in this period',
        color: '#F59E0B',
        data: revBuckets.map((r, i) => (ordBuckets[i] > 0 ? Math.round(r / ordBuckets[i]) : 0)),
      },
    ]

    return {
      calculatedStats: statCards,
      revenueChartData: revBuckets,
      ordersChartData: ordBuckets,
      rangeLabelText: rangeLabel,
    }
  }, [allOrders, selectedRange])

  // Recent 5 orders formatted for table
  const recentOrders = useMemo(() => {
    return allOrders.slice(0, 5).map((o: any) => ({
      id: o.orderNumber || o.id || o._id,
      _id: o._id || o.id,
      customer: o.shippingAddress
        ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName || ''}`.trim()
        : 'Customer',
      items: Array.isArray(o.items) ? o.items.length : 0,
      total: `₹${(o.totalAmount || 0).toLocaleString()}`,
      status: o.status || 'pending',
      payment: o.payment || 'unpaid',
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
        : 'Recent',
    }))
  }, [allOrders])

  // Top selling products calculated from real orders in database
  const topProducts = useMemo(() => {
    const pMap = new Map<string, { name: string; price: string; sold: number; revenue: string; image: string }>()
    allOrders.forEach((o: any) => {
      const items = Array.isArray(o.items) ? o.items : Array.isArray(o.rawItems) ? o.rawItems : []
      items.forEach((it: any) => {
        const name = it.name || 'Product'
        const qty = it.quantity || 1
        const price = it.price || 0
        const existing = pMap.get(name)
        if (existing) {
          existing.sold += qty
          existing.revenue = `₹${(existing.sold * price).toLocaleString()}`
        } else {
          pMap.set(name, {
            name,
            price: `₹${price.toLocaleString()}`,
            sold: qty,
            revenue: `₹${(qty * price).toLocaleString()}`,
            image: it.image || '',
          })
        }
      })
    })
    return Array.from(pMap.values()).sort((a, b) => b.sold - a.sold)
  }, [allOrders])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">
              {greeting}, {adminName || 'Admin'}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Firestore Sync
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Real-time overview of revenue, order volume, and customer activity at YEZ BEE.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-[#C9A84C] bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-[#FAF7F2] disabled:opacity-50"
            title="Refresh database stats"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#C9A84C]' : ''} />
          </button>
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto" suppressHydrationWarning>
            {DATE_RANGES.map((range) => (
              <button
                key={range.id}
                onClick={() => handleRangeSelect(range.id)}
                suppressHydrationWarning
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedRange === range.id
                    ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Real Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {calculatedStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Real Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">{rangeLabelText}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
              <span className="text-xs text-gray-500 font-medium">Revenue (₹)</span>
            </div>
          </div>
          <Chart
            variant="area"
            data={revenueChartData}
            color="#C9A84C"
            height={200}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Orders Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">{rangeLabelText}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-500 font-medium">Orders Count</span>
            </div>
          </div>
          <Chart
            variant="bar"
            data={ordersChartData}
            color="#3B82F6"
            height={200}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real orders from database</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C9A84C] font-semibold hover:underline flex items-center gap-1"
            >
              View All Orders <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50/50">
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                      {ordersLoading ? 'Loading orders from Firestore...' : 'No orders recorded yet'}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => router.push(`/admin/orders/${order._id || order.id}`)}
                      className="border-b border-gray-50 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 text-sm font-semibold text-[#C9A84C]">{order.id}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{order.customer}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{order.items}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{order.total}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold capitalize ${order.payment.toLowerCase() === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-400">{order.date}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center bg-gray-50/30">
            <Link href="/admin/orders" className="text-xs text-[#C9A84C] font-semibold hover:underline">
              View all orders in detail &rarr;
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-sm font-semibold text-gray-900">Top Selling Products</h3>
            <p className="text-xs text-gray-500 mt-0.5">Calculated from verified sales</p>
          </div>
          <div className="space-y-1 px-4 pb-4">
            {topProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No sales recorded yet</p>
            ) : (
              topProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[#F5E6C8]/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A84C] font-semibold text-xs">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.price} &middot; {product.sold} sold</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{product.revenue}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Plus, label: 'Add Product', href: '/admin/products/create', desc: 'Add new product to catalog' },
          { icon: Eye, label: 'View Orders', href: '/admin/orders', desc: 'Manage incoming orders' },
          { icon: FolderTree, label: 'Categories', href: '/admin/categories', desc: 'Manage product categories' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#C9A84C]/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C9A84C]/10 to-[#F5E6C8]/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <action.icon size={22} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    {action.label}
                    <ExternalLink size={12} className="text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
