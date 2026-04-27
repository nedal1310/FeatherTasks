import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";

function FallingFeathers() {
  const [feathers, setFeathers] = useState([]);

  useEffect(() => {
    const count = window.innerWidth < 768 ? 10 : 25;
    // generate 15 random feathers once
    const generated = Array.from({ length: count }).map(() => ({
      id: crypto.randomUUID(),
      left: Math.random() * 100, // horizontal position
      delay: Math.random() * 2, // stagger animation start
      duration: 10 + Math.random() * 10, // animation speed
      size: 40 + Math.random() * 60, // size in px (40px → 100px)
      rotate: Math.random() * 360, // initial rotation
      drift: -30 + Math.random() * 60, // horizontal movement during fall
    }));
    setFeathers(generated);
  }, []); // empty dependency → only runs once

  return (
    <div className="fixed inset-0 pointer-events-none z-0 leaves-container opacity-50  top-0 left-0 w-full h-full overflow-hidden">
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
            "--start-rotate": `${f.rotate}deg`, // initial random rotation
            opacity: 0.1,
            pointerEvents: "none",
           
          }}
        />
      ))}
    </div>
  );
}

export default FallingFeathers;
