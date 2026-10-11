'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronRight, ChevronDown,
  Edit2, FolderTree, X, Save,
  ToggleLeft, ToggleRight, Sparkles, Trash2, Plus, AlertTriangle
} from 'lucide-react'
import { YEZBEE_CATEGORIES } from '@/data/categories'
import { getAllProducts } from '@/data/products'

interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  displayOrder: number
  status: 'active' | 'inactive'
  parentId: string | null
  hasFeedingSplit?: boolean
  children: AdminCategory[]
}

const getDefaultCategories = (): AdminCategory[] => {
  const products = getAllProducts()

  return YEZBEE_CATEGORIES.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.slug && p.status === 'published')

    const children: AdminCategory[] = cat.subcategories.map((sub, idx) => {
      const subProducts = catProducts.filter((p) => p.productType === sub.productType)
      return {
        id: sub.id,
        name: sub.name,
        slug: `${cat.slug}/${sub.slug}`,
        description: sub.description,
        image: cat.image,
        productCount: subProducts.length,
        displayOrder: idx + 1,
        status: 'active',
        parentId: cat.id,
        children: [],
      }
    })

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      productCount: catProducts.length,
      displayOrder: cat.sortOrder,
      status: 'active',
      parentId: null,
      hasFeedingSplit: cat.hasFeedingSplit,
      children,
    }
  })
}

function CategoryRow({
  category,
  depth,
  onEdit,
  onDelete,
  onToggleStatus,
  expanded,
  onToggleExpand,
}: {
  category: AdminCategory
  depth: number
  onEdit: (c: AdminCategory) => void
  onDelete: (c: AdminCategory) => void
  onToggleStatus: (c: AdminCategory) => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  const hasChildren = category.children && category.children.length > 0

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-4 py-3.5 hover:bg-[#FAF7F2] transition-colors border-b border-gray-100 group ${
          depth > 0 ? 'bg-amber-50/20' : ''
        }`}
        style={{ paddingLeft: `${16 + depth * 28}px` }}
      >
        <button
          onClick={onToggleExpand}
          className={`p-1 text-gray-400 hover:text-[#C9A84C] transition-colors rounded ${hasChildren ? 'visible' : 'invisible'}`}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className="w-8 h-8 bg-[#F5E6C8]/60 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#C9A84C]/30">
          {category.image ? (
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <FolderTree size={16} className="text-[#C9A84C]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold ${depth === 0 ? 'text-gray-900 uppercase tracking-wide' : 'text-gray-800 font-semibold'}`}>
              {category.name}
            </p>
            <span className="text-xs text-gray-400 font-mono">/category/{category.slug}</span>
            {depth === 0 && category.hasFeedingSplit && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Feeding Split
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                category.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {category.status}
            </span>
          </div>
          {category.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{category.description}</p>
          )}
        </div>

        <div className="text-right px-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {category.productCount} products
          </span>
        </div>

        <button
          onClick={() => onToggleStatus(category)}
          className="text-gray-400 hover:text-[#C9A84C] transition-colors p-1"
          title={category.status === 'active' ? 'Click to deactivate' : 'Click to activate'}
        >
          {category.status === 'active' ? <ToggleRight size={24} className="text-emerald-600" /> : <ToggleLeft size={24} className="text-gray-300" />}
        </button>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 text-gray-400 hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#F5E6C8]/40"
            title="Edit category"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            title="Delete category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {category.children.map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                expanded={false}
                onToggleExpand={() => {}}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(getDefaultCategories)
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['casuals', 'party-wear', 'ethnic-wear', 'lounge-wear', 'peplum-tops', 'kids-wear'])
  )
  const [showModal, setShowModal] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    slug: string
    description: string
    image: string
    parentId: string
    displayOrder: number
    status: 'active' | 'inactive'
  }>({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    displayOrder: 1,
    status: 'active',
  })

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yezbee_admin_categories')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed)
        }
      }
    } catch (e) {
      console.error('Error restoring categories from localStorage:', e)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const persistCategories = (newCats: AdminCategory[]) => {
    setCategories(newCats)
    try {
      localStorage.setItem('yezbee_admin_categories', JSON.stringify(newCats))
    } catch (e) {
      console.error('Error saving categories to localStorage:', e)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    const q = search.toLowerCase().trim()
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.children?.some((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
    )
  }, [categories, search])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleStatus = (target: AdminCategory) => {
    const newStatus: 'active' | 'inactive' = target.status === 'active' ? 'inactive' : 'active'
    const updateStatusRecursively = (list: AdminCategory[]): AdminCategory[] => {
      return list.map((item) => {
        if (item.id === target.id) {
          return { ...item, status: newStatus }
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateStatusRecursively(item.children) }
        }
        return item
      })
    }
    const updated = updateStatusRecursively(categories)
    persistCategories(updated)
    showToast(`Category "${target.name}" status changed to ${newStatus}`)
  }

  const handleDeletePrompt = (cat: AdminCategory) => {
    setDeletingCategory(cat)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!deletingCategory) return
    const removeRecursively = (list: AdminCategory[]): AdminCategory[] => {
      return list
        .filter((item) => item.id !== deletingCategory.id)
        .map((item) => ({
          ...item,
          children: item.children ? removeRecursively(item.children) : [],
        }))
    }
    const updated = removeRecursively(categories)
    persistCategories(updated)
    setShowDeleteModal(false)
    showToast(`Category "${deletingCategory.name}" removed successfully`)
    setDeletingCategory(null)
  }

  const openAddNew = () => {
    setIsAddingNew(true)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: '',
      displayOrder: categories.length + 1,
      status: 'active',
    })
    setShowModal(true)
  }

  const openEdit = (cat: AdminCategory) => {
    setIsAddingNew(false)
    setEditingCategory(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      parentId: cat.parentId || '',
      displayOrder: cat.displayOrder || 1,
      status: cat.status || 'active',
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name')
      return
    }

    const cleanSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    if (isAddingNew) {
      const newCategory: AdminCategory = {
        id: cleanSlug || `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim(),
        image: formData.image.trim(),
        productCount: 0,
        displayOrder: formData.displayOrder || categories.length + 1,
        status: formData.status,
        parentId: formData.parentId || null,
        children: [],
      }

      let updated: AdminCategory[]
      if (formData.parentId) {
        updated = categories.map((c) => {
          if (c.id === formData.parentId) {
            return { ...c, children: [...(c.children || []), newCategory] }
          }
          return c
        })
      } else {
        updated = [...categories, newCategory]
      }

      persistCategories(updated)
      showToast(`Category "${newCategory.name}" created successfully!`)
    } else if (editingCategory) {
      const updateTree = (list: AdminCategory[]): AdminCategory[] => {
        return list.map((item) => {
          if (item.id === editingCategory.id) {
            return {
              ...item,
              name: formData.name.trim(),
              slug: cleanSlug,
              description: formData.description.trim(),
              image: formData.image.trim(),
              status: formData.status,
            }
          }
          if (item.children && item.children.length > 0) {
            return { ...item, children: updateTree(item.children) }
          }
          return item
        })
      }
      const updated = updateTree(categories)
      persistCategories(updated)
      showToast(`Category "${formData.name}" metadata saved!`)
    }

    setShowModal(false)
    setEditingCategory(null)
    setIsAddingNew(false)
  }

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight font-display">Category Architecture</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Manage store categories, parent hierarchies, display banners, and live visibility status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 transition-all"
            />
          </div>
          <button
            onClick={openAddNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#C9A84C] hover:bg-[#B8973B] rounded-xl shadow-md shadow-[#C9A84C]/20 transition-all"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs font-medium text-amber-900 shadow-sm">
        <Sparkles size={18} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Official Category Structure Enforced</p>
          <p className="text-amber-800 mt-0.5">
            Manage visibility toggles and display settings. Changes are saved automatically across the store taxonomy.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
          <span>Category Name / Slug</span>
          <div className="flex items-center gap-8 pr-12">
            <span>Product Count</span>
            <span>Status</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredCategories.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              depth={0}
              onEdit={openEdit}
              onDelete={handleDeletePrompt}
              onToggleStatus={handleToggleStatus}
              expanded={expandedIds.has(cat.id)}
              onToggleExpand={() => toggleExpand(cat.id)}
            />
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No categories match your search.
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                  {isAddingNew ? 'Add New Category' : 'Edit Category Display Settings'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Festival Special"
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-800 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. festival-special (auto-generated if empty)"
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-mono text-gray-600 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {isAddingNew && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parent Category</label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-700 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="">None (Top-Level Category)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Visibility Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-700 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Optional category description..."
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Image / Banner URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-medium text-gray-900 border border-gray-300 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 bg-[#C9A84C] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#B8973B] transition-all"
                >
                  <Save size={16} />
                  Save Category Metadata
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingCategory && (
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Are you sure you want to remove <span className="font-semibold text-gray-800">&quot;{deletingCategory.name}&quot;</span>? This will remove it from the taxonomy and subcategories.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Keep Category
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
