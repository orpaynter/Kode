import React, { createContext, useContext, useEffect, useState } from 'react';
import { PowerSyncDatabase } from '@powersync/web';
import { db, initPowerSync } from '../lib/powersync/PowerSync';

const PowerSyncContext = createContext<PowerSyncDatabase | null>(null);

export const usePowerSync = () => {
  const context = useContext(PowerSyncContext);
  if (!context) {
    throw new Error('usePowerSync must be used within a PowerSyncProvider');
  }
  return context;
};

export const PowerSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initPowerSync().then(() => setReady(true));
  }, []);

  if (!ready) {
    return null; // Or a loading spinner
  }

  return (
    <PowerSyncContext.Provider value={db}>
      {children}
    </PowerSyncContext.Provider>
  );
};
