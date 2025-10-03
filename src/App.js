import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router";
import GhostCursor1 from "./GhostCursor1";
import Home from "./home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="gc-1" element={<GhostCursor1 />}></Route>
      </Routes>
    </div>
  );
}

export default App;
