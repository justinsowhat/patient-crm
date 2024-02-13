import React, { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (access_token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // simple auth validation; evetually you can call the BE to validate if the token has expired
  // if so, it should auto direct a user back to the log in page
  const isAuthenticated = !!localStorage.getItem("access_token");

  const login = (access_token: string) =>
    localStorage.setItem("access_token", access_token);
  const logout = () => localStorage.removeItem("access_token");

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
