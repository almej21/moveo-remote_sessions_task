import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  let justMounted;

  useEffect(() => {
    justMounted = true;
    if (location.pathname === "/" || "lobby") {
      setSelectedCodeBlockObj({});
    }
  }, []);

  useEffect(() => {
    socket.on("mentor joined", (codeBlockObj) => {
      console.log(`Mentor joined: ${codeBlockObj.title}`);
      const notify = () =>
        toast.success(`Mentor joined: ${codeBlockObj.title}`, {
          toastId: "Mentor",
        });
      notify();
      LocalStorage.set("mentorSelectedCodeBlockWithId", codeBlockObj._id);
      setMentorSelectedCodeBlockId(codeBlockObj._id);
    });

    socket.on("student joined", (codeBlockObj) => {
      const notify = () =>
        toast.success(`Student has joined: ${codeBlockObj.title}`, {
          toastId: "Student",
        });
      notify();
    });
  }, [socket]);

  const handleCodeBlockClick = (codeBlockObj) => {
    navigate(`/codeblock/${codeBlockObj._id}`);
    if (!LocalStorage.get("mentorSelectedCodeBlockWithId")) {
      socket.emit("mentor joined", codeBlockObj);
    } else {
      socket.emit("joining", codeBlockObj);
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
      {/* <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */}
    </div>
  );
};

export default LobbyPage;
