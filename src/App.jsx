import Navbar from "./components/Navbar.jsx";
import "./App.css";
import { useState, useEffect } from "react";
import { stringify, v4 as uuidv4 } from "uuid";
import logo from "../src/assets/logo.svg";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FallingFeathers from "./components/FallingFeathers.jsx";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

function App() {
  // text
  const [todo, setTodo] = useState("");
  //arrays of text
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []);

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = (params) => {
    setshowFinished(!showFinished);
  };

  const moveTodo = (index, direction) => {
    const newTodos = [...todos];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newTodos.length) return;

    [newTodos[index], newTodos[targetIndex]] = [
      newTodos[targetIndex],
      newTodos[index],
    ];

    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id);
    // Put the todo text back into the input box
    setTodo(t[0].todo);

    //delete existing one before
    setTodos(todos.filter((todo) => todo.id !== id));

    saveToLS();
  };
  const handleDelete = (id) => {
    //confirming with basic jsx before deltee
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!isConfirmed) return;
    setTodos(todos.filter((todo) => todo.id !== id));

    saveToLS();
  };
  const handleAdd = () => {
    setTodos([
      ...todos,
      { id: uuidv4(), todo, isCompleted: false, isFav: false },
    ]);
    setTodo("");

    saveToLS();
  };
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  const handleResetDay = () => {
    const isConfirmed = window.confirm(
      "This will clear all your todos for today. Are you sure?"
    );

    if (!isConfirmed) return;

    setTodos([]);
    localStorage.removeItem("todos"); // or set to empty array
  };

  const isFavourite = (id) => {
    const newTodos = todos.map((item) =>
      item.id === id ? { ...item, isFav: !item.isFav } : item
    );
    setTodos(newTodos);

    saveToLS();
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    //so that array is copied to newTodos for making changes
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);

    saveToLS();
  };

  return (
    <>
      <Navbar />
      <FallingFeathers />
      {/* main container for to do app */}
      <div className="relative z-10 opacity-90 bg-stone-300   rounded-2xl p-5 my-5  md:max-w-[60vw] md:mx-auto w-full min-h-[80vh]">
        <div className="flex flex-row justify-center items-center p-2 gap-2">
          <img src={logo} alt="logo" className="h-13 w-auto " />
          <h1 className="md:text-2xl text-xl text-stone-700 font-bold font-serif">
            FeatherTasks
          </h1>
        </div>
        <div className="addTodo   ">
          <h2 className="md:text-xl   p-2 text-stone-700 font-bold font-serif">
            Add a Todo
          </h2>
          {/* add todo section */}
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault(); // prevent page refresh
              handleAdd();
            }}
          >
            <input
              onChange={handleChange}
              value={todo}
              className="bg-white rounded-2xl px-3 min-w-[45vw] p-1.5"
              type="text"
              placeholder="Write your todo..."
            />
            <button
              type="submit" // important for form submit
              disabled={todo.length <= 3}
              className="cursor-pointer disabled:bg-stone-500 mx-3 p-1.5 bg-stone-700 rounded-2xl px-3 text-white font-semibold"
            >
              Add
            </button>
          </form>
        </div>

        {/* for completed todos */}
        <div className="flex justify-between ">
          <label className="flex  items-center my-4">
            <input
              type="checkbox"
              onChange={toggleFinished} // your function to toggle state
              checked={showFinished} // the boolean state
              className="mx-2  accent-indigo-600 cursor-pointer"
            />
            Show Finished
          </label>
          <button
            onClick={handleResetDay}
            className="my-3 mx-5 px-4 py-1.5 bg-stone-600 text-white font-semibold rounded-2xl hover:bg-stone-700 transition cursor-pointer"
          >
            Reset
          </button>
        </div>

        <h2 className="w-auto p-2 font-bold font-serif text-center bg-stone-500 text-white rounded-xl my-3">
          My Todos
        </h2>
        {/* rendering all the todos */}
        <div className="todos  w-full">
          {/* “If there are NO todos, show this message.” 
        true && <div>...</div>  // React renders the div*/}
          {todos.length === 0 && (
            <div className="m-5 text-white">Add your Todos above</div>
          )}
          {todos.map((item, index) => {
            return (
              (showFinished || !item.isCompleted) && (
                // Each todo needs a unique key so React can track it.
                // item = { todo: "Study React", isCompleted: false }  // index = 0, 1, 2, ...

                /* 1 single todo card */
                <div
                  key={item.id}
                  className="todo group flex flex-col md:flex-row items-start md:items-center gap-2 my-2 w-full"
                >
                  {/* for checkbox for tick and cross */}
                  {/* checkbox + todo text */}
                  <div className="flex items-center gap-2 w-full md:flex-1">
                    <input
                      type="checkbox"
                      name={item.id}
                      onChange={handleCheckbox}
                      checked={item.isCompleted}
                      className="w-5 accent-indigo-600 cursor-pointer"
                    />

                    <div
                      className={`bg-stone-200 rounded-xl p-2 w-full flex items-center justify-between  ${
                        item.isCompleted ? "line-through" : ""
                      }`}
                    >
                      {item.todo}
                      <button
                        onClick={() => isFavourite(item.id)}
                        className="ml-auto"
                      >
                        {item.isFav ? (
                          <FaStar className="text-yellow-600 text-xl transition-transform hover:scale-110" />
                        ) : (
                          <FaRegStar className="text-stone-500 text-xl transition-transform hover:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="buttons flex gap-2 w-full not-only-of-type:opacity-70 group-hover:opacity-100 md:w-auto md:flex-none justify-end transition">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="Edit-button bg-stone-700 w-7 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      // (pass id directly)
                      onClick={() => handleDelete(item.id)}
                      className="Delete-button bg-stone-700 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <MdDelete />
                    </button>
                    <button
                      onClick={() => moveTodo(index, -1)}
                      disabled={index === 0}
                      className="bg-stone-700 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <FaAngleUp />
                    </button>

                    <button
                      onClick={() => moveTodo(index, 1)}
                      disabled={index === todos.length - 1}
                      className="bg-stone-700 rounded-2xl p-2 text-white cursor-pointer "
                    >
                      <FaAngleDown />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
