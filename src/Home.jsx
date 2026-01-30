import { Link } from "react-router-dom";

const Home = () => {
  const createRipple = (event) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;

  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
};

  return (
    <>
      <div className="herosection relative min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-br from-amber-300/20 to-amber-700/60 overflow-hidden">
  
  {/* Background image */}
  <img
    src="https://wallpapercave.com/wp/wp11672380.jpg"
    alt="hero"
    className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none"
  />

  {/* Text container */}
  <div className="relative z-10 text-center font-sans  px-8 py-4 rounded-xl isolate">
    <h1 className="text-4xl font-bold text-stone-800">
      Welcome to Feather Tasks
    </h1>
    <p className="mt-2 text-xl text-stone-700">
      Books out, brains on—let’s make study fun!
    </p>
  </div>

</div>


      {/* Features Section */}
<div className="features min-h-[80vh] w-full flex items-center justify-center px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 max-w-6xl w-full">

    {/* Pomodoro */}
    <Link
      to="/pomodoro"
      onClick={createRipple}
      className="relative overflow-hidden floaty paper-texture
                 h-92 rounded-2xl bg-amber-400/60 p-6
                 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1
                 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <h5 className="text-2xl font-bold text-stone-900 mb-4">
          🍅 Pomodoro Timer
        </h5>
        <p className="text-stone-800 leading-relaxed">
          Focus deeply with timed sessions and peaceful breaks.
        </p>
      </div>
      <span className="font-semibold text-stone-900 opacity-70">Open →</span>
    </Link>

    {/* To-Do */}
    <Link
      to="/tasks"
      onClick={createRipple}
      className="relative overflow-hidden floaty paper-texture
                 h-92 rounded-2xl bg-amber-400/60 p-6
                 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:-rotate-1
                 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <h5 className="text-2xl font-bold text-stone-900 mb-4">
          ✅ To-Do List
        </h5>
        <p className="text-stone-800 leading-relaxed">
          Organize chaos. Check things off. Feel powerful.
        </p>
      </div>
      <span className="font-semibold text-stone-900 opacity-70">Open →</span>
    </Link>

    {/* Study Log */}
    <Link
      to="/"
      onClick={createRipple}
      className="relative overflow-hidden floaty paper-texture
                 h-92 rounded-2xl bg-amber-400/60 p-6
                 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1
                 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <h5 className="text-2xl font-bold text-stone-900 mb-4">
          📓 Daily Study Log
        </h5>
        <p className="text-stone-800 leading-relaxed">
          Tiny effort. Daily proof. Quiet growth.
        </p>
      </div>
      <span className="font-semibold text-stone-900 opacity-70">Open →</span>
    </Link>

  </div>
</div>

    </>
  );
};

export default Home;
