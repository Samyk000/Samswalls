/**
 * Admin Upload Page
 * 
 * Allows admins to upload new wallpapers with:
 * - Drag & drop image upload
 * - Title, description, category, tags inputs
 * - Premium/featured toggles
 * - Upload to R2, save to database
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/stores/toastStore';

/** Category type for the dropdown */
interface Category {
  id: string;
  name: string;
}

/** Form state for wallpaper upload */
interface WallpaperForm {
  title: string;
  description: string;
  category_id: string;
  tags: string;
  is_premium: boolean;
  is_featured: boolean;
}

/** Initial form state */
const initialForm: WallpaperForm = {
  title: '',
  description: '',
  category_id: '',
  tags: '',
  is_premium: false,
  is_featured: false,
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<WallpaperForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('id, name')
          .order('order_index');
        if (data) setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  /** Handle file selection */
  const handleFile = useCallback((selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  /** Handle drag events */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  /** Handle drop */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  /** Handle file input change */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  /** Handle form field changes */
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }

    if (!form.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);

    try {
      // Create form data for API call
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category_id', form.category_id);
      formData.append('tags', form.tags);
      formData.append('is_premium', String(form.is_premium));
      formData.append('is_featured', String(form.is_featured));

      // Call upload API
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      toast.success('Wallpaper uploaded successfully!');

      // Reset form
      setFile(null);
      setPreview(null);
      setForm(initialForm);

      // Navigate to wallpapers list
      router.push('/admin/wallpapers');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload wallpaper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          Upload Wallpaper
        </h1>
        <p className="text-text-secondary">
          Add a new high-quality wallpaper to the collection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File upload area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300 flex flex-col items-center justify-center text-center
            ${dragActive
              ? 'border-accent-primary bg-accent-primary/10 scale-[1.02]'
              : 'border-border-primary hover:border-accent-primary/50 bg-bg-secondary/30 backdrop-blur-xl'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden border border-border-primary shadow-2xl shadow-accent-primary/10 group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Click to replace
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-bg-tertiary border border-border-primary flex items-center justify-center text-accent-primary mb-6 shadow-xl shadow-bg-primary">
                <svg
                  className="h-10 w-10 transition-transform duration-300 ${dragActive ? 'scale-110' : ''}"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Drop your image here
              </h3>
              <p className="text-sm text-text-tertiary">
                Supports High-Res JPEG, PNG, WebP (Max 10MB)
              </p>
            </div>
          )}
        </div>

        <div className="bg-bg-secondary/50 backdrop-blur-xl border border-border-primary rounded-2xl p-8 space-y-8 shadow-xl">
          {/* Form fields */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-6">
              <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="E.g., Neon Cyberpunk City"
                required
              />

              <Input
                label="Tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="neon, city, dark (comma separated)"
              />
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-3.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all shadow-inner hover:bg-bg-hover"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Description <span className="text-text-tertiary font-normal">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Tell a story about this wallpaper..."
                  className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-3.5 text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all shadow-inner resize-none hover:bg-bg-hover"
                />
              </div>
            </div>
          </div>

          <hr className="border-border-primary" />

          {/* Toggles */}
          <div className="flex flex-wrap gap-8">
            {/* Premium toggle */}
            <label className="group flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-border-primary bg-bg-tertiary/50 hover:bg-bg-hover transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="is_premium"
                  checked={form.is_premium}
                  onChange={handleChange}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-border-primary bg-bg-secondary checked:border-accent-primary checked:bg-accent-primary transition-all"
                />
                <svg
                  className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="block font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  Premium Exclusive
                </span>
                <span className="text-xs text-text-tertiary">Requires active subscription to download</span>
              </div>
            </label>

            {/* Featured toggle */}
            <label className="group flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-border-primary bg-bg-tertiary/50 hover:bg-bg-hover transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-border-primary bg-bg-secondary checked:border-amber-500 checked:bg-amber-500 transition-all"
                />
                <svg
                  className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="block font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                  Featured Content
                </span>
                <span className="text-xs text-text-tertiary">Highlight this wallpaper on the homepage</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!file || !form.title.trim()}
            className="px-10 py-3 shadow-lg shadow-accent-primary/20 text-md font-bold"
          >
            Upload Wallpaper
          </Button>
        </div>
      </form>
    </div>
  );
}
