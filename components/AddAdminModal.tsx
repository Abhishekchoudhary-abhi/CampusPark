import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddAdminModal = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_BASE;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/owner/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'ADMIN',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Failed to create admin');
        setLoading(false);
        return;
      }

      // ✅ Smooth close with parent refresh (no page reload)
      onClose();
    } catch (err) {
      console.error('Failed to create admin:', err);
      setError('Failed to create admin');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-xl">
        <h3 className="font-bold text-lg">Add Admin</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          placeholder="Name"
          className="border border-slate-300 p-2 w-full rounded focus:border-blue-500 focus:outline-none"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Email"
          className="border border-slate-300 p-2 w-full rounded focus:border-blue-500 focus:outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Password"
          type="password"
          className="border border-slate-300 p-2 w-full rounded focus:border-blue-500 focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
