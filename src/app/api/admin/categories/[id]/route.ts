import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminClient = createAdminClient();
        const { data: userData, error: userError } = await adminClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userError || userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, slug, description, order_index } = body;

        // Optional: check if new slug conflicts
        if (slug) {
            const { data: existing } = await adminClient
                .from('categories')
                .select('id')
                .eq('slug', slug)
                .neq('id', id)
                .single();

            if (existing) {
                return NextResponse.json({ error: 'Another category with this slug already exists' }, { status: 400 });
            }
        }

        const updates: Record<string, any> = {};
        if (name !== undefined) updates.name = name;
        if (slug !== undefined) updates.slug = slug;
        if (description !== undefined) updates.description = description;
        if (order_index !== undefined) updates.order_index = order_index;

        const { data: category, error: updateError } = await adminClient
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminClient = createAdminClient();
        const { data: userData, error: userError } = await adminClient
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userError || userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if category has wallpapers (soft check, deleting might fail foreign key)
        const { count } = await adminClient
            .from('wallpapers')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);

        if (count && count > 0) {
            return NextResponse.json({ error: 'Cannot delete category with existing wallpapers.' }, { status: 400 });
        }

        const { error: deleteError } = await adminClient
            .from('categories')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
