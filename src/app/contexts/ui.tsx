import React, { FC, ReactNode, createContext, useContext } from 'react';

const UIContext = createContext<{} | null>(null);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <UIContext.Provider value={{}}>{children}</UIContext.Provider>;
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('Missing UI context');
  }
  return context;
}
