import React from 'react'
import { Package, Truck, DollarSign, TrendingUp, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const SupplierDashboard: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Supplier Dashboard</h1>
        <p className="text-slate-600">Welcome back, {profile?.company || profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">143</h3>
          <p className="text-sm text-slate-500">Active Orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">28</h3>
          <p className="text-sm text-slate-500">Deliveries Today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">$45.2k</h3>
          <p className="text-sm text-slate-500">Revenue (Month)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-red-600">5 New</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Low Stock</h3>
          <p className="text-sm text-slate-500">Alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                    <Package className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Order #{2024000 + i}</p>
                    <p className="text-sm text-slate-500">Elite Roofing Co.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">$1,2{i}0.00</p>
                  <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">Processing</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Market Intelligence</h3>
          <div className="space-y-4">
             <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
               <h4 className="font-medium text-slate-800">Shingle Prices Rising</h4>
               <p className="text-sm text-slate-600 mt-1">Asphalt shingle prices expected to rise 5% next month due to oil price volatility.</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-green-500">
               <h4 className="font-medium text-slate-800">High Demand Alert</h4>
               <p className="text-sm text-slate-600 mt-1">Storm activity in DFW area triggering surge in Class 4 Impact Resistant shingle demand.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierDashboard
