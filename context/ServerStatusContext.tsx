
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiClient } from '../services/apiClient';
import { API_BASE } from '../services/storageService';

interface ServerStatus {
  isWakingUp: boolean;
  isAvailable: boolean;
  error: string | null;
  retryCount: number;
}

interface ServerStatusContextType extends ServerStatus {
  pingServer: () => Promise<boolean>;
  setWakingUp: (waking: boolean, count?: number) => void;
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ServerStatus>({
    isWakingUp: false,
    isAvailable: true, // Optimistically assume available
    error: null,
    retryCount: 0,
  });

  const setWakingUp = useCallback((waking: boolean, count: number = 0) => {
    setStatus(prev => ({
      ...prev,
      isWakingUp: waking,
      retryCount: count,
      isAvailable: !waking,
    }));
  }, []);

  const pingServer = useCallback(async () => {
    if (!API_BASE) {
      console.error('❌ pingServer: API_BASE is empty. Cannot wake backend.');
      return false;
    }

    console.log(`📡 pingServer: Starting wake-up ping to ${API_BASE}/api/slots`);
    try {
      await apiClient.get(`${API_BASE}/api/slots`, {
        retries: 5,
        onRetry: (count) => {
          console.log(`♻️  pingServer retry ${count}...`);
          setStatus(prev => ({ ...prev, isWakingUp: true, retryCount: count }));
        }
      });
      console.log('✅ pingServer: Backend is available.');
      setStatus({ isWakingUp: false, isAvailable: true, error: null, retryCount: 0 });
      return true;
    } catch (err: any) {
      console.error('❌ pingServer failed after all retries:', err.message);
      setStatus({ 
        isWakingUp: false, 
        isAvailable: false, 
        error: "Server connection failed. Is the backend URL correct?",
        retryCount: 0 
      });
      return false;
    }
  }, []);

  return (
    <ServerStatusContext.Provider value={{ ...status, pingServer, setWakingUp }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('useServerStatus must be used within a ServerStatusProvider');
  }
  return context;
};
