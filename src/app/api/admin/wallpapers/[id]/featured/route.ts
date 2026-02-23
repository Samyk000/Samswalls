/**
 * Toggle Wallpaper Featured Status API Route
 * 
 * PATCH /api/admin/wallpapers/[id]/featured
 * Toggles the is_featured status of a wallpaper
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role using admin client (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { is_featured } = body;

    if (typeof is_featured !== 'boolean') {
      return NextResponse.json(
        { error: 'is_featured must be a boolean' },
        { status: 400 }
      );
    }

    // Update wallpaper (use admin client)
    const { error: updateError } = await adminClient
      .from('wallpapers')
      .update({ is_featured, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update wallpaper' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Featured toggle error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
