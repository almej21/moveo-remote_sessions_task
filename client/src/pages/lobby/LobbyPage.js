import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    socket.on("mentor joined", (codeBlockId) => {
      console.log(`mentor joined code block with ID: ${codeBlockId}`);
      setMentorSelectedCodeBlockId(codeBlockId);
    });
  }, [socket]);

  return (
    <div className="lobby-page body">
      <h1 className="title">Choose code block</h1>
      {codeBlocks.map((codeBlock) => {
        return (
          <div
            key={codeBlock._id}
            className="code-block btn"
            onClick={() => navigate(`/codeblock/${codeBlock._id}`)}
          >
            {`${codeBlock.title}`}
          </div>
        );
      })}
    </div>
  );
};

export default LobbyPage;
