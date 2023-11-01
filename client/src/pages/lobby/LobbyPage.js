import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./lobbyPage.scss";

const LobbyPage = () => {
  // const { codeBlocks } = AppState();
  const { codeBlocks, selectedCodeBlock, setSelectedCodeBlock } = AppState();
  // const [selectedCodeBlock, setSelectedCodeBlock] = useState({});

  const navigate = useNavigate();

  let justMounted;
  useEffect(() => {
    justMounted = true;
  }, []);

  useEffect(() => {
    if (justMounted) {
      return;
    }
    navigate(`/codeblock/${selectedCodeBlock._id}`);
    console.log("useEffect triggered");
  }, [selectedCodeBlock]);

  return (
    <div className="lobby-page body">
      <h1 className="title">Choose code block</h1>
      {codeBlocks.map((codeBlock) => {
        return (
          <div
            key={codeBlock._id}
            className="code-block"
            onClick={() => setSelectedCodeBlock(codeBlock)}
          >
            {codeBlock.title}
          </div>
        );
      })}
    </div>
  );
};

export default LobbyPage;
