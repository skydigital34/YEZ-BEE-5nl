'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, FileText, FileSpreadsheet, FileCode,
  FileType, File, Printer, ChevronDown, Check
} from 'lucide-react'
import { InvoiceData, ExportFormat, exportInvoice } from '@/lib/invoiceExporter'

interface InvoiceDownloadDropdownProps {
  order: InvoiceData
  buttonStyle?: 'primary' | 'secondary' | 'outline'
  buttonText?: string
}

export default function InvoiceDownloadDropdown({
  order,
  buttonStyle = 'secondary',
  buttonText = 'Download Invoice'
}: InvoiceDownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: {
    format: ExportFormat
    label: string
    ext: string
    icon: any
    color: string
  }[] = [
    { format: 'pdf', label: 'PDF Document', ext: '.pdf', icon: FileText, color: 'text-red-500' },
    { format: 'excel', label: 'Excel Spreadsheet', ext: '.csv', icon: FileSpreadsheet, color: 'text-emerald-600' },
    { format: 'word', label: 'Word Document', ext: '.doc', icon: FileType, color: 'text-blue-600' },
    { format: 'html', label: 'HTML Web Page', ext: '.html', icon: FileCode, color: 'text-purple-600' },
    { format: 'txt', label: 'Plain Text File', ext: '.txt', icon: File, color: 'text-amber-600' },
    { format: 'json', label: 'JSON Data Schema', ext: '.json', icon: FileCode, color: 'text-gray-700' },
  ]

  const handleSelectFormat = (fmt: ExportFormat) => {
    exportInvoice(order, fmt)
    setLastDownloaded(fmt)
    setIsOpen(false)
    setTimeout(() => setLastDownloaded(null), 2500)
  }

  const getButtonClass = () => {
    switch (buttonStyle) {
      case 'primary':
        return 'bg-[#C9A84C] text-white hover:bg-[#B8973B] shadow-md shadow-[#C9A84C]/20 border border-transparent'
      case 'outline':
        return 'bg-transparent text-gray-700 hover:bg-[#FAF7F2] border border-gray-200 shadow-sm'
      case 'secondary':
      default:
        return 'bg-white text-gray-700 hover:bg-[#FAF7F2] border border-gray-200 shadow-sm'
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${getButtonClass()}`}
      >
        <Download size={14} className={buttonStyle === 'primary' ? 'text-white' : 'text-[#C9A84C]'} />
        <span>{buttonText}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden divide-y divide-gray-50"
          >
            <div className="p-2.5 bg-[#FAF7F2]">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2">
                Download Format
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              {options.map((opt) => {
                const Icon = opt.icon
                const isJustDownloaded = lastDownloaded === opt.format
                return (
                  <button
                    key={opt.format}
                    onClick={() => handleSelectFormat(opt.format)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-[#FAF7F2] rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={`${opt.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium text-gray-800">{opt.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isJustDownloaded ? (
                        <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                          <Check size={12} /> Saved
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-600 bg-gray-50 group-hover:bg-white px-1.5 py-0.5 rounded border border-gray-100">
                          {opt.ext}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-1.5 bg-gray-50/50">
              <button
                onClick={() => {
                  setIsOpen(false)
                  exportInvoice(order, 'pdf')
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#C9A84C] hover:bg-white rounded-xl transition-all"
              >
                <Printer size={13} className="text-gray-500" />
                <span>Print Invoice</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
