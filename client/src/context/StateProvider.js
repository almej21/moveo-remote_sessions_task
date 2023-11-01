import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

const StateProvider = ({ children }) => {
  const [codeBlock, setCodeBlock] = useState();

  return (
    <AppContext.Provider
      value={{
        codeBlock,
        setCodeBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(AppContext);
};

export default StateProvider;
