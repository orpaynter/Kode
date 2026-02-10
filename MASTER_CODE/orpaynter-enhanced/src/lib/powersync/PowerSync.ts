import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './AppSchema';
import { SupabaseConnector } from './SupabaseConnector';
import { supabase } from '../supabase'; // Existing supabase client

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'orpaynter_edge.db'
  }
});

export const connector = new SupabaseConnector(supabase);

export const initPowerSync = async () => {
  // Only connect if we have a valid endpoint configuration
  // For PoC, this might be empty, so we check.
  if (import.meta.env.VITE_POWERSYNC_URL) {
      await db.connect(connector);
  } else {
      console.warn('VITE_POWERSYNC_URL not set. Offline sync will strictly be local-only (no cloud sync).');
  }
};
