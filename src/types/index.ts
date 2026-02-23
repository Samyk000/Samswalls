// API Response types
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// User types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_banned: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Wallpaper types
export interface Wallpaper {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  image_url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  category_id: string | null;
  created_by: string | null;
  is_premium: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category?: { name: string; slug: string } | null;
}

// Like types
export interface Like {
  id: string;
  wallpaper_id: string;
  user_id: string | null;
  anon_fingerprint: string | null;
  ip_hash: string | null;
  created_at: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  display_name?: string;
}

// Analytics types
export interface AnalyticsEvent {
  event_type: 'view' | 'download' | 'like' | 'unlike';
  wallpaper_id: string;
  user_id?: string;
  anon_fingerprint?: string;
  ip_hash?: string;
  user_agent?: string;
  referrer?: string;
}

// Image upload types
export interface ImageUpload {
  file: File;
  preview?: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  width: number;
  height: number;
  file_size: number;
}
