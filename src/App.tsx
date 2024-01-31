import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BaseLayout from "./components/BaseLayout";
import Home from "./views/Home/Home";
import About from "./views/About/About";
import LinkManager from "./views/LinkManager/LinkManager";
import Dev from "./views/Dev/Dev";
import DevIPC from "./views/Dev/DevIPC";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="linkmanager" element={<LinkManager />} />
          <Route path="gallery" element={null} />
          <Route path="dev">
            <Route index element={<Dev />} />
            <Route path="ipc" element={<DevIPC />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
