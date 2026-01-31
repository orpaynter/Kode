import React, { useState, useEffect } from 'react'
import { Shield, FileText, AlertTriangle, CheckCircle, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Claim {
  id: string
  claim_number: string
  policyholder_id: string
  status: string
  damage_description: string
  estimated_loss: number
  created_at: string
}

const InsuranceDashboard: React.FC = () => {
  const { profile, user } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    newClaims: 0,
    flagged: 0,
    processed: 0,
    accuracy: '98.5%'
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('insurance_claims')
        .select('*')
        .eq('insurance_company_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setClaims(data || [])

      // Calculate stats
      const newClaims = data?.filter(c => c.status === 'submitted').length || 0
      const flagged = data?.filter(c => c.status === 'under_review').length || 0
      const processed = data?.filter(c => ['approved', 'rejected', 'closed'].includes(c.status)).length || 0

      setStats({
        newClaims,
        flagged,
        processed,
        accuracy: '98.5%' // Placeholder for AI accuracy metric
      })

    } catch (error) {
      console.error('Error fetching insurance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
            {/* <span className="text-sm font-medium text-red-600">+8%</span> */}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.newClaims}</h3>
          <p className="text-sm text-slate-500">New Claims</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.flagged}</h3>
          <p className="text-sm text-slate-500">Flagged for Review</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.processed}</h3>
          <p className="text-sm text-slate-500">Processed (Total)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.accuracy}</h3>
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
                <th className="pb-3 font-semibold text-slate-600">Damage Desc</th>
                <th className="pb-3 font-semibold text-slate-600">Est. Loss</th>
                <th className="pb-3 font-semibold text-slate-600">Status</th>
                <th className="pb-3 font-semibold text-slate-600">Date Filed</th>
                <th className="pb-3 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active claims found.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50">
                    <td className="py-4 text-sm font-medium text-slate-800">
                      {claim.claim_number || claim.id.slice(0, 8)}
                    </td>
                    <td className="py-4 text-sm text-slate-600 truncate max-w-xs">
                      {claim.damage_description || 'No description'}
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {claim.estimated_loss ? formatCurrency(claim.estimated_loss) : '-'}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {claim.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InsuranceDashboard
