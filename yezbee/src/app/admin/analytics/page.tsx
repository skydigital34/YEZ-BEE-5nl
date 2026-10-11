'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, DollarSign, ShoppingBag, Users,
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  PieChart, RefreshCw, Sparkles, Package, Truck, CheckCircle, XCircle
} from 'lucide-react'
import Chart from '@/components/admin/Chart'
import { api } from '@/lib/api'

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

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d')
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchOrders = async () => {
    try {
      const res = await api.getOrders()
      if (res && res.success && Array.isArray(res.data)) {
        setAllOrders(res.data)
      }
    } catch (e) {
      console.error('Failed to fetch analytics orders:', e)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchOrders()
  }

  // Analytics Calculations
  const analyticsData = useMemo(() => {
    const now = new Date()
    const isAll = selectedRange === 'all'
    const days = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : selectedRange === '90d' ? 90 : 365
    const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const prevRangeStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000)

    const inRange = isAll
      ? allOrders
      : allOrders.filter((o) => {
          if (!o.createdAt) return true
          const d = new Date(o.createdAt)
          return d >= rangeStart && d <= now
        })

    const prevRange = isAll
      ? []
      : allOrders.filter((o) => {
          if (!o.createdAt) return false
          const d = new Date(o.createdAt)
          return d >= prevRangeStart && d < rangeStart
        })

    const grossSales = inRange.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)
    const cancelledOrders = inRange.filter((o) => o.status === 'cancelled')
    const cancelledLoss = cancelledOrders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)
    const netSales = grossSales - cancelledLoss

    const totalOrders = inRange.length
    const activeOrders = totalOrders - cancelledOrders.length
    const aov = activeOrders > 0 ? Math.round(netSales / activeOrders) : 0

    // Unique Customers
    const uniqueCustomers = new Set(
      inRange.map((o) => o.shippingAddress?.email || o.shippingAddress?.phone || o.customer).filter(Boolean)
    ).size

    // Previous period comparisons
    const prevGross = prevRange.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0)
    const prevOrders = prevRange.length

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0
      return Number((((curr - prev) / prev) * 100).toFixed(1))
    }

    const salesTrend = calcTrend(grossSales, prevGross)
    const ordersTrend = calcTrend(totalOrders, prevOrders)

    // Chart Buckets
    const numBuckets = isAll ? 12 : days <= 7 ? 7 : days <= 30 ? 30 : 12
    const revBuckets: number[] = new Array(numBuckets).fill(0)
    const ordBuckets: number[] = new Array(numBuckets).fill(0)

    if (isAll) {
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const yr = monthDate.getFullYear()
        const mo = monthDate.getMonth()
        allOrders.forEach((o) => {
          if (!o.createdAt) return
          const od = new Date(o.createdAt)
          if (od.getFullYear() === yr && od.getMonth() === mo) {
            if (o.status !== 'cancelled') revBuckets[i] += Number(o.totalAmount) || 0
            ordBuckets[i] += 1
          }
        })
      }
    } else {
      for (let i = 0; i < numBuckets; i++) {
        const bucketDate = new Date(now.getTime() - (numBuckets - 1 - i) * 24 * 60 * 60 * 1000)
        const dateStr = bucketDate.toISOString().split('T')[0]
        inRange.forEach((o) => {
          if (!o.createdAt) return
          const odStr = new Date(o.createdAt).toISOString().split('T')[0]
          if (odStr === dateStr) {
            if (o.status !== 'cancelled') revBuckets[i] += Number(o.totalAmount) || 0
            ordBuckets[i] += 1
          }
        })
      }
    }

    // Status breakdown
    const statusCounts: Record<string, number> = {
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      pending: 0,
    }
    inRange.forEach((o) => {
      const st = (o.status || 'pending').toLowerCase()
      if (statusCounts[st] !== undefined) statusCounts[st] += 1
      else statusCounts['pending'] += 1
    })

    // Payment method breakdown
    let onlinePayCount = 0
    let codPayCount = 0
    inRange.forEach((o) => {
      const pm = (o.paymentMethod || '').toLowerCase()
      if (pm.includes('cod') || pm.includes('cash')) codPayCount += 1
      else onlinePayCount += 1
    })

    return {
      grossSales,
      netSales,
      cancelledLoss,
      totalOrders,
      activeOrders,
      aov,
      uniqueCustomers,
      salesTrend,
      ordersTrend,
      revBuckets,
      ordBuckets,
      statusCounts,
      onlinePayCount,
      codPayCount,
    }
  }, [allOrders, selectedRange])

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Report Period', selectedRange],
      ['Gross Revenue (INR)', analyticsData.grossSales],
      ['Net Revenue (INR)', analyticsData.netSales],
      ['Cancelled Orders Loss (INR)', analyticsData.cancelledLoss],
      ['Total Orders', analyticsData.totalOrders],
      ['Active Orders', analyticsData.activeOrders],
      ['Average Order Value (AOV)', analyticsData.aov],
      ['Unique Customers', analyticsData.uniqueCustomers],
      ['Confirmed Orders', analyticsData.statusCounts.confirmed || 0],
      ['Shipped Orders', analyticsData.statusCounts.shipped || 0],
      ['Delivered Orders', analyticsData.statusCounts.delivered || 0],
      ['Cancelled Orders', analyticsData.statusCounts.cancelled || 0],
      ['Online Payments', analyticsData.onlinePayCount],
      ['Cash on Delivery (COD)', analyticsData.codPayCount],
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `yezbee_analytics_${selectedRange}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight font-display flex items-center gap-2.5">
            <BarChart3 size={24} className="text-[#C9A84C]" />
            Store Analytics & Performance
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Comprehensive business metrics, revenue performance, order fulfillment ratios, and sales intelligence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-[#C9A84C] bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-[#FAF7F2] disabled:opacity-50"
            title="Refresh database numbers"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#C9A84C]' : ''} />
          </button>
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' },
              { id: 'all', label: 'All Time' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedRange(range.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedRange === range.id
                    ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-[#FAF7F2] transition-all"
          >
            <Download size={14} className="text-[#C9A84C]" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C9A84C] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{analyticsData.grossSales.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className={analyticsData.salesTrend >= 0 ? 'text-green-600 font-semibold flex items-center' : 'text-red-600 font-semibold flex items-center'}>
              {analyticsData.salesTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(analyticsData.salesTrend)}%
            </span>
            <span className="text-gray-400 text-[11px]">vs prior period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Net Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">₹{analyticsData.netSales.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400 mt-1">Excludes cancelled & returned orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analyticsData.totalOrders}</p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className={analyticsData.ordersTrend >= 0 ? 'text-green-600 font-semibold flex items-center' : 'text-red-600 font-semibold flex items-center'}>
              {analyticsData.ordersTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(analyticsData.ordersTrend)}%
            </span>
            <span className="text-gray-400 text-[11px]">order volume</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{analyticsData.aov.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400 mt-1">Across active transactions</p>
        </div>
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue Progression</h3>
              <p className="text-xs text-gray-500 mt-0.5">Time-series gross revenue (INR)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF7F2] text-[#8C6D23] rounded-lg border border-[#E8DFC8]">
              ₹{analyticsData.grossSales.toLocaleString()} Total
            </span>
          </div>
          <Chart
            variant="area"
            data={analyticsData.revBuckets}
            color="#C9A84C"
            height={220}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Order Volume Breakdown</h3>
              <p className="text-xs text-gray-500 mt-0.5">Total orders placed per time bucket</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              {analyticsData.totalOrders} Placed
            </span>
          </div>
          <Chart
            variant="bar"
            data={analyticsData.ordBuckets}
            color="#3B82F6"
            height={220}
          />
        </motion.div>
      </div>

      {/* Operational Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fulfillment Pipeline */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Order Fulfillment Status</h3>
          <p className="text-xs text-gray-500 mb-6">Real-time status breakdown across database</p>

          <div className="space-y-4">
            {[
              { key: 'confirmed', label: 'Confirmed Orders', count: analyticsData.statusCounts.confirmed || 0, color: 'bg-blue-500' },
              { key: 'processing', label: 'Processing in Warehouse', count: analyticsData.statusCounts.processing || 0, color: 'bg-yellow-500' },
              { key: 'shipped', label: 'Dispatched & In Transit', count: analyticsData.statusCounts.shipped || 0, color: 'bg-purple-500' },
              { key: 'delivered', label: 'Delivered Successfully', count: analyticsData.statusCounts.delivered || 0, color: 'bg-green-500' },
              { key: 'cancelled', label: 'Cancelled / Returned', count: analyticsData.statusCounts.cancelled || 0, color: 'bg-red-500' },
            ].map((st) => {
              const pct = analyticsData.totalOrders > 0 ? Math.round((st.count / analyticsData.totalOrders) * 100) : 0
              return (
                <div key={st.key}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-700">{st.label}</span>
                    <span className="text-gray-900 font-bold">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`${st.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Payment Methods & Channels */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment Method Distribution</h3>
          <p className="text-xs text-gray-500 mb-6">Shopper payment preferences at checkout</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
              <span className="text-xs font-semibold text-emerald-800">Online Payments</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{analyticsData.onlinePayCount}</p>
              <span className="text-[10px] text-emerald-600 font-medium">UPI / Cards / NetBanking</span>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
              <span className="text-xs font-semibold text-blue-800">Cash on Delivery</span>
              <p className="text-2xl font-bold text-blue-700 mt-1">{analyticsData.codPayCount}</p>
              <span className="text-[10px] text-blue-600 font-medium">Pay on Delivery</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-gray-800">Active Database Connections</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Syncing real Firestore &apos;orders&apos; collection</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              LIVE
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
