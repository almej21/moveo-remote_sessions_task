import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as LocalStorage from "utils/localStorage";

import "./lobbyPage.scss";

const LobbyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    codeBlocks,
    setSelectedCodeBlockObj,
    socket,
    setMentorSelectedCodeBlockId,
  } = AppState();

  console.log(`lobby page`);

  let justMounted;

  useEffect(() => {
    justMounted = true;
    if (location.pathname === "/" || "lobby") {
      setSelectedCodeBlockObj({});
    }
  }, []);

  useEffect(() => {
    socket.on("mentor joined", (codeBlockObj) => {
      const notify = () =>
        toast.success(`Mentor joined: ${codeBlockObj.title}`);
      notify();
      LocalStorage.set("mentorSelectedCodeBlockWithId", codeBlockObj._id);
      setMentorSelectedCodeBlockId(codeBlockObj._id);
    });

    socket.on("student joined", (codeBlockObj) => {
      const notify = () => toast.success(`Student has joined`);
      notify();
    });
  }, [socket]);

  const handleCodeBlockClick = (codeBlockObj) => {
    navigate(`/codeblock/${codeBlockObj._id}`);
    if (LocalStorage.get("mentorSelectedCodeBlockWithId")) {
      socket.emit("joining", codeBlockObj);
    } else {
      socket.emit("mentor joined", codeBlockObj);
    }
  };

  return (
    <div className="lobby-page body">
      <h1 className="title">Choose code block</h1>
      {codeBlocks.map((codeBlock) => {
        return (
          <div
            key={codeBlock._id}
            className="code-block btn"
            onClick={() => {
              handleCodeBlockClick(codeBlock);
            }}
          >
            {`${codeBlock.title}`}
          </div>
        );
      })}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LobbyPage;
