'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Search, ChevronDown, Calendar, Download,
  X, Eye, Loader2, CheckCircle2, Truck, PackageCheck, XCircle, Sparkles
} from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import { api } from '@/lib/api'
import InvoiceDownloadDropdown from '@/components/admin/InvoiceDownloadDropdown'
import { InvoiceData, exportBulkOrdersAsExcel } from '@/lib/invoiceExporter'

interface Order {
  id: string
  _id?: string
  date: string
  customer: string
  email: string
  items: number
  rawItems?: any[]
  shippingAddressObj?: any
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  payment: 'paid' | 'unpaid' | 'refunded' | 'partial'
  paymentMethod?: string
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await api.getOrders();
        if (res.success && mounted) {
          const formatted: Order[] = res.data.map((o: any) => ({
            id: o.id || o._id,
            _id: o._id,
            date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : 'Unknown',
            customer: o.shippingAddress ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName || ''}`.trim() : 'Guest',
            email: o.shippingAddress?.email || 'N/A',
            phone: o.shippingAddress?.phone || 'N/A',
            items: Array.isArray(o.items) ? o.items.length : 0,
            rawItems: o.items || [],
            shippingAddressObj: o.shippingAddress || null,
            total: o.totalAmount || 0,
            status: o.status || 'pending',
            payment: o.payment || 'unpaid',
            paymentMethod: o.paymentMethod || 'Online Payment',
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
  
  // Date Range Filter States
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7d' | '30d' | 'month' | 'custom'>('all')
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchesTab = activeTab === 'All' || o.status === activeTab.toLowerCase()
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search)

      const matchesDate = (() => {
        if (dateFilter === 'all') return true
        if (!o.date || o.date === 'Unknown') return false
        
        const now = new Date()
        const orderDate = new Date(o.date)
        const todayStr = now.toISOString().split('T')[0]

        if (dateFilter === 'today') {
          return o.date === todayStr
        }
        if (dateFilter === '7d') {
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(now.getDate() - 7)
          sevenDaysAgo.setHours(0, 0, 0, 0)
          return orderDate >= sevenDaysAgo
        }
        if (dateFilter === '30d') {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(now.getDate() - 30)
          thirtyDaysAgo.setHours(0, 0, 0, 0)
          return orderDate >= thirtyDaysAgo
        }
        if (dateFilter === 'month') {
          return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth()
        }
        if (dateFilter === 'custom') {
          if (customStartDate && o.date < customStartDate) return false
          if (customEndDate && o.date > customEndDate) return false
          return true
        }
        return true
      })()

      return matchesTab && matchesSearch && matchesDate
    })
  }, [allOrders, activeTab, search, dateFilter, customStartDate, customEndDate])

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
    {
      key: 'invoice',
      header: 'Invoice',
      sortable: false,
      render: (row: Order) => {
        const addr = row.shippingAddressObj || {}
        const invoiceData: InvoiceData = {
          id: row.id,
          date: row.date,
          status: row.status,
          payment: row.payment,
          paymentMethod: row.paymentMethod || 'Online Payment',
          subtotal: row.total,
          shipping: 0,
          discount: 0,
          tax: Math.round(row.total * 0.18),
          total: row.total,
          customer: {
            name: row.customer,
            email: row.email,
            phone: row.phone,
          },
          shippingAddress: {
            line1: addr.address1 || 'Customer Address',
            line2: addr.address2 || '',
            city: addr.city || 'Hyderabad',
            state: addr.state || 'Telangana',
            pincode: addr.pincode || '500034',
            country: 'India',
          },
          items: Array.isArray(row.rawItems) && row.rawItems.length > 0
            ? row.rawItems.map((it: any, idx: number) => ({
                id: idx + 1,
                name: it.name || 'Product',
                sku: it.sku || it.product || `SKU-${idx}`,
                size: it.size || it.meta?.size || '',
                color: it.color || it.meta?.color || '',
                meta: it.meta || { size: it.size || '', color: it.color || '' },
                price: it.price || 0,
                quantity: it.quantity || 1,
              }))
            : [
                {
                  id: 1,
                  name: `Order Items (${row.items})`,
                  price: row.total,
                  quantity: 1,
                },
              ],
        }
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <InvoiceDownloadDropdown order={invoiceData} buttonStyle="outline" buttonText="Invoice" />
          </div>
        )
      },
    },
  ]

  const handleExportAll = () => {
    const formatted: InvoiceData[] = filteredOrders.map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status,
      payment: o.payment,
      paymentMethod: 'Online Payment',
      subtotal: o.total,
      shipping: 0,
      discount: 0,
      tax: Math.round(o.total * 0.18),
      total: o.total,
      customer: {
        name: o.customer,
        email: o.email,
        phone: o.phone,
      },
      shippingAddress: {
        line1: 'Customer Address',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        country: 'India',
      },
      items: [
        {
          id: 1,
          name: `Order Items (${o.items})`,
          price: o.total,
          quantity: 1,
        },
      ],
    }))
    exportBulkOrdersAsExcel(formatted)
  }

  const handleBulkStatusChange = async (newStatus: 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one order');
      return;
    }
    const selectedOrders = allOrders.filter(o => selectedIds.includes(o.id));
    const idsToUpdate = selectedOrders.map(o => o._id || o.id);

    setIsProcessingBulk(true);
    try {
      const res = await api.updateBulkOrdersStatus(idsToUpdate, newStatus);
      if (res.success) {
        setAllOrders(prev =>
          prev.map(o => selectedIds.includes(o.id) ? { ...o, status: newStatus } : o)
        );
        showToast(`Successfully marked ${selectedOrders.length} order(s) as ${newStatus}`);
        setSelectedIds([]);
      } else {
        showToast('Failed to update orders: ' + (res.error || 'Unknown error'));
      }
    } catch (e: any) {
      console.error(e);
      showToast('Error updating orders');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleBulkExportSelected = () => {
    const selected = filteredOrders.filter(o => selectedIds.includes(o.id));
    if (selected.length === 0) {
      showToast('Please select at least one order to export');
      return;
    }
    const formatted: InvoiceData[] = selected.map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status,
      payment: o.payment,
      paymentMethod: o.paymentMethod || 'Online Payment',
      subtotal: o.total,
      shipping: 0,
      discount: 0,
      tax: Math.round(o.total * 0.18),
      total: o.total,
      customer: { name: o.customer, email: o.email, phone: o.phone },
      shippingAddress: o.shippingAddressObj || { line1: 'Customer Address', city: 'Hyderabad', state: 'Telangana', pincode: '500034', country: 'India' },
      items: Array.isArray(o.rawItems) && o.rawItems.length > 0
        ? o.rawItems.map((it: any, idx: number) => ({
            id: idx + 1,
            name: it.name || 'Order Item',
            price: it.price || 0,
            quantity: it.quantity || 1
          }))
        : [{ id: 1, name: `Order Items (${o.items})`, price: o.total, quantity: 1 }],
    }));
    exportBulkOrdersAsExcel(formatted);
    showToast(`Exported ${selected.length} order(s) to Excel!`);
  };

  const bulkActions = [
    {
      label: 'Export Selected (Excel)',
      icon: Download,
      action: handleBulkExportSelected,
    },
    {
      label: 'Mark as Confirmed',
      icon: CheckCircle2,
      action: () => handleBulkStatusChange('confirmed'),
    },
    {
      label: 'Mark as Shipped',
      icon: Truck,
      action: () => handleBulkStatusChange('shipped'),
    },
    {
      label: 'Mark as Delivered',
      icon: PackageCheck,
      action: () => handleBulkStatusChange('delivered'),
    },
    {
      label: 'Cancel Orders',
      icon: XCircle,
      action: () => {
        if (selectedIds.length === 0) {
          showToast('Please select at least one order');
          return;
        }
        setShowCancelModal(true);
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filteredOrders.length} orders found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border shadow-sm transition-all ${
                dateFilter !== 'all'
                  ? 'bg-[#F5E6C8]/40 text-[#8C6D23] border-[#C9A84C]'
                  : 'text-gray-600 bg-white border-gray-100 hover:bg-[#FAF7F2]'
              }`}
            >
              <Calendar size={15} className={dateFilter !== 'all' ? 'text-[#C9A84C]' : 'text-gray-400'} />
              <span>
                {dateFilter === 'all' && 'Date Range'}
                {dateFilter === 'today' && 'Today'}
                {dateFilter === '7d' && 'Last 7 Days'}
                {dateFilter === '30d' && 'Last 30 Days'}
                {dateFilter === 'month' && 'This Month'}
                {dateFilter === 'custom' && 'Custom Range'}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDateDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Date Range Dropdown Popover */}
            <AnimatePresence>
              {showDateDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowDateDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Filter by Date</span>
                      {dateFilter !== 'all' && (
                        <button
                          onClick={() => {
                            setDateFilter('all')
                            setCustomStartDate('')
                            setCustomEndDate('')
                            setShowDateDropdown(false)
                          }}
                          className="text-xs text-red-500 hover:underline font-medium"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { key: 'all', label: 'All Time' },
                        { key: 'today', label: 'Today' },
                        { key: '7d', label: 'Last 7 Days' },
                        { key: '30d', label: 'Last 30 Days' },
                        { key: 'month', label: 'This Month' },
                        { key: 'custom', label: 'Custom' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setDateFilter(item.key as any)
                            if (item.key !== 'custom') {
                              setShowDateDropdown(false)
                            }
                          }}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all ${
                            dateFilter === item.key
                              ? 'bg-[#C9A84C] text-white shadow-sm shadow-[#C9A84C]/30'
                              : 'bg-gray-50 text-gray-700 hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {dateFilter === 'custom' && (
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 block mb-1">From Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-gray-500 block mb-1">To Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                          />
                        </div>
                        <button
                          onClick={() => setShowDateDropdown(false)}
                          className="w-full py-2 bg-[#C9A84C] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#B8973B] transition-all"
                        >
                          Apply Range
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl shadow-md shadow-[#C9A84C]/20 transition-all"
          >
            <Download size={15} />
            Export Excel
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

      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Selected Orders</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Are you sure you want to cancel {selectedIds.length} selected order(s)? This action will update their status to Cancelled.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Keep Orders
                </button>
                <button
                  type="button"
                  disabled={isProcessingBulk}
                  onClick={async () => {
                    setShowCancelModal(false);
                    await handleBulkStatusChange('cancelled');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50"
                >
                  {isProcessingBulk ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
