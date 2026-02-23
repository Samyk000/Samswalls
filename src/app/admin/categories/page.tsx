import { createClient } from '@/lib/supabase/server';
import { CategoryManager } from './CategoryManager';
import { Category } from '@/types';

export default async function AdminCategories() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

    // Make sure we pass the correct types to the interactive component
    return <CategoryManager initialCategories={categories as Category[] || []} />;
}
