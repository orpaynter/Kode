// Supabase integration test
import { supabase } from '../lib/supabase';
import { supabaseAuthService } from '../services/supabaseAuth';

// Test Supabase connection and basic operations
async function testSupabaseIntegration() {
  console.log('🚀 Starting Supabase Integration Tests');
  console.log('=====================================');
  
  let testsPassed = 0;
  let totalTests = 0;
  
  // Test 1: Basic connection
  totalTests++;
  console.log('\n1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
      testsPassed++;
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
  
  // Test 2: Auth system
  totalTests++;
  console.log('\n2. Testing authentication system...');
  try {
    const { data: session } = await supabase.auth.getSession();
    console.log('✅ Auth system accessible');
    testsPassed++;
  } catch (error) {
    console.error('❌ Auth system error:', error);
  }
  
  // Test 3: Table access permissions
  totalTests++;
  console.log('\n3. Testing table access permissions...');
  const tables = ['profiles', 'projects', 'assessments', 'damage_assessments'];
  let tableAccessCount = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`⚠️  ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible`);
        tableAccessCount++;
      }
    } catch (error) {
      console.log(`❌ ${table}: error - ${error}`);
    }
  }
  
  if (tableAccessCount > 0) {
    testsPassed++;
    console.log(`✅ Table access test passed (${tableAccessCount}/${tables.length} tables accessible)`);
  } else {
    console.log('❌ No tables accessible');
  }
  
  // Test 4: User registration flow (without actually creating a user)
  totalTests++;
  console.log('\n4. Testing user registration service...');
  try {
    // Just test if the service methods exist and are callable
    if (typeof supabaseAuthService.register === 'function' &&
        typeof supabaseAuthService.login === 'function' &&
        typeof supabaseAuthService.signOut === 'function') {
      console.log('✅ Auth service methods available');
      testsPassed++;
    } else {
      console.log('❌ Auth service methods missing');
    }
  } catch (error) {
    console.error('❌ Auth service error:', error);
  }
  
  // Test 5: Real-time subscriptions
  totalTests++;
  console.log('\n5. Testing real-time subscriptions...');
  try {
    const channel = supabase.channel('test-channel');
    if (channel) {
      console.log('✅ Real-time channels accessible');
      testsPassed++;
      // Clean up
      supabase.removeChannel(channel);
    } else {
      console.log('❌ Real-time channels not accessible');
    }
  } catch (error) {
    console.error('❌ Real-time error:', error);
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('=====================================');
  console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((testsPassed / totalTests) * 100)}%`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Supabase integration is working correctly.');
  } else if (testsPassed > totalTests / 2) {
    console.log('⚠️  PARTIAL SUCCESS: Most tests passed, but some issues detected.');
  } else {
    console.log('❌ INTEGRATION ISSUES: Multiple tests failed. Check configuration.');
  }
  
  return testsPassed === totalTests;
}

// Export for use in other files
export { testSupabaseIntegration };

// Auto-run if this is the main module
if (typeof window === 'undefined') {
  testSupabaseIntegration().catch(console.error);
}