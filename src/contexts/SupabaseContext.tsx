'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface SupabaseContextValue {
  client: SupabaseClient | null;
  user: User | null;
  ready: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(() => !client);

  useEffect(() => {
    if (!client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    void client.auth.getUser().then(({ data, error }) => {
      if (!error) setUser(data.user);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [client]);

  return (
    <SupabaseContext.Provider value={{ client, user, ready }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error('useSupabase must be used within SupabaseProvider');
  return context;
}
