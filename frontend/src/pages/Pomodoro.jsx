import React, { useState, useEffect, useRef } from "react"; 
import logo from "../assets/logo.svg";
import FallingFeathers from "../components/FallingFeathers";

function Pomodoro() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mode, setMode] = useState("pomodoro");

  const clickSound = useRef(new Audio("/click.wav"));
  const alarmSound = useRef(new Audio("/alarm.wav"));
  const pauseSound = useRef(new Audio("/pause.mp3"));
  const deleteSound = useRef(new Audio("/delete.mp3"));

  const playClick = () => {
    clickSound.current.currentTime = 0;      
    clickSound.current.play().catch(() => {});
  };

  const playPause = () => {
    pauseSound.current.currentTime = 0;    
    pauseSound.current.play().catch(() => {});
  };

  const playDelete = () => {
    deleteSound.current.currentTime = 0;    
    deleteSound.current.play().catch(() => {});
  };

  const stopAlarm = () => {
    alarmSound.current.pause();               
    alarmSound.current.currentTime = 0;
  };

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsFinished(true);

            alarmSound.current.loop = true; 
            alarmSound.current.play().catch(() => {});

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleDismiss = () => {
    stopAlarm();
    setIsFinished(false);
    // reset to proper time instead of 0
    if (mode === "pomodoro") setTotalSeconds(25 * 60);
    if (mode === "shortBreak") setTotalSeconds(2 * 60);
    if (mode === "longBreak") setTotalSeconds(15 * 60);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };


  const handleRestart = () => {
    setIsRunning(false);
    setIsFinished(false);
    stopAlarm();

    if (mode === "pomodoro") setTotalSeconds(25 * 60);
    if (mode === "shortBreak") setTotalSeconds(2 * 60);
    if (mode === "longBreak") setTotalSeconds(15 * 60);

    setIsRunning(true);
  };
  const handleMode = (newMode) => {
    playClick(); //  play click sound on mode change

    setIsPaused(false);
    stopAlarm(); //  stop alarm if switching mid-buzz
    setIsRunning(false);
    setIsFinished(false); //  reset finished state

    if (newMode === "pomodoro") setTotalSeconds(25 * 60);
    if (newMode === "shortBreak") setTotalSeconds(2 * 60);
    if (newMode === "longBreak") setTotalSeconds(15 * 60);

    setMode(newMode);
  };

  return (
   
    <>
      {/* Heading */}
       <div className="z-10 flex flex-row justify-center items-center mt-1 p-2 gap-2">
              <img src={logo} alt="logo" className="h-9 w-auto z-10 md:h-12" />
              <h1 className="md:text-3xl z-10 text-2xl text-stone-900 font-bold font-serif">
                Pomodoro
              </h1>
            </div>

      {/* Main container */}
      <div
        className={`rounded-2xl p-5 transition-all duration-500 py-3 md:py-5 my-3 md:my-5  flex flex-col items-center mx-auto max-w-[95vw] min-h-[60vh] md:max-w-[55vw] lg:max-w-[45vw]  md:min-h-[65vh]  justify-center border border-white/30 shadow-xl shadow-black/10
  ${
    isRunning
      ? "bg-stone-700/30 backdrop-blur-md shadow-3xl shadow-black/30"
      : "bg-stone-700/20 backdrop-blur-md"
  }`}
      >
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
        <div className="timer text-amber-800 font-sans font-base  text-[5rem] md:text-[6rem] mb-6 flex justify-center items-center">
          {formatTime(totalSeconds)}
        </div>

        {/* when timer is off */}
        {!isRunning && !isFinished && !isPaused && (
          <button
            onClick={() => {
              if (!isPaused) {
                playClick(); //  only play on fresh start
              }
              if (totalSeconds === 0) {
                if (mode === "pomodoro") setTotalSeconds(25 * 60);
                if (mode === "shortBreak") setTotalSeconds(2 * 60);
                if (mode === "longBreak") setTotalSeconds(15 * 60);
              }

              setIsRunning(true);
              setIsPaused(false);
            }}
            className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
          >
            {/* when timer is running make the single button into two buttons which is delete resume/pause */}
            START
          </button>
        )}
        {/* when timer is on */}
        {/* when timer is running make the single button into two buttons which is delete resume/pause */}
        {!isFinished && (isRunning || isPaused) && (
          <div className="btngrp flex flex-wrap gap-6">
            {/* DELETE */}
            <button
              onClick={() => {
                playDelete();
                setIsRunning(false);
                setIsPaused(false);
                setIsFinished(false);
                stopAlarm();

                if (mode === "pomodoro") setTotalSeconds(25 * 60);
                if (mode === "shortBreak") setTotalSeconds(2 * 60);
                if (mode === "longBreak") setTotalSeconds(15 * 60);
              }}
              className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
            >
              DELETE
            </button>
            {/* PAUSE / RESUME */}
            <button
              onClick={() => {
                 
                if (isRunning) {
                  
                  setIsRunning(false);
                  setIsPaused(true);
                 
                } else {
                   playPause();
                  setIsRunning(true);
                  setIsPaused(false);
                }
              }}
              className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
            >
              {isRunning ? "PAUSE" : "RESUME"}
            </button>
          </div>
        )}
        {!isRunning && isFinished && (
          <div className="btngrp flex flex-wrap gap-6">
            <button
              onClick={handleDismiss}
              className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
            >
              DISMISS
            </button>

            <button
              onClick={handleRestart}
              className="controlBtn w-20 py-3 rounded-2xl bg-white text-stone-700 text-sm font-medium hover:scale-110 hover:shadow-lg transition-transform duration-200  cursor-pointer"
            >
              RESTART
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Pomodoro;
