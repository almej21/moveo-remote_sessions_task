import StateProvider from "context/StateProvider.js";
import CodePage from "pages/code/CodePage";
import LobbyPage from "pages/lobby/LobbyPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <Router>
      <StateProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/code" element={<CodePage />} />
          </Routes>
        </div>
      </StateProvider>
    </Router>
  );
}

export default App;
