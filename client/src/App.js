import AppProvider from "context/AppProvider.js";
import CodePage from "pages/code/CodePage";
import LobbyPage from "pages/lobby/LobbyPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/codeblock/:id" element={<CodePage />} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
