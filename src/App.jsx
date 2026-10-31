import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Ncert from "./pages/Ncert";
import Pyq from "./pages/Pyq";
import Questions from "./pages/Questions";

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ncert" element={<Ncert />} />
        <Route path="/pyq" element={<Pyq />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </HashRouter>
  );
}

export default App;