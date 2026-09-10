import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, UserPlus } from 'lucide-react';

export default function ShareModal({ doc, currentUser, onClose }) {
  const [users, setUsers] = useState([]);
  const [shares, setShares] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [doc.id]);

  async function fetchData() {
    const [{ data: allUsers }, { data: sharedList }] = await Promise.all([
      supabase.from('app_users').select('*').neq('id', currentUser.id),
      supabase.from('document_shares').select('*, app_users(*)').eq('document_id', doc.id)
    ]);
    if (allUsers) setUsers(allUsers);
    if (sharedList) setShares(sharedList);
  }

  async function handleShare() {
    if (!selectedUser) return;
    setLoading(true);
    const { error } = await supabase.from('document_shares').insert({
      document_id: doc.id,
      shared_with_user_id: selectedUser
    });
    if (error) alert("Failed to share: " + error.message);
    else {
      setSelectedUser('');
      fetchData();
    }
    setLoading(false);
  }

  async function handleUnshare(shareId) {
    await supabase.from('document_shares').delete().eq('id', shareId);
    fetchData();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-stone-900">Share "{doc.title}"</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">Select team member...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button
            onClick={handleShare}
            disabled={!selectedUser || loading}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" /> Share
          </button>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">People with access</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg text-sm">
              <span className="font-medium text-stone-800">{currentUser.name} (You)</span>
              <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded">Owner</span>
            </div>
            {shares.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg text-sm">
                <span className="text-stone-800">{s.app_users?.name || 'User'}</span>
                <button
                  onClick={() => handleUnshare(s.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}