import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddAdminModal = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_BASE;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !password) {
      alert('All fields required');
      return;
    }

    setLoading(true);

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
        alert(err.message || 'Failed to create admin');
        setLoading(false);
        return;
      }

      // ✅ Smooth close with parent refresh (no page reload)
      onClose();
    } catch (error) {
      console.error('Failed to create admin:', error);
      alert('Failed to create admin');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80 space-y-3">
        <h3 className="font-bold text-lg">Add Admin</h3>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
