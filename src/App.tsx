import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import BaseLayout from "./components/BaseLayout";
import Home from "./views/Home/Home";
import About from "./views/About/About";
import LinkManager from "./views/LinkManager/LinkManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="linkmanager" element={<LinkManager />} />
          <Route path="gallery" element={null} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
