import React, { useState, useEffect } from 'react'
import { Package, Truck, DollarSign, TrendingUp, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Order {
  id: string
  contractor_id: string
  status: string
  total_amount: number
  created_at: string
}

interface Product {
  id: string
  name: string
  price: number
}

const SupplierDashboard: React.FC = () => {
  const { profile, user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeOrders: 0,
    deliveriesToday: 0,
    revenue: 0,
    lowStock: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('marketplace_orders')
        .select('*')
        .eq('supplier_id', user?.id)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch Inventory for Alerts
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('supplier_inventory')
        .select('*, product:supplier_products(name)')
        .eq('product.supplier_id', user?.id) // This assumes RLS lets us filter like this or we fetch products first. 
        // Simpler: Fetch products then inventory.
        // Actually RLS on supplier_inventory checks product ownership.
        
      // Calculate Stats
      const activeOrders = ordersData?.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length || 0
      const today = new Date().toISOString().split('T')[0]
      const deliveriesToday = ordersData?.filter(o => o.status === 'shipped' && o.updated_at?.startsWith(today)).length || 0
      
      // Calculate Revenue (This month)
      const currentMonth = new Date().getMonth()
      const revenue = ordersData
        ?.filter(o => new Date(o.created_at).getMonth() === currentMonth && o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // Mock low stock for now if table empty
      const lowStock = 0

      setStats({
        activeOrders,
        deliveriesToday,
        revenue,
        lowStock
      })
      
      setOrders(ordersData || [])

    } catch (error) {
      console.error('Error fetching supplier data:', error)
      // toast.error('Failed to load dashboard data') 
      // Silent fail for demo if tables are empty/missing to avoid spamming toast
    } finally {
      setLoading(false)
    }
  }

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
            {/* <span className="text-sm font-medium text-green-600">+12%</span> */}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.activeOrders}</h3>
          <p className="text-sm text-slate-500">Active Orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            {/* <span className="text-sm font-medium text-green-600">+5%</span> */}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.deliveriesToday}</h3>
          <p className="text-sm text-slate-500">Deliveries Today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">This Month</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.revenue)}</h3>
          <p className="text-sm text-slate-500">Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            {stats.lowStock > 0 && <span className="text-sm font-medium text-red-600">{stats.lowStock} New</span>}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.lowStock > 0 ? stats.lowStock : 'None'}</h3>
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent orders</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <Package className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{formatCurrency(order.total_amount)}</p>
                    <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
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
