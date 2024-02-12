import React, { createContext, useContext, useState, ReactNode } from "react";

interface EditContextType {
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

// Define the provider component
interface EditProviderProps {
  children: ReactNode;
}

export const EditProvider: React.FC<EditProviderProps> = ({ children }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <EditContext.Provider value={{ isEdit, setIsEdit }}>
      {children}
    </EditContext.Provider>
  );
};

// Custom hook to use the edit context
export const useEdit = () => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error("useEdit must be used within an EditProvider");
  }
  return context;
};
