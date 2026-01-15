import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddAdminModal = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_BASE;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
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
      alert('Failed to create admin');
      return;
    }

    onClose();
    window.location.reload(); // simple refresh
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-80 space-y-3">
        <h3 className="font-bold">Add Admin</h3>

        <input
          placeholder="Name"
          className="border p-2 w-full"
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full"
          onChange={e => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
