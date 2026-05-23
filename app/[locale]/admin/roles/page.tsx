'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle2, XCircle, AlertCircle, Sparkles, Check, Save } from 'lucide-react';
import { getRoles, getPermissions, updateRolePermissions } from '@/actions/adminActions';
import { ROLE_METADATA, PERMISSION_METADATA } from '@/lib/permissions';

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mapping of active edits: roleId -> list of permissionIds
  const [editedPermissions, setEditedPermissions] = useState<Record<string, string[]>>({});
  
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [rolesList, permsList] = await Promise.all([
      getRoles(),
      getPermissions()
    ]);
    setRoles(rolesList);
    setPermissions(permsList);

    // Initialize edited permissions mapping
    const mapping: Record<string, string[]> = {};
    rolesList.forEach((role: any) => {
      // Check if permissionIds is stored (JSON DB uses array. PostgreSQL uses relational mapping, parsed in server actions)
      let ids = role.permissionIds || [];
      // Fallback check against hardcoded defaults if not loaded
      if (ids.length === 0 && role.permissions && Array.isArray(role.permissions)) {
        ids = role.permissions.map((p: any) => p.id);
      }
      // If still empty and it has hardcoded maps, we seed
      if (ids.length === 0) {
        const fallbacks: Record<string, string[]> = {
          super_admin: permsList.map((p: any) => p.id),
          admin: permsList.filter((p: any) => ['create', 'update', 'publish', 'manage_content', 'manage_settings'].includes(p.name)).map((p: any) => p.id),
          editor: permsList.filter((p: any) => ['create', 'update', 'publish', 'manage_content'].includes(p.name)).map((p: any) => p.id),
          moderator: permsList.filter((p: any) => ['update', 'manage_content'].includes(p.name)).map((p: any) => p.id),
          user: []
        };
        ids = fallbacks[role.name] || [];
      }
      mapping[role.id] = ids;
    });
    setEditedPermissions(mapping);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePermission = (roleId: string, roleName: string, permId: string) => {
    // Prevent editing super_admin permissions (complete access locked)
    if (roleName === 'super_admin') return;

    const currentIds = editedPermissions[roleId] || [];
    let newIds: string[];
    if (currentIds.includes(permId)) {
      newIds = currentIds.filter(id => id !== permId);
    } else {
      newIds = [...currentIds, permId];
    }

    setEditedPermissions({
      ...editedPermissions,
      [roleId]: newIds
    });
  };

  const handleSavePermissions = async (roleId: string, roleName: string) => {
    setUpdatingRoleId(roleId);
    setError('');
    setSuccess('');

    const ids = editedPermissions[roleId] || [];
    const res = await updateRolePermissions(roleId, ids);

    if (res.success) {
      setSuccess(`Permissions for role "${roleName.replace('_', ' ')}" updated successfully.`);
      await loadData();
    } else {
      setError(res.error || 'Failed to save role permissions');
    }
    setUpdatingRoleId(null);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-[var(--admin-accent)]" />
          <span>Security Matrix Roles</span>
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          Configure security authorization graphs, manage granular action levels, and map RBAC constraints across BEXA Studio nodes.
        </p>
      </div>

      {/* STATUS SYSTEM ALERTS */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center justify-between"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="cursor-pointer font-bold focus:outline-none hover:text-white"><XCircle className="w-4 h-4" /></button>
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
            <button onClick={() => setError('')} className="cursor-pointer font-bold focus:outline-none hover:text-white"><XCircle className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Compiling security matrices...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* SECURITY MATRIX MATRIX */}
          {roles.map((role) => {
            const meta = ROLE_METADATA[role.name as keyof typeof ROLE_METADATA] || ROLE_METADATA.user;
            const isSuperAdmin = role.name === 'super_admin';
            const isSaving = updatingRoleId === role.id;
            const activeIds = editedPermissions[role.id] || [];

            // Detect if permissions have been modified to show "Save" button
            // Compare activeIds with role.permissionIds
            let originalIds = role.permissionIds || [];
            if (originalIds.length === 0 && role.permissions && Array.isArray(role.permissions)) {
              originalIds = role.permissions.map((p: any) => p.id);
            }
            const hasChanged = JSON.stringify([...activeIds].sort()) !== JSON.stringify([...originalIds].sort());

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col gap-6"
              >
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                      {role.name.replace('_', ' ')}
                    </span>
                    {isSuperAdmin && (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5" /> Core Locked
                      </span>
                    )}
                  </div>
                  
                  {!isSuperAdmin && hasChanged && (
                    <button
                      onClick={() => handleSavePermissions(role.id, role.name)}
                      disabled={isSaving}
                      className="h-9 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-lg disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 shrink-0" />
                      <span>{isSaving ? 'Saving Changes...' : 'Save Matrix'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">{meta.description}</p>

                {/* Permissions Check Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {permissions.map((perm) => {
                    const isActive = isSuperAdmin || activeIds.includes(perm.id);
                    const permMeta = PERMISSION_METADATA[perm.name as keyof typeof PERMISSION_METADATA] || { name: perm.name, description: '' };

                    return (
                      <button
                        key={perm.id}
                        type="button"
                        disabled={isSuperAdmin || isSaving}
                        onClick={() => handleTogglePermission(role.id, role.name, perm.id)}
                        className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all relative overflow-hidden group ${
                          isSuperAdmin ? 'cursor-default' : 'cursor-pointer'
                        } ${
                          isActive 
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                            : 'bg-neutral-200/20 dark:bg-white/5 border-neutral-200 dark:border-white/5 text-neutral-400 hover:border-neutral-300 dark:hover:border-white/10 hover:bg-neutral-200/30 dark:hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                            {permMeta.name}
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isActive ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-700 bg-transparent'
                          }`}>
                            {isActive && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-light">{permMeta.description}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
