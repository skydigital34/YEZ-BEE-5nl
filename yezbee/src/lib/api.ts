import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { extractErrorMessage } from './utils';
import { getAllProducts } from '@/data/products';


export const getBaseApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return envUrl || 'http://localhost:5000/api/v1';
};


const BASE_URL = getBaseApiUrl();

interface TokenResponse {
  access: string;
  refresh: string;
}

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API REQUEST]', {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
      });
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('yezbee-auth-token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const serverMessage = extractErrorMessage(error.response?.data) || extractErrorMessage(error, '');
    if (serverMessage && typeof serverMessage === 'string' && !serverMessage.includes('[object Object]')) {
      error.message = serverMessage;
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('yezbee-refresh-token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post<TokenResponse>(`${BASE_URL}/auth/refresh`, {
          refresh: refreshToken,
        });

        localStorage.setItem('yezbee-auth-token', data.access);
        if (data.refresh) {
          localStorage.setItem('yezbee-refresh-token', data.refresh);
        }

        processQueue(null, data.access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('yezbee-auth-token');
        localStorage.removeItem('yezbee-refresh-token');
        localStorage.removeItem('yezbee-user');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  productType?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  sizes?: string;
  fabric?: string;
  fit?: string;
  occasion?: string;
  brand?: string;
  tags?: string;
  featured?: boolean | string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface AdminProductFilters extends ProductFilters {
  status?: string;
  inventory?: string;
}

export const api = {
  checkHealth: () =>
    apiClient
      .get<{ success: boolean; message: string; timestamp?: string }>('/health')
      .then((r) => r.data)
      .catch(() =>
        apiClient
          .get<{ success: boolean; message: string; timestamp?: string }>('/api/health')
          .then((r) => r.data)
      ),

  getProducts: async (filters?: ProductFilters) => {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: products, pagination: { page: 1, limit: 200, total: products.length, totalPages: 1, hasNext: false, hasPrev: false } };
    } catch (e) {
      console.error("Firebase getProducts error", e);
      return { success: false, data: [] };
    }
  },

  getProduct: async (slug: string) => {
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { _id: doc.id, id: doc.id, ...doc.data() } };
      }
      return null;
    } catch (err: any) {
      return null;
    }
  },

  getProductById: async (id: string) => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        return { success: true, data: { _id: docSnap.id, id: docSnap.id, ...docSnap.data() } };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  searchProducts: (query: string, filters?: ProductFilters) =>
    apiClient
      .get<PaginatedResponse<any>>('/products/search', { params: { q: query, ...filters } })
      .then((r) => r.data)
      .catch(() => ({ success: false, data: [] })),

  getFeaturedProducts: () =>
    apiClient.get<ApiResponse<any[]>>('/products/featured').then((r) => r.data).catch(() => ({ success: false, data: [] })),

  getCategories: () =>
    apiClient.get<ApiResponse<any[]>>('/categories').then((r) => r.data).catch(() => ({ success: false, data: [] })),

  getCategory: (slug: string) =>
    apiClient.get<ApiResponse<any>>(`/categories/${slug}`).then((r) => r.data).catch(() => null),

  getCategoryProducts: (slug: string, params?: ProductFilters) =>
    apiClient.get<ApiResponse<any>>(`/categories/${slug}/products`, { params }).then((r) => r.data).catch(() => ({ success: false, data: [] })),

  getAdminProducts: async (filters?: AdminProductFilters) => {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      return { success: true, data: products, pagination: { page: 1, limit: 200, total: products.length, totalPages: 1, hasNext: false, hasPrev: false } };
    } catch (e) {
      console.error("Firebase getAdminProducts error", e);
      return { success: false, data: [] };
    }
  },

  getAdminStats: () =>
    apiClient.get<ApiResponse<any>>('/products/admin/stats').then((r) => r.data).catch(() => ({ success: false, data: null })),

  createProduct: async (data: any) => {
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      
      // Remove any undefined values which Firestore doesn't accept
      const cleanData = JSON.parse(JSON.stringify(data));
      
      const docRef = await addDoc(collection(db, 'products'), {
        ...cleanData,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: { ...cleanData, id: docRef.id, _id: docRef.id } };
    } catch (e) {
      console.error("Firebase createProduct error", e);
      throw e;
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      const docRef = doc(db, 'products', id);
      
      // Remove any undefined values which Firestore doesn't accept
      const cleanData = JSON.parse(JSON.stringify(data));
      
      await setDoc(docRef, { ...cleanData, updatedAt: new Date().toISOString() }, { merge: true });
      return { success: true, data: cleanData };
    } catch(e) {
      console.error("Firebase updateProduct error", e);
      throw e;
    }
  },

  updateProductStock: (id: string, stock: number, variantSku?: string) =>
    apiClient.patch<ApiResponse<any>>(`/products/${id}/stock`, { stock, variantSku }).then((r) => r.data),

  updateProductStatus: (id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
    apiClient.patch<ApiResponse<any>>(`/products/${id}/status`, { status }).then((r) => r.data),

  archiveProduct: (id: string) =>
    apiClient.patch<ApiResponse<any>>(`/products/${id}/archive`).then((r) => r.data),

  deleteProduct: async (id: string) => {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      await deleteDoc(doc(db, 'products', id));
      return { success: true, data: null };
    } catch (e) {
      console.error("Firebase deleteProduct error", e);
      throw e;
    }
  },

  uploadProductImage: async (file: File, category?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (category) {
      formData.append('category', category);
    }
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json;
  },

  uploadProductImages: async (files: File[], category?: string) => {
    // Note: Since our /api/upload route takes single files, we can just map and upload in parallel 
    // or modify it to accept multiple. Parallel single uploads are usually fine.
    const uploads = files.map(file => api.uploadProductImage(file, category));
    const results = await Promise.all(uploads);
    return { success: true, data: results.map(r => r.data) };
  },

  deleteProductImage: async (publicId: string) => {
    const res = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Delete failed');
    return json;
  },

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: any; access: string; refresh: string }>>('/auth/login', {
      email,
      password,
    }).then((r) => r.data),

  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: any; access: string; refresh: string }>>('/auth/register', data).then((r) => r.data),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<any>>('/auth/profile').then((r) => r.data),

  updateProfile: (data: Partial<any>) =>
    apiClient.put<ApiResponse<any>>('/auth/profile', data).then((r) => r.data),

  createOrder: (data: any) =>
    apiClient.post<ApiResponse<any>>('/orders', data).then((r) => r.data),

  createRazorpayOrder: async (data: { amount: number; currency?: string }) => {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create Razorpay order');
    return json;
  },

  verifyPayment: async (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to verify payment');
    return json;
  },

  getOrders: (page?: number) =>
    apiClient.get<PaginatedResponse<any>>('/orders', { params: { page } }).then((r) => r.data),

  getOrder: (id: string) =>
    apiClient.get<ApiResponse<any>>(`/orders/${id}`).then((r) => r.data),

  addToCart: (data: { productId: string; variantId: string; quantity: number }) =>
    apiClient.post<ApiResponse<any>>('/cart', data).then((r) => r.data),

  getCart: () =>
    apiClient.get<ApiResponse<any>>('/cart').then((r) => r.data),

  updateCart: (id: string, data: { quantity: number }) =>
    apiClient.put<ApiResponse<any>>(`/cart/${id}`, data).then((r) => r.data),

  removeFromCart: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/cart/${id}`).then((r) => r.data),

  addToWishlist: (productId: string) =>
    apiClient.post<ApiResponse<any>>('/wishlist', { productId }).then((r) => r.data),

  removeFromWishlist: (productId: string) =>
    apiClient.delete<ApiResponse<null>>(`/wishlist/${productId}`).then((r) => r.data),

  getWishlist: () =>
    apiClient.get<ApiResponse<any[]>>('/wishlist').then((r) => r.data),

  applyCoupon: (code: string, subtotal: number) =>
    apiClient.post<ApiResponse<{ discount: number; code: string }>>('/coupons/apply', {
      code,
      subtotal,
    }).then((r) => r.data),

  validateCoupon: (code: string) =>
    apiClient.get<ApiResponse<any>>(`/coupons/${code}/validate`).then((r) => r.data),

  getReviews: (productId: string, page?: number) =>
    apiClient
      .get<PaginatedResponse<any>>(`/products/${productId}/reviews`, { params: { page } })
      .then((r) => r.data),

  addReview: (productId: string, data: { rating: number; title?: string; body?: string }) =>
    apiClient
      .post<ApiResponse<any>>(`/products/${productId}/reviews`, data)
      .then((r) => r.data),
};

export default apiClient;
