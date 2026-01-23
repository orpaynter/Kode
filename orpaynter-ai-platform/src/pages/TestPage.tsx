import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { testSupabaseIntegration } from '../test/supabase-test';

export function TestPage() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'testpassword123',
    full_name: 'Test User',
    role: 'homeowner' as const
  });
  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: 'testpassword123'
  });

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runSupabaseTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    addTestResult('🚀 Starting Supabase integration tests...');
    
    try {
      // Test 1: Basic connection
      addTestResult('Testing Supabase connection...');
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        addTestResult(`❌ Connection failed: ${error.message}`);
      } else {
        addTestResult('✅ Supabase connection successful');
      }
      
      // Test 2: Table access
      addTestResult('Testing table access...');
      const tables = ['profiles', 'projects', 'assessments'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            addTestResult(`⚠️ ${table}: ${error.message}`);
          } else {
            addTestResult(`✅ ${table}: accessible`);
          }
        } catch (err) {
          addTestResult(`❌ ${table}: error`);
        }
      }
      
      // Test 3: Auth status
      addTestResult('Testing authentication status...');
      const { data: session } = await supabase.auth.getSession();
      addTestResult(`Auth session: ${session.session ? 'Active' : 'None'}`);
      
      addTestResult('🎉 Tests completed!');
    } catch (error) {
      addTestResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleRegister = async () => {
    try {
      addTestResult('Attempting user registration...');
      await register(formData);
      addTestResult('✅ Registration successful!');
    } catch (error: any) {
      addTestResult(`❌ Registration failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      addTestResult('Attempting user login...');
      await login(loginData.email, loginData.password);
      addTestResult('✅ Login successful!');
    } catch (error: any) {
      addTestResult(`❌ Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      addTestResult('Attempting logout...');
      await logout();
      addTestResult('✅ Logout successful!');
    } catch (error: any) {
      addTestResult(`❌ Logout failed: ${error.message}`);
    }
  };

  const testProjectCRUD = async () => {
    if (!isAuthenticated) {
      addTestResult('❌ Must be logged in to test CRUD operations');
      return;
    }

    try {
      addTestResult('Testing project CRUD operations...');
      
      // CREATE
      const newProject = {
        title: 'Test Project',
        description: 'Test project for CRUD operations',
        status: 'pending',
        property_address: '123 Test St, Test City, TC 12345',
        homeowner_id: user?.id
      };
      
      const { data: createData, error: createError } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
      
      if (createError) {
        addTestResult(`❌ Project creation failed: ${createError.message}`);
        return;
      }
      
      addTestResult('✅ Project created successfully');
      const projectId = createData[0].id;
      
      // READ
      const { data: readData, error: readError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId);
      
      if (readError) {
        addTestResult(`❌ Project read failed: ${readError.message}`);
      } else {
        addTestResult('✅ Project read successful');
      }
      
      // UPDATE
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: 'in_progress' })
        .eq('id', projectId);
      
      if (updateError) {
        addTestResult(`❌ Project update failed: ${updateError.message}`);
      } else {
        addTestResult('✅ Project updated successfully');
      }
      
      // DELETE
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (deleteError) {
        addTestResult(`❌ Project deletion failed: ${deleteError.message}`);
      } else {
        addTestResult('✅ Project deleted successfully');
      }
      
      addTestResult('🎉 CRUD operations completed!');
      
    } catch (error: any) {
      addTestResult(`❌ CRUD test error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Integration Test Page</h1>
        
        {/* Auth Status */}
        <div className="bg-dark-secondary p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>Authenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span></p>
            {user && (
              <div>
                <p>User ID: {user.id}</p>
                <p>Email: {user.email}</p>
                <p>Name: {user.full_name}</p>
                <p>Role: {user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Connection Tests */}
          <div className="bg-dark-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
            <button
              onClick={runSupabaseTests}
              disabled={isRunningTests}
              className="bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              {isRunningTests ? 'Running Tests...' : 'Run Supabase Tests'}
            </button>
          </div>

          {/* Auth Tests */}
          <div className="bg-dark-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Authentication Tests</h2>
            
            {!isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 bg-dark-primary border border-gray-600 rounded text-white mb-2"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 bg-dark-primary border border-gray-600 rounded text-white mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full p-2 bg-dark-primary border border-gray-600 rounded text-white mb-2"
                  />
                  <button
                    onClick={handleRegister}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
                  >
                    Test Register
                  </button>
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Test Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2"
                >
                  Test Logout
                </button>
                <button
                  onClick={testProjectCRUD}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Test CRUD Operations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-dark-secondary p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-dark-primary p-4 rounded border border-gray-600 h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400">No test results yet. Run some tests to see results here.</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}