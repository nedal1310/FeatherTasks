import React from 'react'

const Navbar = () => {
  return (
   <nav className='flex flex-wrap relative z-10 justify-around bg-stone-700 text-white py-2'>
    <div className="logo">
        <span className="font-bold font-serif md:text-xl md:mx-8">FeatherTasks</span>
    </div>
    <ul className='flex md:gap-7 md:mx-13 mx-2 gap-2'>
        <li className='cursor-pointer hover:font-bold transition-all duration-300'>Home</li>
        <li className='cursor-pointer hover:font-bold transition-all duration-300'>My Tasks</li>
    </ul>
   </nav>
  )
}

export default Navbar
