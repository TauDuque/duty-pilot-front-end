/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { List } from '../types';

interface ActiveListContextType {
  activeList: List | null;
  setActiveList: (list: List | null) => void;
  clearActiveList: () => void;
}

const ActiveListContext = createContext<ActiveListContextType | undefined>(undefined);

export const ActiveListProvider = ({ children }: { children: ReactNode }) => {
  const [activeList, setActiveListState] = useState<List | null>(null);

  const setActiveList = useCallback((list: List | null) => {
    setActiveListState(list);
  }, []);

  const clearActiveList = useCallback(() => {
    setActiveListState(null);
  }, []);

  return (
    <ActiveListContext.Provider value={{ activeList, setActiveList, clearActiveList }}>
      {children}
    </ActiveListContext.Provider>
  );
};

export const useActiveList = (): ActiveListContextType => {
  const context = useContext(ActiveListContext);
  if (context === undefined) {
    throw new Error('useActiveList must be used within an ActiveListProvider');
  }
  return context;
};
