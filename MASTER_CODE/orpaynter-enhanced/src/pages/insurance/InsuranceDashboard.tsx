import React from 'react'
import { Shield, FileText, AlertTriangle, CheckCircle, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const InsuranceDashboard: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Insurance Portal</h1>
        <p className="text-slate-600">Welcome back, {profile?.company || profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-red-600">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">42</h3>
          <p className="text-sm text-slate-500">New Claims</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">15</h3>
          <p className="text-sm text-slate-500">Flagged for Review</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">128</h3>
          <p className="text-sm text-slate-500">Processed (Month)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
          <p className="text-sm text-slate-500">Accuracy Score</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Active Claims Queue</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search claims..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="pb-3 font-semibold text-slate-600">Claim ID</th>
                <th className="pb-3 font-semibold text-slate-600">Policyholder</th>
                <th className="pb-3 font-semibold text-slate-600">Damage Type</th>
                <th className="pb-3 font-semibold text-slate-600">Severity</th>
                <th className="pb-3 font-semibold text-slate-600">Est. Cost</th>
                <th className="pb-3 font-semibold text-slate-600">Status</th>
                <th className="pb-3 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-4 text-sm font-medium text-slate-800">CLM-2024-{100+i}</td>
                  <td className="py-4 text-sm text-slate-600">John Doe {i}</td>
                  <td className="py-4 text-sm text-slate-600">Hail / Wind</td>
                  <td className="py-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Severe</span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">$1{i},500</td>
                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Under Review</span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InsuranceDashboard
