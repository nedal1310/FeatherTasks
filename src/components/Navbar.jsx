import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Navbar = () => {
  return (
    <nav className="h-12 flex flex-wrap items-center justify-around z-10  bg-[#7b6561] text-white">
      <div className="logotitle">
       
        <span className="flex gap-4 font-bold font-serif md:text-xl md:mx-8"><img src={logo} alt="" className="h-7 w-auto "/>FeatherTasks</span>
      </div>
      <ul className="flex md:gap-7 md:mx-13 mx-2 gap-2">
        <li className="cursor-pointer hover:font-bold transition-all duration-300">
          <Link to="/">Home</Link>
        </li>
        <li className="cursor-pointer hover:font-bold transition-all duration-300">
          <Link to="/tasks">My Tasks</Link>
        </li>
        <li className="cursor-pointer hover:font-bold transition-all duration-300">
          <Link to="/pomodoro">Pomodoro</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
