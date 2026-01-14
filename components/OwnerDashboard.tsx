import React, { useState } from 'react';
import AdminList from './owner/AdminList';

type OwnerTab = 'admins' | 'audit';

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('admins');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">
          Owner Control Panel
        </h1>
        <p className="text-sm text-slate-500">
          System-level administration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 text-sm font-bold rounded-t ${
            activeTab === 'admins'
              ? 'bg-white border border-b-0'
              : 'text-slate-500'
          }`}
        >
          Admin Management
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-sm font-bold rounded-t ${
            activeTab === 'audit'
              ? 'bg-white border border-b-0'
              : 'text-slate-500'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border rounded-b-xl p-6 shadow-sm">
        {activeTab === 'admins' && (
          <>
            <h2 className="font-bold text-slate-700 mb-1">
              Admin Management
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enable or disable administrators.
            </p>

            <AdminList />
          </>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-2">
            <h2 className="font-bold text-slate-700">
              Audit Logs
            </h2>
            <p className="text-sm text-slate-500">
              Track admin activity and system changes.
            </p>

            <div className="text-xs text-slate-400">
              (Audit logs coming next)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
