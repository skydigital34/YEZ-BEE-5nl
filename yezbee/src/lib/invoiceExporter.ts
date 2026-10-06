export interface InvoiceItem {
  id: string | number
  name: string
  sku?: string
  size?: string
  color?: string
  meta?: {
    size?: string
    color?: string
    [key: string]: any
  }
  price: number
  quantity: number
  image?: string
}

export interface InvoiceCustomer {
  name: string
  email?: string
  phone?: string
  joinedDate?: string
}

export interface InvoiceAddress {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface InvoiceData {
  id: string
  date: string
  status: string
  payment: string
  paymentMethod: string
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
  notes?: string
  customer: InvoiceCustomer
  shippingAddress: InvoiceAddress
  billingAddress?: InvoiceAddress
  items: InvoiceItem[]
}

export type ExportFormat = 'pdf' | 'excel' | 'word' | 'html' | 'txt' | 'json'

export const COMPANY_INFO = {
  name: 'YEZBEE FASHION',
  tagline: 'Elegance Redefined',
  gstin: '36AABCY1234F1Z9',
  address: '42, Luxe Towers, Jubilee Hills',
  city: 'Hyderabad, Telangana - 500033',
  country: 'India',
  phone: '+91 98765 43210',
  email: 'billing@yezbee.com',
  website: 'www.yezbee.com'
}

/**
 * Trigger browser file download for text/blob data
 */
function downloadBlob(content: BlobPart, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate formatted HTML string for Invoice (Used for HTML download, Word document export, and PDF printing)
 */
export function generateInvoiceHTML(order: InvoiceData): string {
  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const itemRows = order.items.map((item, idx) => {
    const itemSize = item.size || item.meta?.size || ''
    const itemColor = item.color || item.meta?.color || ''
    return `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 13px;">${idx + 1}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 13px;">
        <span style="font-weight: 600; color: #111827;">${item.name}</span>
        ${itemSize ? `<span style="display: inline-block; background: #FAF7F2; color: #8C6D23; border: 1px solid #E8DFC8; font-size: 11px; font-weight: 600; padding: 1px 6px; border-radius: 4px; margin-left: 8px;">Size: ${itemSize}</span>` : ''}
        ${itemColor ? `<span style="display: inline-block; background: #F3F4F6; color: #4B5563; font-size: 11px; font-weight: 500; padding: 1px 6px; border-radius: 4px; margin-left: 4px;">Color: ${itemColor}</span>` : ''}
        ${item.sku ? `<br><span style="color: #9CA3AF; font-size: 11px;">SKU: ${item.sku}</span>` : ''}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #374151; font-size: 13px;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #374151; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111827; font-size: 13px; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `}).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.id} - ${COMPANY_INFO.name}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; background: #fff !important; color: #000 !important; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1F2937;
      background: #F9FAFB;
      margin: 0;
      padding: 30px 15px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #F3F4F6;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #C9A84C;
      letter-spacing: 1px;
      margin: 0 0 4px 0;
    }
    .brand-sub {
      font-size: 12px;
      color: #6B7280;
      margin: 0;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 28px;
      margin: 0;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .invoice-title p {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #6B7280;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .badge-paid { background: #DEF7EC; color: #03543F; }
    .badge-unpaid { background: #FDE8E8; color: #9B1C1C; }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 30px;
    }
    .section-box {
      background: #FAFAFA;
      border: 1px solid #F3F4F6;
      border-radius: 10px;
      padding: 16px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #C9A84C;
      letter-spacing: 0.5px;
      margin: 0 0 8px 0;
    }
    .info-text {
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #FAF7F2;
      color: #374151;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 10px 12px;
      border-bottom: 2px solid #E5E7EB;
    }
    .summary-table {
      width: 280px;
      margin-left: auto;
      border-collapse: collapse;
    }
    .summary-table td {
      padding: 6px 0;
      font-size: 13px;
    }
    .summary-table .total-row td {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      border-top: 2px solid #E5E7EB;
      padding-top: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #F3F4F6;
      text-align: center;
      font-size: 12px;
      color: #9CA3AF;
    }
    .print-btn {
      background: #C9A84C;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center;">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="invoice-container">
    <div class="header">
      <div>
        <h2 class="brand-title">${COMPANY_INFO.name}</h2>
        <p class="brand-sub">${COMPANY_INFO.tagline}</p>
        <p style="font-size: 12px; color: #6B7280; margin: 6px 0 0 0;">
          GSTIN: ${COMPANY_INFO.gstin}<br>
          ${COMPANY_INFO.address}, ${COMPANY_INFO.city}<br>
          Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}
        </p>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <p><strong>Invoice No:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <span class="badge ${order.payment === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
          Payment: ${order.payment}
        </span>
      </div>
    </div>

    <div class="grid-2">
      <div class="section-box">
        <h3 class="section-title">Billed To</h3>
        <p class="info-text">
          <strong>${order.customer.name}</strong><br>
          ${order.customer.email ? order.customer.email + '<br>' : ''}
          ${order.customer.phone ? order.customer.phone + '<br>' : ''}
        </p>
      </div>
      <div class="section-box">
        <h3 class="section-title">Shipping Address</h3>
        <p class="info-text">
          ${order.shippingAddress.line1}<br>
          ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: center; width: 40px;">#</th>
          <th style="text-align: left;">Item Description</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="max-width: 400px; font-size: 12px; color: #6B7280;">
        <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Online Payment'}</p>
        <p><strong>Order Status:</strong> <span style="text-transform: capitalize;">${order.status}</span></p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      </div>
      <table class="summary-table">
        <tr>
          <td style="color: #6B7280;">Subtotal:</td>
          <td style="text-align: right; font-weight: 500;">₹${order.subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">Shipping:</td>
          <td style="text-align: right; color: #059669; font-weight: 500;">${order.shipping === 0 ? 'Free' : '₹' + order.shipping.toLocaleString('en-IN')}</td>
        </tr>
        ${order.tax ? `
        <tr>
          <td style="color: #6B7280;">Tax (GST):</td>
          <td style="text-align: right; font-weight: 500;">₹${order.tax.toLocaleString('en-IN')}</td>
        </tr>` : ''}
        ${order.discount ? `
        <tr>
          <td style="color: #6B7280;">Discount:</td>
          <td style="text-align: right; color: #059669; font-weight: 500;">-₹${order.discount.toLocaleString('en-IN')}</td>
        </tr>` : ''}
        <tr class="total-row">
          <td>Total Amount:</td>
          <td style="text-align: right; color: #C9A84C;">₹${order.total.toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p>Thank you for shopping with ${COMPANY_INFO.name}! For queries, contact ${COMPANY_INFO.email}</p>
      <p style="margin-top: 4px; font-size: 10px; color: #D1D5DB;">This is a computer-generated invoice and does not require a physical signature.</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * 1. Export as PDF Document
 */
export function exportInvoiceAsPDF(order: InvoiceData) {
  const htmlContent = generateInvoiceHTML(order)
  const printWindow = window.open('', '_blank', 'width=900,height=800')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } else {
    // Fallback if popups are blocked
    downloadBlob(htmlContent, `Invoice_${order.id}.html`, 'text/html')
  }
}

/**
 * 2. Export as Excel / CSV Spreadsheet (.csv)
 */
export function exportInvoiceAsExcel(order: InvoiceData) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-IN')

  let csv = '\uFEFF' // UTF-8 BOM for Excel compatibility
  csv += `INVOICE REPORT - ${COMPANY_INFO.name}\n`
  csv += `Invoice Number,${order.id}\n`
  csv += `Invoice Date,${formattedDate}\n`
  csv += `Order Status,${order.status}\n`
  csv += `Payment Status,${order.payment}\n`
  csv += `Payment Method,"${order.paymentMethod || 'Online'}"\n`
  csv += `Customer Name,"${order.customer.name}"\n`
  csv += `Customer Email,"${order.customer.email || 'N/A'}"\n`
  csv += `Customer Phone,"${order.customer.phone || 'N/A'}"\n`
  csv += `Shipping Address,"${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}"\n`
  csv += `\n`

  csv += `Item S.No,Item Name,Size,Color,SKU,Unit Price (INR),Quantity,Total Amount (INR)\n`
  order.items.forEach((item, idx) => {
    const itemName = item.name.replace(/"/g, '""')
    const size = (item.size || item.meta?.size || '').replace(/"/g, '""')
    const color = (item.color || item.meta?.color || '').replace(/"/g, '""')
    const sku = (item.sku || '').replace(/"/g, '""')
    csv += `${idx + 1},"${itemName}","${size}","${color}","${sku}",${item.price},${item.quantity},${item.price * item.quantity}\n`
  })

  csv += `\n`
  csv += `,,,,,Subtotal,,${order.subtotal}\n`
  csv += `,,,,,Shipping,,${order.shipping}\n`
  csv += `,,,,,Tax,,${order.tax}\n`
  csv += `,,,,,Discount,,${order.discount}\n`
  csv += `,,,,,Grand Total,,${order.total}\n`

  downloadBlob(csv, `Invoice_${order.id}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Bulk export multiple orders to Excel CSV
 */
export function exportBulkOrdersAsExcel(orders: InvoiceData[]) {
  let csv = '\uFEFF'
  csv += `ORDERS & INVOICES REPORT - ${COMPANY_INFO.name}\n\n`
  csv += `Order ID,Date,Customer Name,Email,Phone,Status,Payment,Method,Items Count,Subtotal,Tax,Shipping,Discount,Total Amount\n`

  orders.forEach((o) => {
    const dateStr = new Date(o.date).toLocaleDateString('en-IN')
    const custName = (o.customer.name || '').replace(/"/g, '""')
    const custEmail = (o.customer.email || '').replace(/"/g, '""')
    const custPhone = (o.customer.phone || '').replace(/"/g, '""')
    const payMethod = (o.paymentMethod || '').replace(/"/g, '""')

    csv += `"${o.id}","${dateStr}","${custName}","${custEmail}","${custPhone}","${o.status}","${o.payment}","${payMethod}",${o.items.length},${o.subtotal},${o.tax},${o.shipping},${o.discount},${o.total}\n`
  })

  downloadBlob(csv, `Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * 3. Export as Word Document (.doc / .docx compatible)
 */
export function exportInvoiceAsWord(order: InvoiceData) {
  const htmlContent = generateInvoiceHTML(order)
  const wordHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>`
  const fullContent = `${wordHeader}${htmlContent}</html>`
  downloadBlob(fullContent, `Invoice_${order.id}.doc`, 'application/msword')
}

/**
 * 4. Export as HTML File (.html)
 */
export function exportInvoiceAsHTML(order: InvoiceData) {
  const htmlContent = generateInvoiceHTML(order)
  downloadBlob(htmlContent, `Invoice_${order.id}.html`, 'text/html')
}

/**
 * 5. Export as Plain Text (.txt)
 */
export function exportInvoiceAsTXT(order: InvoiceData) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-IN')
  const border = '='.repeat(60)
  const subBorder = '-'.repeat(60)

  let txt = `${border}\n`
  txt += `                  ${COMPANY_INFO.name.toUpperCase()}\n`
  txt += `               ${COMPANY_INFO.tagline}\n`
  txt += `${border}\n`
  txt += `Invoice No : ${order.id}\n`
  txt += `Date       : ${formattedDate}\n`
  txt += `Status     : ${order.status.toUpperCase()}\n`
  txt += `Payment    : ${order.payment.toUpperCase()} (${order.paymentMethod || 'Online'})\n`
  txt += `${subBorder}\n`
  txt += `CUSTOMER DETAILS:\n`
  txt += `Name  : ${order.customer.name}\n`
  if (order.customer.email) txt += `Email : ${order.customer.email}\n`
  if (order.customer.phone) txt += `Phone : ${order.customer.phone}\n`
  txt += `\nSHIPPING ADDRESS:\n`
  txt += `${order.shippingAddress.line1}\n`
  if (order.shippingAddress.line2) txt += `${order.shippingAddress.line2}\n`
  txt += `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n`
  txt += `${subBorder}\n`
  txt += `ITEMS:\n`
  txt += `No  Item Name                         Qty  Price        Total\n`
  txt += `${subBorder}\n`

  order.items.forEach((item, idx) => {
    const itemSize = item.size || item.meta?.size || ''
    const sizeTag = itemSize ? ` (${itemSize})` : ''
    const num = (idx + 1).toString().padEnd(3, ' ')
    const name = `${item.name}${sizeTag}`.slice(0, 32).padEnd(33, ' ')
    const qty = item.quantity.toString().padEnd(4, ' ')
    const price = `₹${item.price}`.padEnd(12, ' ')
    const total = `₹${item.price * item.quantity}`
    txt += `${num}${name}${qty}${price}${total}\n`
  })

  txt += `${subBorder}\n`
  txt += `Subtotal  : ₹${order.subtotal}\n`
  txt += `Shipping  : ${order.shipping === 0 ? 'Free' : '₹' + order.shipping}\n`
  if (order.tax) txt += `Tax (GST) : ₹${order.tax}\n`
  if (order.discount) txt += `Discount  : -₹${order.discount}\n`
  txt += `TOTAL     : ₹${order.total}\n`
  txt += `${border}\n`
  txt += `Thank you for shopping with ${COMPANY_INFO.name}!\n`
  txt += `${border}\n`

  downloadBlob(txt, `Invoice_${order.id}.txt`, 'text/plain')
}

/**
 * 6. Export as JSON Data (.json)
 */
export function exportInvoiceAsJSON(order: InvoiceData) {
  const jsonContent = JSON.stringify(
    {
      company: COMPANY_INFO,
      invoice: order
    },
    null,
    2
  )
  downloadBlob(jsonContent, `Invoice_${order.id}.json`, 'application/json')
}

/**
 * Unified Export Dispatcher
 */
export function exportInvoice(order: InvoiceData, format: ExportFormat) {
  switch (format) {
    case 'pdf':
      exportInvoiceAsPDF(order)
      break
    case 'excel':
      exportInvoiceAsExcel(order)
      break
    case 'word':
      exportInvoiceAsWord(order)
      break
    case 'html':
      exportInvoiceAsHTML(order)
      break
    case 'txt':
      exportInvoiceAsTXT(order)
      break
    case 'json':
      exportInvoiceAsJSON(order)
      break
    default:
      exportInvoiceAsPDF(order)
  }
}
