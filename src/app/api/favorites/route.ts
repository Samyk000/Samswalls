/**
 * Favorites API Route
 * 
 * GET: Get user's favorites
 * POST: Add wallpaper to favorites
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/favorites
 * Get user's favorites list
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    // Get favorites with wallpaper details
    const { data: favorites, error } = await supabase
      .from('user_likes')
      .select(`
        id,
        wallpaper_id,
        created_at,
        wallpapers (
          id,
          title,
          image_url,
          thumbnail_url,
          is_premium
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch favorites' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: favorites,
      meta: {
        total: favorites?.length || 0,
      },
    });
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Add wallpaper to favorites
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in' } },
        { status: 401 }
      );
    }

    // Get wallpaper ID from request body
    const body = await request.json();
    const { wallpaperId } = body;

    if (!wallpaperId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELD', message: 'Wallpaper ID is required' } },
        { status: 400 }
      );
    }

    // Check if wallpaper exists
    const { data: wallpaper, error: wallpaperError } = await supabase
      .from('wallpapers')
      .select('id')
      .eq('id', wallpaperId)
      .is('deleted_at', null)
      .single();

    if (wallpaperError || !wallpaper) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Wallpaper not found' } },
        { status: 404 }
      );
    }

    // Add to favorites (upsert to handle duplicates)
    const { data: favorite, error } = await supabase
      .from('user_likes')
      .upsert({
        user_id: user.id,
        wallpaper_id: wallpaperId,
      }, {
        onConflict: 'user_id,wallpaper_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INSERT_ERROR', message: 'Failed to add favorite' } },
        { status: 500 }
      );
    }

    // Increment like count on wallpaper
    await supabase.rpc('increment_like_count', { wallpaper_id: wallpaperId });

    return NextResponse.json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
