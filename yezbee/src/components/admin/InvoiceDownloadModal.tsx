'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, FileSpreadsheet, FileCode, Printer,
  File, FileType, Download, Check, X, Sparkles
} from 'lucide-react'
import { InvoiceData, ExportFormat, exportInvoice } from '@/lib/invoiceExporter'

interface InvoiceDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  order: InvoiceData
}

export default function InvoiceDownloadModal({
  isOpen,
  onClose,
  order
}: InvoiceDownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const formats: {
    id: ExportFormat
    name: string
    ext: string
    description: string
    icon: any
    color: string
    badgeBg: string
  }[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      ext: '.pdf',
      description: 'Printable formatted document with Yezbee branding & GST breakdown',
      icon: FileText,
      color: 'text-red-500',
      badgeBg: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      id: 'excel',
      name: 'Excel / CSV Spreadsheet',
      ext: '.csv',
      description: 'Tabular itemized data ready for Excel & Tally accounting software',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'word',
      name: 'Word Document',
      ext: '.doc',
      description: 'Editable Microsoft Word document layout with headers & styles',
      icon: FileType,
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'html',
      name: 'HTML Web Page',
      ext: '.html',
      description: 'Standalone webpage file with responsive layout & print button',
      icon: FileCode,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'txt',
      name: 'Plain Text File',
      ext: '.txt',
      description: 'Clean ASCII formatted text summary file for quick text logs',
      icon: File,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'json',
      name: 'JSON Data Object',
      ext: '.json',
      description: 'Structured raw JSON data schema for API & system integrations',
      icon: FileCode,
      color: 'text-gray-700',
      badgeBg: 'bg-gray-100 text-gray-700 border-gray-300'
    }
  ]

  const handleDownloadFormat = (fmt: ExportFormat) => {
    setDownloading(true)
    try {
      exportInvoice(order, fmt)
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2000)
    } catch (err) {
      console.error('Invoice export error:', err)
    } finally {
      setDownloading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Download size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  Download Invoice #{order.id}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select your preferred document format to download
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Formats Grid */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((fmt) => {
                const Icon = fmt.icon
                const isSelected = selectedFormat === fmt.id
                return (
                  <motion.div
                    key={fmt.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C9A84C] bg-[#FAF7F2] shadow-md ring-2 ring-[#C9A84C]/20'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className={fmt.color} />
                          <span className="text-sm font-semibold text-gray-900">{fmt.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${fmt.badgeBg}`}>
                          {fmt.ext}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        {fmt.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
                      <span className="text-[11px] text-[#C9A84C] font-medium flex items-center gap-1">
                        <Sparkles size={11} /> Format Ready
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadFormat(fmt.id)
                        }}
                        className="px-3 py-1 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download size={12} />
                        Download
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#FAF7F2] border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => handleDownloadFormat('pdf')}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Printer size={14} className="text-gray-500" />
              Quick Print PDF
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadFormat(selectedFormat)}
                disabled={downloading}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl transition-all shadow-md shadow-[#C9A84C]/20 flex items-center gap-2"
              >
                {downloadSuccess ? (
                  <>
                    <Check size={14} /> Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={14} /> Download ({selectedFormat.toUpperCase()})
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
