import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BaseLayout from "./components/BaseLayout";
import Home from "./views/Home/Home";
import About from "./views/About/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="linkmanager" element={null} />
          <Route path="watchlist" element={null} />
          <Route path="events" element={null} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
