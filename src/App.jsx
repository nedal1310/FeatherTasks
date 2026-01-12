import Navbar from "./components/Navbar.jsx";
import "./App.css";
import { useState, useEffect } from "react";
import { stringify, v4 as uuidv4 } from "uuid";
import logo from "../src/assets/logo.svg";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FallingFeathers from "./components/FallingFeathers.jsx";

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
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
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
      <div className="relative z-10  bg-stone-300   rounded-2xl    p-5 my-5  md:max-w-[60vw] md:mx-auto w-full min-h-[80vh]">
        <div className="flex flex-row justify-center items-center p-2 gap-2">
          <img src={logo} alt="logo" className="h-13 w-auto " />
          <h1 className="text-3xl text-stone-700 font-extrabold font-serif">
            FeatherTasks
          </h1>
        </div>
        <div className="addTodo gap-3 ">
          <h2 className="text-xl  p-2 text-stone-700 font-extrabold font-serif">
            Add a Todo
          </h2>
          {/* add todo section */}

          <input
            onChange={handleChange}
            value={todo}
            className="bg-white rounded-2xl  md:min-w-[45vw] p-1.5 "
            type="text"
            placeholder="Write your task here..."
          />
          <button
            onClick={handleAdd}
            disabled={todo.length <= 3}
            className="cursor-pointer disabled:bg-stone-500  mx-3 p-1.5 bg-stone-700 rounded-2xl px-3 text-white font-semibold "
          >
            Add
          </button>
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
        <div className="todos flex flex-col w-full">
          {/* “If there are NO todos, show this message.” 
        true && <div>...</div>  // React renders the div*/}
          {todos.length === 0 && (
            <div className="m-5 text-white">Add your Todos above</div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                // Each todo needs a unique key so React can track it.
                // item = { todo: "Study React", isCompleted: false }  // index = 0, 1, 2, ...

                /* 1 single todo card */
                <div key={item.id} className="todo flex gap-2 my-2 w-full ">
                  {/* for checkbox for tick and cross */}
                  <input
                    type="checkbox"
                    name={item.id}
                    onChange={handleCheckbox}
                    checked={item.isCompleted}
                    className="w-5 h-auto accent-indigo-600 cursor-pointer"
                  />
                  <div
                    //         {} → means “escape to JavaScript mode”
                    // You can run JS expressions inside JSX using {}
                    className={`text w-3/4 bg-stone-200 rounded-xl p-1.5  ${
                      item.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {/* This inserts the string value */}
                    {item.todo}
                  </div>

                  <div className="buttons gap-2 flex w-1/4 h-full">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="Edit-button bg-stone-700 w-7 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      // (recommended: pass id directly)
                      onClick={() => handleDelete(item.id)}
                      className="Delete-button bg-stone-700 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <MdDelete />
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
