import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import * as ServerApi from "utils/serverApi";

export const AppContext = createContext();

// for local dev use
// const socket = io.connect("http://localhost:4000");

// for production use
const socket = io.connect("/");

const AppProvider = ({ children }) => {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [selectedCodeBlockObj, setSelectedCodeBlockObj] = useState({});
  const [mentorSelectedCodeBlockId, setMentorSelectedCodeBlockId] =
    useState("");

  useEffect(() => {
    ServerApi.fetchCodeBlocks()
      .then((codeBlocksFromResponse) => {
        setCodeBlocks(codeBlocksFromResponse);
        // console.log(codeBlocksFromResponse);
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
        selectedCodeBlockObj,
        setSelectedCodeBlockObj,
        socket,
        mentorSelectedCodeBlockId,
        setMentorSelectedCodeBlockId,
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
