import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  TruckIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplier: string;
  lastRestocked: Date;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  estimatedDelivery?: Date;
  shippingAddress: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const products: Product[] = [
    {
      id: 'PRD-001',
      name: 'Asphalt Shingles - Architectural',
      category: 'Roofing',
      sku: 'ASH-ARCH-001',
      price: 89.99,
      stock: 150,
      minStock: 50,
      status: 'in_stock',
      supplier: 'GAF Materials',
      lastRestocked: new Date('2024-01-15')
    },
    {
      id: 'PRD-002',
      name: 'Metal Roofing Panels',
      category: 'Roofing',
      sku: 'MRP-STL-002',
      price: 12.50,
      stock: 25,
      minStock: 100,
      status: 'low_stock',
      supplier: 'Steel Dynamics',
      lastRestocked: new Date('2024-01-10')
    },
    {
      id: 'PRD-003',
      name: 'Gutters - Aluminum 6"',
      category: 'Gutters',
      sku: 'GUT-ALU-003',
      price: 8.75,
      stock: 0,
      minStock: 75,
      status: 'out_of_stock',
      supplier: 'Alcoa Building Products',
      lastRestocked: new Date('2024-01-05')
    },
    {
      id: 'PRD-004',
      name: 'Insulation - Fiberglass R-30',
      category: 'Insulation',
      sku: 'INS-FG-004',
      price: 45.00,
      stock: 200,
      minStock: 50,
      status: 'in_stock',
      supplier: 'Owens Corning',
      lastRestocked: new Date('2024-01-20')
    }
  ];

  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      customerName: 'ABC Roofing Co.',
      customerEmail: 'orders@abcroofing.com',
      customerPhone: '(555) 123-4567',
      items: [
        { productId: 'PRD-001', productName: 'Asphalt Shingles - Architectural', quantity: 50, price: 89.99 },
        { productId: 'PRD-004', productName: 'Insulation - Fiberglass R-30', quantity: 20, price: 45.00 }
      ],
      totalAmount: 5399.50,
      status: 'processing',
      orderDate: new Date('2024-01-22'),
      estimatedDelivery: new Date('2024-01-25'),
      shippingAddress: '123 Industrial Blvd, Construction City, ST 12345',
      priority: 'high'
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Elite Construction',
      customerEmail: 'procurement@eliteconstruction.com',
      customerPhone: '(555) 987-6543',
      items: [
        { productId: 'PRD-002', productName: 'Metal Roofing Panels', quantity: 100, price: 12.50 }
      ],
      totalAmount: 1250.00,
      status: 'pending',
      orderDate: new Date('2024-01-23'),
      shippingAddress: '456 Builder Ave, Contractor Town, ST 67890',
      priority: 'medium'
    }
  ];

  const stats = {
    totalProducts: 1250,
    lowStockItems: 15,
    pendingOrders: 8,
    monthlyRevenue: 125000
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'in_stock':
        return 'text-accent-green';
      case 'shipped':
      case 'processing':
        return 'text-accent-blue';
      case 'pending':
      case 'low_stock':
        return 'text-yellow-400';
      case 'cancelled':
      case 'out_of_stock':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'in_stock':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'shipped':
      case 'processing':
        return <TruckIcon className="h-5 w-5" />;
      case 'pending':
      case 'low_stock':
        return <ClockIcon className="h-5 w-5" />;
      case 'cancelled':
      case 'out_of_stock':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStockStatusColor = (product: Product) => {
    if (product.stock === 0) return 'text-red-400';
    if (product.stock <= product.minStock) return 'text-yellow-400';
    return 'text-accent-green';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Mike!</h1>
            <p className="text-purple-100">
              Manage your inventory, track orders, and optimize your supply chain with real-time analytics and automated reordering.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple bg-opacity-20 rounded-lg flex items-center justify-center">
              <CubeIcon className="h-6 w-6 text-accent-purple" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-white">{stats.lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon className="h-6 w-6 text-accent-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-accent-green bg-opacity-20 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-accent-green" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'inventory', label: 'Inventory', icon: CubeIcon },
            { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
            { id: 'analytics', label: 'Analytics', icon: DocumentArrowDownIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-purple text-accent-purple'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Low Stock Alerts</h2>
              <Link
                to="/inventory?filter=low_stock"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').map(product => (
                <div key={product.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.sku}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                      {getStatusIcon(product.status)}
                      <span className="text-sm capitalize">{product.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-sm font-medium ${getStockStatusColor(product)}`}>
                      Stock: {product.stock} / Min: {product.minStock}
                    </span>
                    <span className="text-sm text-gray-300">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-accent-green hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                      Reorder
                    </button>
                    <button className="px-3 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <Link
                to="/orders"
                className="text-accent-blue hover:text-blue-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="p-4 bg-dark-primary rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-white font-medium">{order.id}</p>
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)}`}></span>
                      </div>
                      <p className="text-sm text-gray-400">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="text-sm capitalize">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-300">
                      ${order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {order.orderDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-accent-purple hover:bg-purple-600 text-white text-sm rounded-lg transition-colors">
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                    <button className="px-3 py-2 bg-accent-green hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                      Process
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Inventory Management</h2>
            <Link
              to="/products/new"
              className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Add Product
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="grid gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent-purple bg-opacity-20 rounded-lg flex items-center justify-center">
                      <CubeIcon className="h-6 w-6 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="capitalize">{product.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-white font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="text-white font-medium">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Stock</p>
                    <p className={`font-medium ${getStockStatusColor(product)}`}>{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Min Stock</p>
                    <p className="text-white font-medium">{product.minStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Restocked</p>
                    <p className="text-white font-medium">{product.lastRestocked.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Supplier</p>
                  <p className="text-gray-300">{product.supplier}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                    Reorder Stock
                  </button>
                  <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Edit Product
                  </button>
                  <button className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Order Management</h2>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                Export Orders
              </button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-6 bg-dark-primary rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-white font-medium">{order.id}</h3>
                      <p className="text-sm text-gray-400">{order.customerName}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></span>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-white font-medium">{order.orderDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-white font-medium">${order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Items</p>
                    <p className="text-white font-medium">{order.items.length} products</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Est. Delivery</p>
                    <p className="text-white font-medium">
                      {order.estimatedDelivery ? order.estimatedDelivery.toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Shipping Address</p>
                  <p className="text-gray-300">{order.shippingAddress}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Order Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.productName}</span>
                        <span className="text-gray-400">Qty: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-accent-green hover:bg-green-600 text-white rounded-lg transition-colors">
                    Process Order
                  </button>
                  <button className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PhoneIcon className="h-4 w-4 inline mr-2" />
                    Contact Customer
                  </button>
                  <button className="px-4 py-2 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
                    <TruckIcon className="h-4 w-4 inline mr-2" />
                    Track Shipment
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Supply Chain Analytics</h3>
            <p className="text-gray-400 mb-6">
              Advanced analytics and reporting features are coming soon. Track inventory trends, sales performance, and supplier metrics.
            </p>
            <button className="px-6 py-3 bg-accent-purple hover:bg-purple-600 text-white rounded-lg transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}