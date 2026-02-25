import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
}

const AdminList: React.FC = () => {
  const { token, loading: authLoading } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE;

  // 🔹 Load admins
  const loadAdmins = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/owner/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.warn('Admin API error:', res.status);
        setAdmins([]);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        setAdmins([]);
        return;
      }

      setAdmins(data);
    } catch (err) {
      console.error('Failed to load admins', err);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle admin status (with optimistic update - NO loading state)
  const toggleAdmin = async (adminId: string) => {
    if (!token) return;

    // 🚀 Optimistic Update: Update UI immediately
    const previousAdmins = admins;
    const updatedAdmins = admins.map(a =>
      a.id === adminId ? { ...a, enabled: !a.enabled } : a
    );
    setAdmins(updatedAdmins);
    setError(null);

    try {
      const res = await fetch(`${API}/api/owner/admins/${adminId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        // ❌ Revert optimistic update on error
        setAdmins(previousAdmins);
        const err = await res.json();
        setError(err.message || 'Action not allowed');
        setTimeout(() => setError(null), 3000);
        return;
      }
    } catch (err) {
      // ❌ Revert optimistic update on error
      setAdmins(previousAdmins);
      console.error('Failed to toggle admin', err);
      setError('Failed to toggle admin status');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete admin (with optimistic update - NO loading state)
  const deleteAdminFunc = async (adminId: string) => {
    if (!token) return;

    // 🚀 Optimistic Update: Remove from UI immediately
    const previousAdmins = admins;
    const updatedAdmins = admins.filter(a => a.id !== adminId);
    setAdmins(updatedAdmins);
    setDeleteConfirm(null);
    setError(null);

    try {
      const res = await fetch(`${API}/api/owner/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        // ❌ Revert optimistic update on error
        setAdmins(previousAdmins);
        const err = await res.json();
        setError(err.message || 'Failed to delete admin');
        setTimeout(() => setError(null), 3000);
        return;
      }
    } catch (err) {
      // ❌ Revert optimistic update on error
      setAdmins(previousAdmins);
      console.error('Failed to delete admin', err);
      setError('Failed to delete admin');
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!token) return;
    loadAdmins();
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="text-sm text-slate-400">Loading admins…</div>;
  }

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.enabled).length;

  return (
    <div className="space-y-4">
      {/* Admin Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-xs font-bold text-blue-600 uppercase">Total Admins</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{totalAdmins}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-xs font-bold text-green-600 uppercase">Active</p>
          <p className="text-2xl font-black text-green-900 mt-1">{activeAdmins}</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-bold">
          {error}
        </div>
      )}

      {/* Admin list */}
      {admins.length === 0 ? (
        <div className="text-sm text-slate-400 py-4">No admins found.</div>
      ) : (
        <div className="space-y-3">
          {admins.map(admin => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
            >
              <div>
                <p className="font-bold text-slate-800">{admin.name}</p>
                <p className="text-xs text-slate-500">{admin.email}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                  admin.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {admin.enabled ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {admin.enabled ? 'Active' : 'Disabled'}
                </span>

                {/* Enable/Disable Button */}
                <button
                  onClick={() => toggleAdmin(admin.id)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                    admin.enabled
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {admin.enabled ? 'Disable' : 'Enable'}
                </button>

                {/* Delete Button */}
                {deleteConfirm === admin.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => deleteAdminFunc(admin.id)}
                      className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-xs font-bold bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(admin.id)}
                    className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded hover:bg-red-600 transition-all flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminList;
