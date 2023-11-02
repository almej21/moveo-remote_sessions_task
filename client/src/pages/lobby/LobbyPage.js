import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./lobbyPage.scss";

const LobbyPage = () => {
  const {
    codeBlocks,
    selectedCodeBlockObj,
    setSelectedCodeBlockObj,
    socket,
    mentorSelectedCodeBlockId,
    setMentorSelectedCodeBlockId,
  } = AppState();

  const navigate = useNavigate();

  let justMounted;
  useEffect(() => {
    justMounted = true;
  }, []);

  useEffect(() => {
    socket.on("mentor joined", (codeBlockId) => {
      console.log(`mentor joined code block with ID: ${codeBlockId}`);
      setMentorSelectedCodeBlockId(codeBlockId);
    });
  }, [socket]);

  useEffect(() => {
    if (justMounted) {
      return;
    }
    navigate(`/codeblock/${selectedCodeBlockObj._id}`);
  }, [selectedCodeBlockObj]);

  return (
    <div className="lobby-page body">
      <h1 className="title">Choose code block</h1>
      {codeBlocks.map((codeBlock) => {
        return (
          <div
            key={codeBlock._id}
            className="code-block btn"
            onClick={() => setSelectedCodeBlockObj(codeBlock)}
          >
            {`${codeBlock.title}`}
          </div>
        );
      })}
    </div>
  );
};

export default LobbyPage;
