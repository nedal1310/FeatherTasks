import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";

function FallingFeathers() {
  const [feathers, setFeathers] = useState([]);

  useEffect(() => {
    // generate 15 random feathers once
    const generated = Array.from({ length: 25 }).map(() => ({
      id: crypto.randomUUID(),
      left: Math.random() * 100, // horizontal position
      delay: Math.random() * 5, // stagger animation start
      duration: 5 + Math.random() * 10, // animation speed
      size: 40 + Math.random() * 60, // size in px (40px → 100px)
      rotate: Math.random() * 360, // initial rotation
      drift: -30 + Math.random() * 60, // horizontal movement during fall
    }));
    setFeathers(generated);
  }, []); // empty dependency → only runs once

  return (
    <div className="leaves-container fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {feathers.map((f) => (
        <img
          key={f.id}
          src={logo}
          alt="feather"
          style={{
            position: "absolute",
            top: "-10%",
            left: `${f.left}vw`,
            height: `${f.size}px`,
            width: "auto",
            animation: `fall ${f.duration}s linear ${f.delay}s infinite`,
            "--start-rotate": `${f.rotate}deg`, // <-- initial random rotation
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

export default FallingFeathers;
