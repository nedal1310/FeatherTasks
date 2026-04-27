import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Leaving already? 👀\nAre you sure you want to logout?"
    );
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative text-sm md:text-base font-medium transition-all duration-200 pb-0.5
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-stone-300 after:transition-all after:duration-300
     ${isActive(path)
       ? "text-stone-300 after:w-full"
       : "text-stone-200 hover:text-white after:w-0 hover:after:w-full"
     }`;

  const navLinks = (
    <>
      <li>
        <Link to="/" className={linkClass("/")}>Home</Link>
      </li>
      <li>
        <Link to="/pomodoro" className={linkClass("/pomodoro")}>Pomodoro</Link>
      </li>
      {token && (
        <>
          <li>
            <Link to="/tasks" className={linkClass("/tasks")}>MyTasks</Link>
          </li>
          <li>
            <Link to="/log" className={linkClass("/log")}>Study Log</Link>
          </li>
        </>
      )}
      {!token ? (
        <li>
          <Link
            to="/login"
            className="text-sm md:text-base font-semibold px-4 py-1.5 rounded-full bg-stone-400/20 border border-stone-300/40 text-white hover:bg-stone-400/30 hover:text-white transition-all duration-200"
          >
            Login
          </Link>
        </li>
      ) : (
        <li>
          <button
            onClick={handleLogout}
            className="text-sm md:text-base font-semibold px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-stone-200 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300 transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </li>
      )}
    </>
  );

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300
        bg-[#6b5652]
        ${scrolled ? "shadow-lg shadow-black/20" : ""}
      `}
    >
   

      <div className="mx-auto max-w-6xl px-4 md:px-3 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={logo}
            alt="FeatherTasks logo"
            className="h-7 w-auto transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="font-serif font-bold text-lg text-white tracking-wide">
            FeatherTasks</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
          {navLinks}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
        >
          <span
            className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center
              ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-200
              ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center
              ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="flex flex-col px-4 pb-4 pt-1 gap-3 list-none m-0 border-t border-white/10">
          {navLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;