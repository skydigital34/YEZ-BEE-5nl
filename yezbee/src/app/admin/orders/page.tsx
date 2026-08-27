'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, ChevronDown, Calendar, Download,
  X, Eye, Loader2
} from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import { api } from '@/lib/api'

interface Order {
  id: string
  _id?: string
  date: string
  customer: string
  email: string
  items: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  payment: 'paid' | 'unpaid' | 'refunded' | 'partial'
  phone: string
}


const statusTabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

const statusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  returned: 'bg-gray-100 text-gray-700 border-gray-200',
}

const paymentColors: Record<string, string> = {
  paid: 'text-green-600',
  unpaid: 'text-orange-600',
  refunded: 'text-red-600',
  partial: 'text-blue-600',
}

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await api.getOrders();
        if (res.success && mounted) {
          const formatted = res.data.map((o: any) => ({
            id: o.id || o._id,
            _id: o._id,
            date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : 'Unknown',
            customer: o.shippingAddress ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}` : 'Guest',
            email: o.shippingAddress?.email || 'N/A',
            phone: o.shippingAddress?.phone || 'N/A',
            items: Array.isArray(o.items) ? o.items.length : 0,
            total: o.totalAmount || 0,
            status: o.status || 'pending',
            payment: o.payment || 'unpaid',
          }));
          setAllOrders(formatted);
        }
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchesTab = activeTab === 'All' || o.status === activeTab.toLowerCase()
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search)
      return matchesTab && matchesSearch
    })
  }, [activeTab, search])

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (row: Order) => (
        <Link href={`/admin/orders/${row.id}`} className="text-sm font-medium text-[#C9A84C] hover:underline">
          {row.id}
        </Link>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (row: Order) => (
        <span className="text-sm text-gray-600">{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (row: Order) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.customer}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      sortable: true,
      render: (row: Order) => (
        <span className="text-sm text-gray-600">{row.items}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (row: Order) => (
        <span className="text-sm font-semibold text-gray-900">₹{row.total.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: Order) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${statusColors[row.status] || ''}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      sortable: true,
      render: (row: Order) => (
        <span className={`text-xs font-medium capitalize ${paymentColors[row.payment] || ''}`}>
          {row.payment}
        </span>
      ),
    },
  ]

  const bulkActions = [
    { label: 'Mark as Confirmed', icon: Eye, action: () => {} },
    { label: 'Mark as Shipped', icon: Eye, action: () => {} },
    { label: 'Mark as Delivered', icon: Eye, action: () => {} },
    { label: 'Cancel Orders', icon: X, action: () => {} },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filteredOrders.length} orders found</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-[#FAF7F2] transition-all">
            <Calendar size={15} />
            Date Range
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-[#FAF7F2] transition-all">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:flex-initial sm:ml-auto w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-sm text-gray-700 placeholder-gray-400 border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-transparent transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(row) => row.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        onRowClick={(row) => window.location.href = `/admin/orders/${row.id}`}
        pageSize={10}
      />
    </motion.div>
  )
}
