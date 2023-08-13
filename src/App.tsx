import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BaseLayout from "./components/BaseLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={null} />
          <Route path="about" element={null} />
          <Route path="settings" element={null} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
