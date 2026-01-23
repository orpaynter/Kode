import { useState } from 'react'
import { Home, Upload, MessageSquare, BarChart3, Settings as SettingsIcon, UserPlus, Menu } from 'lucide-react'
import './App.css'
import ImageUpload from './components/assessment/ImageUpload'
import BANTQualification from './components/bant/BANTQualification'
import Settings from './components/layout/Settings'

function App() {
  const [selectedTab, setSelectedTab] = useState('home')

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <div className="bg-orpaynter-deep-blue text-white rounded-md p-2">
            <span className="font-bold">OrP</span>
          </div>
          <h1 className="text-xl font-bold text-orpaynter-deep-blue">OrPaynter™</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setSelectedTab('home')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'home' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setSelectedTab('assessment')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'assessment' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <Upload className="w-5 h-5" />
            <span>Assessment</span>
          </button>
          
          <button 
            onClick={() => setSelectedTab('bant')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'bant' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Lead Qualification</span>
          </button>
          
          <button 
            onClick={() => setSelectedTab('reports')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'reports' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Reports</span>
          </button>
          
          <button 
            onClick={() => setSelectedTab('contractors')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'contractors' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Contractors</span>
          </button>
        </nav>
        
        <div className="pt-4">
          <button 
            onClick={() => setSelectedTab('settings')}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg ${selectedTab === 'settings' ? 'bg-orpaynter-deep-blue text-white' : 'hover:bg-white/60'}`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Header */}
        <header className="glass-panel mb-4 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-orpaynter-cool-gray">
              {selectedTab === 'home' && 'Dashboard'}
              {selectedTab === 'assessment' && 'Roof Damage Assessment'}
              {selectedTab === 'bant' && 'Lead Qualification'}
              {selectedTab === 'reports' && 'Reports & Analytics'}
              {selectedTab === 'contractors' && 'Contractor Management'}
              {selectedTab === 'settings' && 'Settings'}
            </h2>
          </div>
          
          <div className="glass-panel py-2 px-4 rounded-full">
            <span className="text-sm font-medium">Professional License</span>
          </div>
        </header>
        
        {/* Dashboard content */}
        <div className="glass-panel p-6">
          {selectedTab === 'home' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-orpaynter-deep-blue">Welcome to OrPaynter™</h1>
              <p className="text-orpaynter-cool-gray">
                Your comprehensive solution for roof damage assessment and lead qualification.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="glass-panel p-4">
                  <h3 className="font-semibold text-orpaynter-deep-blue">Assessments</h3>
                  <div className="text-3xl font-bold mt-2">0</div>
                  <p className="text-sm text-gray-500">Roof assessments completed</p>
                </div>
                
                <div className="glass-panel p-4">
                  <h3 className="font-semibold text-orpaynter-bright-amber">Leads</h3>
                  <div className="text-3xl font-bold mt-2">0</div>
                  <p className="text-sm text-gray-500">Qualified leads generated</p>
                </div>
                
                <div className="glass-panel p-4">
                  <h3 className="font-semibold text-orpaynter-success-green">Contractors</h3>
                  <div className="text-3xl font-bold mt-2">0</div>
                  <p className="text-sm text-gray-500">Active contractors</p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  className="btn-primary"
                  onClick={() => setSelectedTab('assessment')}
                >
                  Start Assessment
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedTab('bant')}
                >
                  Qualify Lead
                </button>
              </div>
            </div>
          )}
          
          {selectedTab === 'assessment' && <ImageUpload />}
          
          {selectedTab === 'bant' && <BANTQualification />}
          
          {selectedTab === 'settings' && <Settings />}
          
          {(selectedTab === 'reports' || selectedTab === 'contractors') && (
            <div className="text-center py-16">
              <h2 className="text-xl font-bold mb-2">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Module</h2>
              <p>This feature will be implemented in the next development phase.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
