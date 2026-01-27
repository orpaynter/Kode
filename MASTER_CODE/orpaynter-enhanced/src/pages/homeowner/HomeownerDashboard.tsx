import React from 'react'
import { Home, ClipboardCheck, Calendar, MessageSquare, Tool } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const HomeownerDashboard: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Home Dashboard</h1>
        <p className="text-slate-600">Welcome back, {profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Active Projects</h3>
              <p className="text-slate-500">1 in progress</p>
            </div>
          </div>
          <button className="w-full mt-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            View Details
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Messages</h3>
              <p className="text-slate-500">2 unread from Oliver's Roofing</p>
            </div>
          </div>
          <button className="w-full mt-2 py-2 px-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            Open Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Appointments</h3>
              <p className="text-slate-500">Next: Inspection (Tomorrow, 2pm)</p>
            </div>
          </div>
          <button className="w-full mt-2 py-2 px-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
            Manage Calendar
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Current Project Status</h3>
        
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-slate-200"></div>
          
          <div className="space-y-8">
            <div className="relative flex items-start group">
              <div className="absolute left-0 h-16 w-16 flex items-center justify-center">
                 <div className="h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></div>
              </div>
              <div className="ml-16">
                <h4 className="font-bold text-slate-800">Assessment Completed</h4>
                <p className="text-sm text-slate-500">May 15, 2025</p>
                <p className="mt-2 text-slate-600 bg-slate-50 p-3 rounded-lg">AI detected hail damage. Severity: Moderate.</p>
              </div>
            </div>

            <div className="relative flex items-start group">
              <div className="absolute left-0 h-16 w-16 flex items-center justify-center">
                 <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
              </div>
              <div className="ml-16">
                <h4 className="font-bold text-slate-800">Quote Review</h4>
                <p className="text-sm text-slate-500">Current Stage</p>
                <p className="mt-2 text-slate-600">You have received 3 quotes from verified contractors. Please review and select one.</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Review Quotes</button>
              </div>
            </div>

            <div className="relative flex items-start group">
              <div className="absolute left-0 h-16 w-16 flex items-center justify-center">
                 <div className="h-4 w-4 rounded-full bg-slate-200 ring-4 ring-white"></div>
              </div>
              <div className="ml-16 opacity-50">
                <h4 className="font-bold text-slate-800">Material Delivery</h4>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeownerDashboard
