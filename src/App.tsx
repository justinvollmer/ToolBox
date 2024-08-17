import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Box } from "@mui/material";

import ThemeManager from "./components/theme/ThemeManager";

import BaseLayout from "./components/BaseLayout";
import Home from "./views/Home/Home";
import About from "./views/About/About";
import LinkManager from "./views/LinkManager/LinkManager";
import Randomizer from "./views/Randomizer/Randomizer";

function App() {
  return (
    <Router>
      <ThemeManager>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<BaseLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="linkmanager" element={<LinkManager />} />
              <Route path="randomizer" element={<Randomizer />} />
            </Route>
          </Routes>
        </Box>
      </ThemeManager>
    </Router>
  );
}

export default App;
