import React, { useState } from 'react';
import AdminList from './owner/AdminList';
import AddAdminModal from './owner/AddAdminModal';
import { Users, Clock, AlertCircle, BarChart3, Calendar, TrendingUp } from 'lucide-react';

type OwnerTab = 'admins' | 'audit';

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('admins');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // ✅ NEW: force AdminList refresh
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Owner Control Panel
            </h1>
            <p className="text-indigo-100 font-bold text-lg">
              System administration and oversight dashboard
            </p>
          </div>
          <div className="hidden md:flex bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <Users className="text-white" size={40} />
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Admin Management</h3>
          </div>
          <p className="text-sm text-slate-600">Create, enable, disable, or remove system administrators</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">System Analytics</h3>
          </div>
          <p className="text-sm text-slate-600">Monitor admin activities and system performance metrics</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest">System Health</h3>
          </div>
          <p className="text-sm text-slate-600">View system status and important alerts</p>
        </div>
      </div>

      {/* TABS WITH ENHANCED STYLING */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-1 flex gap-1 inline-flex shadow-sm">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-6 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'admins'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users size={18} />
          Admin Management
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-6 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock size={18} />
          Audit Logs
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
        {activeTab === 'admins' && (
          <>
            {/* Title + Add Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b-2 border-slate-100">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-black text-slate-900">
                  Admin Management
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-md">
                  Create, enable, disable, or remove administrators. Manage role-based access control and monitor admin activities across the system.
                </p>
              </div>

              <button
                onClick={() => setShowAddAdmin(true)}
                className="px-6 py-3 text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <span>✨</span>
                + Add Admin
              </button>
            </div>

            {/* ✅ KEY forces refetch */}
            <AdminList key={refreshKey} />

            {showAddAdmin && (
              <AddAdminModal
                onClose={() => {
                  setShowAddAdmin(false);
                  setRefreshKey(k => k + 1); // ✅ refresh admins
                }}
              />
            )}
          </>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-6 border-b-2 border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                System Audit Logs
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                Comprehensive audit trail of all administrative actions. Track user activities, role changes, system modifications, and important events with full accountability and compliance.
              </p>
            </div>

            {/* Future Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 mb-2">Coming Soon</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Advanced audit logging features are being developed to provide you with:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Real-time activity monitoring
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Detailed admin action logs
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      System event tracking
                    </li>
                    <li className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Export and compliance reports
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
