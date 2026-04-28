import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import Pomodoro from "./pages/Pomodoro";
import Log from "./pages/Log";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useState } from "react";
import FallingFeathers from "./components/FallingFeathers.jsx";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  return (
    <div className="min-h-screen flex flex-col">
        {/* ANIMATION globally */}
      <FallingFeathers />
      
      <Navbar token={token} setToken={setToken} />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
           <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route
            path="/tasks"
            element={token ? <Todos /> : <Login setToken={setToken} />}
          />

          <Route
            path="/pomodoro"
            element={ <Pomodoro/>}
          />
       
          <Route
            path="/log"
            element={token ? <Log /> : <Login setToken={setToken} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
