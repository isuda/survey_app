import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  clearUserContext: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState('');

  const clearUserContext = () => {
    setEmail('');
  };

  return (
    <UserContext.Provider value={{ email, setEmail, clearUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
