import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminUsers() {
    const adminClient = createAdminClient();

    // Fetch users with admin client to bypass RLS
    const { data: users } = await adminClient
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
                        Users
                    </h1>
                    <p className="text-text-secondary">
                        Manage user accounts, roles, and permissions.
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-primary bg-bg-tertiary/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary/50">
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-bg-hover/50 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
                                                    {user.email?.[0].toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary">{user.display_name || 'User'}</p>
                                                    <p className="text-sm text-text-tertiary">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-1 text-xs font-semibold text-accent-primary">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-tertiary border border-border-primary px-2.5 py-1 text-xs font-semibold text-text-secondary">
                                                    <svg className="w-3 h-3 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-secondary">
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <button className="text-sm text-accent-primary hover:text-white transition-colors">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="font-medium text-text-secondary">No users found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
