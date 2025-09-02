import { createContext, useContext } from "react";

export const DataContext = createContext({});

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within an DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};
