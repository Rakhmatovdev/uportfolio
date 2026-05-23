'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, Search, Plus, Trash2, Edit2, AlertCircle, X, Check, 
  ImageIcon, ArrowUp, ArrowDown
} from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon } from '@/components/Icons';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/actions/adminActions';

export default function TeamAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [roleUz, setRoleUz] = useState('');
  const [roleRu, setRoleRu] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(0);
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await getTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRoleUz('');
    setRoleRu('');
    setRoleEn('Principal UI/UX Architect');
    setImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600');
    setOrder(members.length + 1);
    setTwitter('https://twitter.com');
    setGithub('');
    setLinkedin('https://linkedin.com');
    setModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setName(member.name || '');
    setRoleUz(member.roleUz || '');
    setRoleRu(member.roleRu || '');
    setRoleEn(member.roleEn || '');
    setImage(member.image || '');
    setOrder(member.order || 0);
    setTwitter(member.twitter || '');
    setGithub(member.github || '');
    setLinkedin(member.linkedin || '');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      name,
      roleUz: roleUz || roleEn,
      roleRu: roleRu || roleEn,
      roleEn,
      image,
      order: Number(order),
      twitter,
      github,
      linkedin
    };

    let res;
    if (editingMember) {
      res = await updateTeamMember(editingMember.id, payload);
    } else {
      res = await createTeamMember(payload);
    }

    if (res.success) {
      setSuccess(editingMember ? 'Team profile modified successfully!' : 'Team profile published successfully!');
      setModalOpen(false);
      await loadData();
    } else {
      setError(res.error || 'Operation failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently remove "${name}" from team records?`)) return;
    setError('');
    setSuccess('');

    const res = await deleteTeamMember(id);
    if (res.success) {
      setSuccess(`Team member "${name}" removed from records.`);
      await loadData();
    } else {
      setError(res.error || 'Failed to delete');
    }
  };

  const handleShiftOrder = async (index: number, direction: 'UP' | 'DOWN') => {
    const newMembers = [...members];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= members.length) return;

    const tempOrder = newMembers[index].order;
    newMembers[index].order = newMembers[targetIdx].order;
    newMembers[targetIdx].order = tempOrder;

    await updateTeamMember(newMembers[index].id, { order: newMembers[index].order });
    await updateTeamMember(newMembers[targetIdx].id, { order: newMembers[targetIdx].order });
    await loadData();
  };

  // Filter
  const filteredMembers = members.filter(member => {
    return member.name.toLowerCase().includes(search.toLowerCase()) ||
           member.roleEn.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-[var(--admin-accent)]" />
            <span>Team Collective</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            Manage agency personnel records, assign localized department role strings, and connect developer/designer social metrics.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 cursor-pointer hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 font-medium shrink-0 self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Publish Profile</span>
        </button>
      </div>

      {/* FEEDBACK ALERTS */}
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

      {/* FILTER CONTROLS */}
      <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
        <div className="relative flex items-center max-w-md">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-sm placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light"
          />
        </div>
      </div>

      {/* MEMBERS TILES */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading collective catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              layoutId={`mem-${member.id}`}
              className="group p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-4 overflow-hidden"
            >
              {/* Cover cover image */}
              <div className="h-44 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-900 overflow-hidden relative border border-white/5 shadow-inner">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500"><ImageIcon className="w-8 h-8" /></div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate">{member.name}</h3>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed truncate">{member.roleEn}</span>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 mt-1 select-none">
                {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center text-neutral-400 hover:text-white"><TwitterIcon className="w-3.5 h-3.5" /></a>}
                {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center text-neutral-400 hover:text-white"><GithubIcon className="w-3.5 h-3.5" /></a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center text-neutral-400 hover:text-white"><LinkedinIcon className="w-3.5 h-3.5" /></a>}
              </div>

              {/* Reordering buttons */}
              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/5 pt-3 mt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShiftOrder(idx, 'UP')}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShiftOrder(idx, 'DOWN')}
                    disabled={idx === members.length - 1}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-2">Seq: {member.order}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-950 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="w-8 h-8 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* DYNAMIC FORM MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  {editingMember ? 'Edit Team details' : 'Publish New Profile'}
                </span>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer focus:outline-none">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 text-white">
                
                {/* Name & sorting order */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jasur Rahmatov"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sort Order</label>
                    <input
                      type="number"
                      required
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Localized Role labels */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Role Label (EN)</label>
                  <input
                    type="text"
                    required
                    placeholder="Principal Creative Director"
                    value={roleEn}
                    onChange={(e) => setRoleEn(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Role Label (UZ)</label>
                  <input
                    type="text"
                    placeholder="Bosh Kreativ Direktor"
                    value={roleUz}
                    onChange={(e) => setRoleUz(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Role Label (RU)</label>
                  <input
                    type="text"
                    placeholder="Главный креативный директор"
                    value={roleRu}
                    onChange={(e) => setRoleRu(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>

                {/* Avatar cover URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Avatar Image URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>

                {/* Social media anchors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Twitter Link</label>
                    <input
                      type="text"
                      placeholder="https://twitter.com"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">GitHub Link</label>
                    <input
                      type="text"
                      placeholder="https://github.com"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">LinkedIn Link</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50 cursor-pointer text-xs"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{submitting ? 'Transmitting Data...' : editingMember ? 'Save Updates' : 'Publish Profile'}</span>
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
