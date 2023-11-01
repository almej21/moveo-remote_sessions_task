import { AppState } from "context/AppProvider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import * as ServerApi from "utils/serverApi";
// import "prismjs/components/prism-javascript";
// import "prismjs/themes/prism.css";
import Prism from "prismjs";
import "styles/prism-cb.css";
import "./codePage.scss";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const CodePage = () => {
  const { id } = useParams();
  const { selectedCodeBlock, setSelectedCodeBlock } = AppState();
  console.log(selectedCodeBlock);

  if (isEmpty(selectedCodeBlock)) {
    ServerApi.fetchCodeBlock(id)
      .then((codeBlock) => {
        console.log(codeBlock);
        setSelectedCodeBlock(codeBlock);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <>
      <h1>{selectedCodeBlock.title}</h1>
      <pre className="pre">
        <code contentEditable={true} className={`language-js`}>
          {selectedCodeBlock.code}
        </code>
      </pre>
    </>
  );
};

export default CodePage;
