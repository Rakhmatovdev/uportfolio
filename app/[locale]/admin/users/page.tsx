'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Shield, Trash2, Edit2, AlertCircle, 
  Check, X, Sparkles, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getUsers, updateUserRole, deleteUser } from '@/actions/adminActions';
import { ROLE_METADATA } from '@/lib/permissions';

export default function UsersAdminPage() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsersList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string) => {
    if (!newRole) return;
    setUpdating(true);
    setError('');
    setSuccess('');

    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      setSuccess('User role successfully updated!');
      setEditingUser(null);
      await loadUsers();
    } else {
      setError(res.error || 'Failed to update user role');
    }
    setUpdating(false);
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete user "${username}"?`)) return;
    
    setError('');
    setSuccess('');

    const res = await deleteUser(userId);
    if (res.success) {
      setSuccess(`User "${username}" has been deleted.`);
      await loadUsers();
    } else {
      setError(res.error || 'Failed to delete user');
    }
  };

  // Filter and search logic
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone && user.phone.includes(search));
      
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination slicing
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const rolesOptions = ['super_admin', 'admin', 'editor', 'moderator', 'user'];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-[var(--admin-accent)]" />
          <span>User Directory</span>
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          Audit and configure user credentials, assign granular security roles, and manage active system logons.
        </p>
      </div>

      {/* FEEDBACK NOTIFICATION FLOATS */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center justify-between"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="cursor-pointer font-bold focus:outline-none"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="cursor-pointer font-bold focus:outline-none"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROL FILTERS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by username, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-sm placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light"
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-neutral-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="h-11 px-4 rounded-xl bg-neutral-200/50 dark:bg-[#0b0f19] border border-neutral-200 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            {rolesOptions.map(opt => (
              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA DIRECTORY GRID TABLE */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading user matrices...</span>
        </div>
      ) : (
        <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md relative flex flex-col gap-6">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/5 text-[10px] uppercase font-bold text-neutral-500 h-10">
                  <th className="px-4">User</th>
                  <th className="px-4">Email</th>
                  <th className="px-4">Phone</th>
                  <th className="px-4">Security Role</th>
                  <th className="px-4">Registered</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500 font-light">No records found matching filters</td>
                  </tr>
                ) : (
                  currentItems.map((user) => {
                    const meta = ROLE_METADATA[user.role as keyof typeof ROLE_METADATA] || ROLE_METADATA.user;
                    const isSelf = editingUser?.id === user.id;

                    return (
                      <tr key={user.id} className="border-b border-neutral-200 dark:border-white/5 h-14 hover:bg-neutral-200/30 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4">
                          <span className="inline-flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-[var(--admin-accent)]/10 text-[10px] text-[var(--admin-accent)] font-extrabold flex items-center justify-center uppercase shrink-0 border border-[var(--admin-accent)]/20 shadow-inner">
                              {user.username.slice(0, 2)}
                            </span>
                            <span className="font-bold text-neutral-950 dark:text-white">{user.username}</span>
                          </span>
                        </td>
                        <td className="px-4 text-neutral-500 dark:text-neutral-400 font-light">{user.email}</td>
                        <td className="px-4 text-neutral-500 dark:text-neutral-400 font-light font-mono">{user.phone || 'N/A'}</td>
                        <td className="px-4">
                          {isSelf ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="h-9 px-3 rounded-lg bg-[#0b0f19] border border-white/10 text-xs font-semibold text-white focus:outline-none cursor-pointer"
                            >
                              {rolesOptions.map(opt => (
                                <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-xl border text-[9px] font-bold uppercase tracking-wider ${meta.color}`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="px-4 text-neutral-500 font-light font-mono">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {isSelf ? (
                              <>
                                <button
                                  onClick={() => handleRoleChange(user.id)}
                                  disabled={updating}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  disabled={updating}
                                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditingUser(user); setNewRole(user.role); }}
                                  className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-900 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all focus:outline-none"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  className="w-8 h-8 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION TOOL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/5 pt-4 text-xs font-semibold text-neutral-500 uppercase">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-4 rounded-xl border border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-4 rounded-xl border border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
