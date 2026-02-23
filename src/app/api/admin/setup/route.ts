/**
 * Admin Setup API Route
 * 
 * POST /api/admin/setup
 * One-time setup to ensure the admin user has the correct role.
 * Uses the service role key to bypass RLS.
 * Only works for the designated admin email.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ADMIN_EMAIL = 'sameer.amor00@gmail.com';

export async function POST() {
    try {
        // Check authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only the designated admin email can run this
        if (user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Not the admin email' }, { status: 403 });
        }

        const adminClient = createAdminClient();

        // Check if the user already exists in public.users
        const { data: existing } = await adminClient
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .single();

        if (existing) {
            // Update role to admin
            const { error: updateError } = await adminClient
                .from('users')
                .update({ role: 'admin', is_verified: true })
                .eq('id', user.id);

            if (updateError) {
                return NextResponse.json({ error: 'Failed to update role', details: updateError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, action: 'updated', role: 'admin' });
        } else {
            // Create the user entry
            const { error: insertError } = await adminClient
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    display_name: user.email?.split('@')[0] || 'Admin',
                    role: 'admin',
                    is_banned: false,
                    is_verified: true,
                });

            if (insertError) {
                return NextResponse.json({ error: 'Failed to create user', details: insertError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, action: 'created', role: 'admin' });
        }
    } catch (error) {
        console.error('Admin setup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
