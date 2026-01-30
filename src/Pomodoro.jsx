import React, { useState, useEffect } from "react";
import FallingFeathers from "./components/FallingFeathers.jsx";

function Pomodoro() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro, shortBreak, longBreak

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleMode = (newMode) => {
    setIsRunning(false);
    if (newMode === "pomodoro") setTotalSeconds(25 * 60);
    if (newMode === "shortBreak") setTotalSeconds(5 * 60);
    if (newMode === "longBreak") setTotalSeconds(15 * 60);
    setMode(newMode);
  };

  return (
    //   <FallingFeathers />
    <>
    <FallingFeathers />
    {/* container */}
    <div className="min-h-screen flex flex-col items-center justify-start  bg-linear-to-br from-amber-300/20 to-amber-700/60 ">
      {/* Heading */}
      <h1 className="text-stone-500 text-3xl font-bold md:text-3xl text-center w-full my-3 z-10">
        Pomodoro Timer
      </h1>

      {/* Main container */}
     <div className="container bg-amber-700/30 backdrop-blur-md p-5 rounded-2xl flex flex-col items-center max-w-md w-full sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[50vw] mx-auto min-h-[70vh] justify-center content-center border border-white/30 shadow-xl shadow-black/10
">

        {/* Mode buttons */}
        <div className="btn-group flex flex-wrap justify-center items-center gap-5 mb-6">
          {["pomodoro", "shortBreak", "longBreak"].map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className={`px-6 py-3 rounded-2xl bg-white  cursor-pointer text-stone-700 text-sm font-medium transition-transform duration-200 hover:scale-110 hover:shadow-lg ${
                mode === m ? "shadow-inner" : ""
              }`}
            >
              {m === "pomodoro"
                ? "Pomodoro"
                : m === "shortBreak"
                ? "Short Break"
                : "Long Break"}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="timer text-white font-sans font-thin text-[5rem] md:text-[6rem] mb-6 flex justify-center items-center">
          {formatTime(totalSeconds)}
        </div>

        {/* Start / Pause button */}
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
        >
          {isRunning ? "PAUSE" : "START"}
        </button>
      </div>
    </div>
    </>
  );
}

export default Pomodoro;
