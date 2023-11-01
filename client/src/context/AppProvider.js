import { createContext, useContext, useEffect, useState } from "react";
import * as ServerApi from "utils/serverApi";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [selectedCodeBlock, setSelectedCodeBlock] = useState({});

  useEffect(() => {
    ServerApi.fetchCodeBlocks()
      .then((codeBlocksFromResponse) => {
        setCodeBlocks(codeBlocksFromResponse);
        console.log(codeBlocksFromResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        codeBlocks,
        setCodeBlocks,
        selectedCodeBlock,
        setSelectedCodeBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppState = () => {
  return useContext(AppContext);
};

export default AppProvider;
