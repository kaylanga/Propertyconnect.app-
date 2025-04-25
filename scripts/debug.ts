import { LoggingService } from '../src/services/LoggingService';
import { MonitoringService } from '../src/services/MonitoringService';
import { supabase } from '../src/lib/supabase';

async function runDebugChecks() {
  console.log('🔍 Starting debug checks...\n');

  try {
    // 1. Check Database Connection
    console.log('Testing database connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('user_profiles')
      .select('count');
    
    if (dbError) {
      throw new Error(`Database connection failed: ${dbError.message}`);
    }
    console.log('✅ Database connection successful\n');

    // 2. Check Authentication
    console.log('Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log(authData ? '✅ Authentication working' : '❌ Authentication not configured');
    if (authError) {
      console.error('Authentication error:', authError);
    }
    console.log();

    // 3. Check Storage
    console.log('Testing storage access...');
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();
    
    if (storageError) {
      throw new Error(`Storage access failed: ${storageError.message}`);
    }
    console.log('✅ Storage access successful\n');

    // 4. Test Logging
    console.log('Testing logging service...');
    await LoggingService.log({
      level: 'info',
      message: 'Debug test log',
      metadata: { test: true }
    });
    console.log('✅ Logging service working\n');

    // 5. Test Monitoring
    console.log('Testing monitoring service...');
    const health = await MonitoringService.getSystemHealth();
    console.log('System Health:', health);
    console.log('✅ Monitoring service working\n');

    console.log('🎉 All debug checks completed successfully!\n');

  } catch (error) {
    console.error('❌ Debug check failed:', error);
    throw error; // Re-throw the error instead of using process.exit
  }
}

runDebugChecks();