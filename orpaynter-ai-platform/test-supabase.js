// Test script to verify Supabase connection and CRUD operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2NzI2MCwiZXhwIjoxOTYxNjQzMjYwfQ.1qm0mINnS3XIqdHzfzEbYAT-IBd1v7P6TemFtBiwDGE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test 2: Test authentication
    console.log('\nTesting authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth system accessible');
    }
    
    // Test 3: Test table access
    console.log('\nTesting table access...');
    const tables = ['profiles', 'projects', 'assessments', 'damage_assessments'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ ${table} table access failed:`, error.message);
      } else {
        console.log(`✅ ${table} table accessible`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Test user registration flow
async function testUserRegistration() {
  console.log('\n=== Testing User Registration ===');
  
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    full_name: 'Test User',
    role: 'homeowner'
  };
  
  try {
    // Test sign up
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.full_name,
          role: testUser.role
        }
      }
    });
    
    if (error) {
      console.error('❌ User registration failed:', error.message);
      return false;
    }
    
    console.log('✅ User registration successful');
    console.log('User ID:', data.user?.id);
    
    // Clean up - sign out
    await supabase.auth.signOut();
    
    return true;
    
  } catch (error) {
    console.error('❌ Registration test error:', error);
    return false;
  }
}

// Test project CRUD operations
async function testProjectCRUD() {
  console.log('\n=== Testing Project CRUD Operations ===');
  
  try {
    // Test CREATE
    const newProject = {
      title: 'Test Project',
      description: 'Test project for CRUD operations',
      status: 'pending',
      property_address: '123 Test St, Test City, TC 12345'
    };
    
    const { data: createData, error: createError } = await supabase
      .from('projects')
      .insert([newProject])
      .select();
    
    if (createError) {
      console.error('❌ Project creation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Project creation successful');
    const projectId = createData[0].id;
    
    // Test READ
    const { data: readData, error: readError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId);
    
    if (readError) {
      console.error('❌ Project read failed:', readError.message);
      return false;
    }
    
    console.log('✅ Project read successful');
    
    // Test UPDATE
    const { data: updateData, error: updateError } = await supabase
      .from('projects')
      .update({ status: 'in_progress' })
      .eq('id', projectId)
      .select();
    
    if (updateError) {
      console.error('❌ Project update failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Project update successful');
    
    // Test DELETE
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (deleteError) {
      console.error('❌ Project deletion failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Project deletion successful');
    
    return true;
    
  } catch (error) {
    console.error('❌ Project CRUD test error:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Supabase Integration Tests\n');
  
  const connectionTest = await testSupabaseConnection();
  const registrationTest = await testUserRegistration();
  const crudTest = await testProjectCRUD();
  
  console.log('\n=== Test Results ===');
  console.log(`Connection Test: ${connectionTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Registration Test: ${registrationTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`CRUD Test: ${crudTest ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = connectionTest && registrationTest && crudTest;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
}

// Export for use in other files
export { runAllTests, testSupabaseConnection, testUserRegistration, testProjectCRUD };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}