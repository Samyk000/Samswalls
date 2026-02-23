/**
 * Favorites [id] API Route
 * 
 * DELETE: Remove wallpaper from favorites
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/favorites/[id]
 * Remove wallpaper from favorites
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    // Get the favorite to check ownership and get wallpaper_id
    const { data: favorite, error: fetchError } = await supabase
      .from('user_likes')
      .select('id, wallpaper_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !favorite) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Favorite not found' } },
        { status: 404 }
      );
    }

    // Delete the favorite
    const { error: deleteError } = await supabase
      .from('user_likes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error removing favorite:', deleteError);
      return NextResponse.json(
        { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to remove favorite' } },
        { status: 500 }
      );
    }

    // Decrement like count on wallpaper
    await supabase.rpc('decrement_like_count', { wallpaper_id: favorite.wallpaper_id });

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
