import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadImage } from '@/lib/r2/upload';

/** Maximum file size: 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Allowed image types */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // Check authentication via server client (uses cookies)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || null;
    const categoryId = formData.get('category_id') as string || null;
    const tagsStr = formData.get('tags') as string || '';
    const isPremium = formData.get('is_premium') === 'true';
    const isFeatured = formData.get('is_featured') === 'true';

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate title
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Parse tags
    const tags = tagsStr
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadResult = await uploadImage(buffer, {
      filename: file.name,
      contentType: file.type,
      folder: 'wallpapers',
    });

    // Save to database (use admin client to bypass RLS)
    const { data: wallpaper, error: insertError } = await adminClient
      .from('wallpapers')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        image_url: uploadResult.url,
        thumbnail_url: uploadResult.thumbnailUrl || null,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        file_size: uploadResult.fileSize,
        category_id: categoryId || null,
        created_by: user.id,
        is_premium: isPremium,
        is_featured: isFeatured,
        tags,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save wallpaper to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: wallpaper,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error', stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}
