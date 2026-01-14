import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Admin {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
}

const AdminList: React.FC = () => {
  const { token, loading: authLoading } = useAuth(); // ✅ USE loading
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_BASE;

  const loadAdmins = async () => {
    if (!token) return;

    setLoading(true);
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

  useEffect(() => {
    if (authLoading) return; // ⛔ wait for auth restore
    if (!token) return;      // ⛔ not logged in
    loadAdmins();
  }, [token, authLoading]);

  if (loading || authLoading) {
    return <div className="text-sm text-slate-400">Loading admins…</div>;
  }

  if (admins.length === 0) {
    return <div className="text-sm text-slate-400">No admins found.</div>;
  }

  return (
    <div className="space-y-3">
      {admins.map(admin => (
        <div
          key={admin.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <p className="font-bold text-slate-800">{admin.name}</p>
            <p className="text-xs text-slate-500">{admin.email}</p>
          </div>

          <button
            onClick={() => toggleAdmin(admin.id)}
            className={`px-3 py-1 text-xs font-bold rounded ${
              admin.enabled
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {admin.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminList;
