import { AppState } from "context/AppProvider";
import Prism from "prismjs";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/prism-cb.css";
import * as LocalStorage from "utils/localStorage";
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
  const { selectedCodeBlockObj, setSelectedCodeBlockObj, socket } = AppState();

  if (isEmpty(selectedCodeBlockObj)) {
    ServerApi.fetchCodeBlockById(id)
      .then((codeBlock) => {
        setSelectedCodeBlockObj(codeBlock);

        setTimeout(() => {
          Prism.highlightAll();
        }, 5);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    var lineNumArr = createNumberArray(33);
  }

  useEffect(() => {
    if (LocalStorage.get("role") === "student") {
      codeBlockRef.current.contentEditable = true;
    }

    setTimeout(() => {
      Prism.highlightAll();
    }, 2);
  }, [selectedCodeBlockObj]);

  useEffect(() => {
    Prism.highlightAll();

    socket.on("new code", (code) => {
      setSelectedCodeBlockObj((prevCodeBlockObj) => {
        return { ...prevCodeBlockObj, code: code };
      });
    });
  }, [socket]);

  const handleChange = (codeBlock) => {
    if (selectedCodeBlockObj.solution === codeBlock.target.outerText) {
      const notify = () =>
        toast.success(`great job! 😊`, {
          toastId: "smiley",
        });
      notify();
    }
    socket.emit("typing", codeBlock.target.outerText);
  };

  const handleSave = () => {
    const dataObj = {
      codeBlockId: id,
      code: codeBlockRef.current.outerText,
    };
    ServerApi.saveCode(dataObj)
      .then(() => {
        const notify = () =>
          toast.success("Saved!", {
            toastId: "Saved",
          });
        notify();
        ServerApi.fetchCodeBlockById(id)
          .then((codeBlock) => {
            setSelectedCodeBlockObj(codeBlock);

            setTimeout(() => {
              Prism.highlightAll();
            }, 5);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        const notify = () =>
          toast.error(`code did not save! ${err.message}`, {
            toastId: "error",
          });
      });
  };

  const handleShowSolution = () => {
    codeBlockRef.current.textContent = selectedCodeBlockObj.solution;
  };

  const toggleHidden = () => {
    const lineNums = document.getElementById("lines");
    const codeEditor = document.getElementById("editor-container");

    if (lineNums.classList.contains("hidden")) {
      lineNums.classList.remove("hidden");
      codeEditor.classList.remove("with-line-nums");
    } else {
      codeEditor.classList.add("with-line-nums");
      lineNums.classList.add("hidden");
    }
  };

  useEffect(() => {
    return () => {
      setSelectedCodeBlockObj({});
      console.log("go back clicked");
      socket.emit("leaving");
      localStorage.removeItem("mentorSelectedCodeBlockWithId");
      localStorage.removeItem("role");
    };
  }, []);

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
        <pre className="pre" id="editor-container">
          <code
            ref={codeBlockRef}
            id="editor"
            contentEditable={false}
            className="language-javascript"
            onInput={handleChange}
            suppressContentEditableWarning={true}
            spellcheck="false"
          >
            {selectedCodeBlockObj.code}
          </code>
        </pre>
      </div>
      <div className="btn solution-btn" onClick={handleShowSolution}>
        SHOW SOLUTION
      </div>
      <div className="btn save-btn" onClick={handleSave}>
        SAVE
      </div>
    </>
  );
};

export default CodePage;
