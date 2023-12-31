import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as LocalStorage from "utils/localStorage";
import * as ServerApi from "utils/serverApi";
import "./lobbyPage.scss";

const LobbyPage = () => {
  const navigate = useNavigate();

  const { codeBlocks, setSelectedCodeBlockObj, socket } = AppState();

  let justMounted;

  useEffect(() => {
    justMounted = true;
    if (LocalStorage.get("role")) {
      socket.emit("leaving");
    }
  }, []);

  useEffect(() => {
    socket.on("user joined", (codeBlockObj) => {
      if (!LocalStorage.get("role") || LocalStorage.get("role") === "student") {
        // if user joined and he is the first aka mentor.
        LocalStorage.set("role", "student");
        const notify = () =>
          toast.success(`Mentor joined: ${codeBlockObj.title}`, {
            toastId: "Mentor",
          });
        notify();
      } else {
        LocalStorage.set("role", "mentor");
        const notify = () =>
          toast.success(`Student joined: ${codeBlockObj.title}`, {
            toastId: "Student",
          });

        notify();
      }
      LocalStorage.set("mentorSelectedCodeBlockWithId", codeBlockObj._id);
    });

    socket.on("user left", () => {
      let role = JSON.parse(localStorage.getItem("role"));
      if (role === "mentor") {
        const notify = () =>
          toast.success(`student left`, {
            toastId: "user left",
          });
        notify();
      } else {
        const notify = () =>
          toast.success(`mentor left`, {
            toastId: "user left",
          });
        notify();
      }
      localStorage.removeItem("mentorSelectedCodeBlockWithId");
      localStorage.removeItem("role");
    });
  }, [socket]);

  const handleCodeBlockClick = (codeBlockObj) => {
    if (!LocalStorage.get("role")) {
      LocalStorage.set("role", "mentor");
      LocalStorage.set("mentorSelectedCodeBlockWithId", codeBlockObj._id);
    }
    navigate(`/codeblock/${codeBlockObj._id}`);
    socket.emit("joining", codeBlockObj);
    ServerApi.fetchCodeBlockById(codeBlockObj._id)
      .then((codeBlock) => {
        setSelectedCodeBlockObj(codeBlock);
      })
      .catch((error) => {
        console.log(error);
      });
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
    </div>
  );
};

export default LobbyPage;
