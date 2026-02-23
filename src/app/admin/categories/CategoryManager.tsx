'use client';

import { useState } from 'react';
import { toast } from '@/stores/toastStore';
import { Category } from '@/types';

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [orderIndex, setOrderIndex] = useState('');

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setOrderIndex('');
        setCurrentId(null);
        setIsEditMode(false);
    };

    const handleOpenNew = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (c: Category) => {
        resetForm();
        setIsEditMode(true);
        setCurrentId(c.id);
        setName(c.name);
        setSlug(c.slug);
        setDescription(c.description || '');
        setOrderIndex(c.order_index.toString());
        setIsModalOpen(true);
    };

    const handleAutoSlug = (val: string) => {
        setName(val);
        if (!isEditMode) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim()) {
            toast.error('Name and slug are required');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode && currentId) {
                // Edit 
                const res = await fetch(`/api/admin/categories/${currentId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.trim(),
                        slug: slug.trim(),
                        description: description.trim() || null,
                        order_index: parseInt(orderIndex) || 0,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to update category');

                setCategories(prev => prev.map(c => c.id === currentId ? { ...c, ...data.data } : c));
                toast.success('Category updated successfully');
            } else {
                // Add
                const res = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.trim(),
                        slug: slug.trim(),
                        description: description.trim() || null,
                        order_index: parseInt(orderIndex) || 0,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to create category');

                setCategories(prev => [...prev, data.data]);
                toast.success('Category created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, catName: string) => {
        if (!confirm(`Are you sure you want to delete the category "${catName}"?\nNote: You cannot delete categories that contain wallpapers.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to delete category');

            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
                        Categories
                    </h1>
                    <p className="text-text-secondary">
                        Manage your wallpaper categories and collections.
                    </p>
                </div>
                <button
                    onClick={handleOpenNew}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Category
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <div key={category.id} className="group relative overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary/50 p-6 backdrop-blur-xl transition-all hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary mb-1">{category.name}</h3>
                                <p className="text-sm text-text-tertiary">Slug: {category.slug}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-md bg-bg-tertiary border border-border-primary px-2 py-1 text-xs font-medium text-text-secondary">
                                        Order: {category.order_index}
                                    </span>
                                    <span className="inline-flex items-center rounded-md bg-accent-primary/10 border border-accent-primary/20 px-2 py-1 text-xs font-medium text-accent-primary">
                                        {category.image_count || 0} Wallpapers
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenEdit(category)}
                                    className="p-2 text-text-tertiary hover:text-white rounded-lg hover:bg-bg-tertiary border border-transparent hover:border-border-primary transition-all"
                                    title="Edit Category"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id, category.name)}
                                    className="p-2 text-text-tertiary hover:text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                    title="Delete Category"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-border-primary bg-bg-secondary/50 p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border-primary flex items-center justify-center text-text-tertiary mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-1">No Categories</h3>
                        <p className="text-text-secondary">Create your first category to group wallpapers.</p>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-bg-primary border border-border-primary rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-border-primary flex justify-between items-center bg-bg-secondary/50">
                            <h2 className="text-xl font-bold text-text-primary">
                                {isEditMode ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-text-tertiary hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => handleAutoSlug(e.target.value)}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-2.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="e.g. Anime"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-2.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary font-mono text-sm"
                                    placeholder="e.g. anime"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">Description <span className="text-text-tertiary font-normal">(Optional)</span></label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-2.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                                    placeholder="Briefly describe this category"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">Order Index</label>
                                <input
                                    type="number"
                                    value={orderIndex}
                                    onChange={e => setOrderIndex(e.target.value)}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary px-4 py-2.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                                    placeholder="0"
                                />
                                <p className="text-xs text-text-tertiary mt-2">Lower numbers appear first (0, 1, 2...)</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-bg-tertiary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-accent-primary hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-lg shadow-accent-primary/20"
                                >
                                    {loading ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
