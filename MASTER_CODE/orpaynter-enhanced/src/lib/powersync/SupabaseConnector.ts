import {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/web';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseConnector implements PowerSyncBackendConnector {
  constructor(private supabase: SupabaseClient) {}

  async fetchCredentials() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    
    if (error || !session) {
      throw new Error('No active session');
    }

    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL || '', // This will be the Azure Container App URL
      token: session.access_token
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    // In a real implementation, you would:
    // 1. Iterate through transaction.crud
    // 2. Map operations (PUT, PATCH, DELETE) to Supabase REST calls
    // 3. Or use a custom backend endpoint that handles the batch
    
    // For PoC, we will simulate or implement a basic write-back for specific tables
    // Note: The PowerSync Service usually handles the *downstream* sync.
    // Upstream (Writes) must be handled by the client application logic calling your API, 
    // OR by this generic handler.
    
    try {
      for (const op of transaction.crud) {
        const table = this.supabase.from(op.table);
        let error;

        if (op.op === UpdateType.PUT) {
           const { error: e } = await table.upsert(op.opData);
           error = e;
        } else if (op.op === UpdateType.PATCH) {
           const { error: e } = await table.update(op.opData).eq('id', op.id);
           error = e;
        } else if (op.op === UpdateType.DELETE) {
           const { error: e } = await table.delete().eq('id', op.id);
           error = e;
        }

        if (error) {
            console.error('Sync Error', error);
            // In a robust app, handle retry logic here
        }
      }

      await transaction.complete();
    } catch (ex) {
      console.error(ex);
      // transaction.complete() is NOT called, so it will retry later
    }
  }
}
