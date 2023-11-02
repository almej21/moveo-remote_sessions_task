import { AppState } from "context/AppProvider";
import Prism from "prismjs";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "styles/prism-cb.css";
import * as ServerApi from "utils/serverApi";
import "./codePage.scss";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function createNumberArray(n) {
  if (n <= 0) {
    return [];
  }

  return Array.from({ length: n }, (_, index) => index + 1);
}

const CodePage = () => {
  const codeBlockRef = useRef(null);
  const { id } = useParams();
  const {
    selectedCodeBlockObj,
    setSelectedCodeBlockObj,
    socket,
    mentorSelectedCodeBlockId,
  } = AppState();

  if (isEmpty(selectedCodeBlockObj)) {
    ServerApi.fetchCodeBlockById(id)
      .then((codeBlock) => {
        setSelectedCodeBlockObj(codeBlock);

        setTimeout(() => {
          Prism.highlightAll();
        }, 10);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    var lineNumArr = createNumberArray(36);
  }

  useEffect(() => {
    socket.emit("joining", id);

    if (id !== mentorSelectedCodeBlockId) {
      codeBlockRef.current.contentEditable = false;
    }

    setTimeout(() => {
      Prism.highlightAll();
    }, 2);
  }, [selectedCodeBlockObj]);

  useEffect(() => {
    Prism.highlightAll();

    socket.on("new code", (code) => {
      console.log(code);
      setSelectedCodeBlockObj({ ...selectedCodeBlockObj, code: code });
    });
  }, [socket]);

  const handleChange = (codeBlock) => {
    socket.emit("typing", codeBlock.target.outerText);
  };

  const handleClick = () => {
    // console.log(codeBlockRef.current.outerText);
    const dataObj = {
      codeBlockId: id,
      code: codeBlockRef.current.outerText,
    };
    ServerApi.saveCode(dataObj)
      .then(() => {
        alert("saved!");
      })
      .catch((err) => {});
  };

  const toggleHidden = () => {
    const lineNums = document.getElementById("lines");
    console.log(lineNums);

    if (lineNums.classList.contains("hidden")) {
      lineNums.classList.remove("hidden");
    } else {
      lineNums.classList.add("hidden");
    }
  };

  return (
    <>
      <div className="title-lines-container">
        <h1>{selectedCodeBlockObj.title}</h1>
        <label>
          <input
            className="checkbox"
            type="checkbox"
            onChange={toggleHidden}
            defaultChecked
          />
          Line numbers
        </label>
      </div>
      <div className="code-container">
        <div className="code-lines" id="lines">
          {lineNumArr?.map((el) => {
            return <p key={el}>{el}</p>;
          })}
        </div>
        <pre className="pre">
          <code
            ref={codeBlockRef}
            id="editor"
            contentEditable={true}
            className={`language-js`}
            onInput={handleChange}
            suppressContentEditableWarning={true}
          >
            {selectedCodeBlockObj.code}
          </code>
        </pre>
      </div>
      <div className="btn save-btn" onClick={handleClick}>
        SAVE
      </div>
    </>
  );
};

export default CodePage;
