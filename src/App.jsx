import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Home";
import Todos from "./Todos";
import Pomodoro from "./Pomodoro";

function App() {
  return (
    <Router>
      {/* Root layout */}
      <div className="min-h-screen flex flex-col">
        
        {/* Navbar (fixed height) */}
        <Navbar />

        {/* Page content (takes remaining space) */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Todos />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
