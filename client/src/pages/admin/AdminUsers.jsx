import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleAdminUserStatus } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleAdminUserStatus(id);
      if (res.success) {
        setToast({ message: res.message, type: 'success' });
        fetchUsers();
      }
    } catch (err) {
      setToast({ message: 'Failed to update user status.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="bg-ivory border border-gold-300 p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-600" /> Admin Customer Account Directory
          </h1>
          <p className="text-xs text-zinc-500">Manage registered member profiles, permissions & active access controls</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching member directory..." />
      ) : (
        <div className="bg-white border border-gold-300 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-ivory text-zinc-500 uppercase font-bold text-[10px] border-b border-gold-200">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gold-50/40">
                    <td className="p-4 font-serif font-bold text-obsidian text-sm">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.phone}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          u.role === 'ADMIN' ? 'bg-gold-500 text-white' : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            u.isActive
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          {u.isActive ? 'Disable Account' : 'Enable Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
