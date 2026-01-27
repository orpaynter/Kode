import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, TrendingUp, Star, Phone, Mail, MapPin, Calendar, AlertTriangle, DollarSign, Shield } from 'lucide-react'
import { supabase, Lead } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface AdminStats {
  total: number
  new: number
  qualified: number
  hot: number
  converted: number
  averageScore: number
  todayCount: number
}

const LeadAdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    new: 0,
    qualified: 0,
    hot: 0,
    converted: 0,
    averageScore: 0,
    todayCount: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    const userStr = localStorage.getItem('admin_user')
    
    if (!token || !userStr) {
      toast.error('Please login to access admin dashboard')
      navigate('/admin/login')
      return
    }
    
    try {
      setAdminUser(JSON.parse(userStr))
    } catch (e) {
      navigate('/admin/login')
      return
    }
    
    loadLeads()
  }, [currentPage, statusFilter])

  const loadLeads = async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.functions.invoke('get-leads', {
        body: {},
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error) {
        throw error
      }

      const responseData = data.data
      setLeads(responseData.leads)
      setStats(responseData.stats)
      setTotalPages(responseData.pagination.pages)
      
    } catch (error: any) {
      console.error('Error loading leads:', error)
      toast.error('Failed to load leads data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'text-red-600'
      case 'severe': return 'text-orange-600'
      case 'moderate': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">OrPaynter Admin</h1>
                <p className="text-sm text-gray-600">Lead Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminUser?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hot}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Leads</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="hot">Hot</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Damage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.contact_name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{lead.contact_email}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{lead.contact_phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{lead.city}, {lead.state}</span>
                      </div>
                      {lead.has_insurance && (
                        <div className="text-sm text-green-600 flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>{lead.insurance_company}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.damage_type}</div>
                      <div className={`text-sm flex items-center space-x-1 ${getSeverityColor(lead.damage_severity)}`}>
                        <AlertTriangle className="h-3 w-3" />
                        <span className="capitalize">{lead.damage_severity}</span>
                        <span>({lead.urgency_level}/10)</span>
                      </div>
                      {lead.budget_range && (
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{lead.budget_range}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold text-blue-600">{lead.lead_score}</div>
                      <div className="text-xs text-gray-500">BANT Score</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.qualification_status)}`}>
                        {lead.qualification_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadAdminDashboard
