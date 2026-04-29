import { Link } from "react-router-dom";


const Home = () => {
  const createRipple = (event) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter /2;

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
      <div className="herosection relative min-h-[93vh] md:min-h-screen w-full flex z-10 items-center justify-center bg-linear-to-br from-amber-300/20 to-amber-700/60 overflow-hidden backdrop-blur-3xl">
  
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
<div className="features mt-7 md:mt-1 min-h-screen w-full flex flex-col items-center justify-center px-6  bg-linear-to-br from-amber-50 via-white to-amber-50">
   {/* Section Header */}
          <div className="text-center mb-7 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 z-10 relative">
              Choose Your Study Tool
            </h2>
            <div className="h-1 w-20 bg-linear-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-stone-600 text-lg max-w-2xl mx-auto">
              Everything you need to stay focused, organized, and motivated
            </p>
          </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-7 md:gap-14 max-w-6xl  mb-5">

    {/* Pomodoro */}
    <Link
      to="/pomodoro"
      onClick={createRipple}
      className="relative overflow-hidden floaty paper-texture
                 h-92 rounded-2xl bg-amber-400/60 p-6
                 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1
                 transition-all duration-300 flex flex-col justify-between z-10 backdrop-blur-3xl"
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
                 transition-all duration-300 flex flex-col justify-between z-10 backdrop-blur-3xl"
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
      to="/log"
      onClick={createRipple}
      className="relative overflow-hidden floaty paper-texture
                 h-92 rounded-2xl bg-amber-400/60 p-6
                 shadow-xl hover:shadow-2xl hover:-translate-y-3 hover:rotate-1
                 transition-all duration-300 flex flex-col justify-between z-10 backdrop-blur-3xl"
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
