import { useState } from 'react';
import { storageService } from '../services/storageService';

export default function CreateAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = async () => {
    await storageService.createAdmin({ name, email });
    alert('Admin created');
  };

  return (
    <div>
      <h3>Create Admin</h3>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={submit}>Create</button>
    </div>
  );
}
