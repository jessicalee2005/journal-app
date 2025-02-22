import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import AddEntry from "./pages/AddEntry";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/add-entry" element={<AddEntry />} />
          <Route path="/" element={<AddEntry />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
