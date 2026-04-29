import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";


const API = import.meta.env.VITE_API_URL;

function Todos() {
  // text
  const [todo, setTodo] = useState("");
  //arrays of text
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [editId, setEditId] = useState(null);

  //display all the todos in ui
useEffect(() => {
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // ← don't fetch if no token

      const res = await fetch(`${API}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch todos:", res.status);
        return; // ← don't try to setTodos with error object
      }

      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []); // ← always set an array
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchTodos();
}, []);

  //for smaller devices
  const toggleFinished = () => {
    setshowFinished((prev) => !prev);
  };
  //moving todo in container
  const moveTodo = async (index, direction) => {
    const newTodos = [...todos];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newTodos.length) return;

    [newTodos[index], newTodos[targetIndex]] = [
      newTodos[targetIndex],
      newTodos[index],
    ];

    setTodos(newTodos);

    const token = localStorage.getItem("token");

    // send updated order to backend
    await fetch(`${API}/api/todos/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        todos: newTodos.map((t, i) => ({
          id: t._id,
          order: i,
        })),
      }),
    });
  };

  //handle editing needs improvement
  const handleEdit = (id) => {
    const t = todos.find((i) => i._id === id);
    setTodo(t.text);
    setEditId(id); //  track editing
  };
  //deleting a todo
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Delete this todo?");
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    await fetch(`${API}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };
  //adding a todo api and updating a todo api
  const handleAdd = async () => {
    const token = localStorage.getItem("token");

    if (editId) {
      //  UPDATE EXISTING TODO
      const res = await fetch(`${API}/api/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: todo }),
      });

      const updatedTodo = await res.json();

      const newTodos = todos.map((t) => (t._id === editId ? updatedTodo : t));

      setTodos(newTodos);
      setEditId(null);
    } else {
      //  ADD NEW TODO
      const res = await fetch(`${API}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: todo }),
      });

      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
    }

    setTodo("");
  };

  //making changes in todo
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  //reseting a todo
  const handleResetDay = async () => {
    const isConfirmed = window.confirm(
      "This will clear all your todos for today. Are you sure?",
    );

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    await fetch(`${API}/api/todos/reset`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos([]); // update UI after backend success
  };
  //marking fav todo api
  const isFavourite = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/todos/fav/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedTodo = await res.json();

    const newTodos = todos.map((t) => (t._id === id ? updatedTodo : t));

    setTodos(newTodos);
  };
  //handling checkbox todo api
  const handleCheckbox = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/todos/toggle/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedTodo = await res.json();

    const newTodos = todos.map((t) => (t._id === id ? updatedTodo : t));

    setTodos(newTodos);
  };

  return (
    <>
      {/* main container for to do app */}
      <div className="z-10 flex flex-row justify-center items-center p-2 md:p-5 gap-2">
       <img src={logo} alt="logo" className="h-9 w-auto z-10 md:h-12" />
        <h1 className="md:text-3xl z-10 text-2xl text-stone-900 font-bold font-serif">
          FeatherTasks
        </h1>
      </div>
      <div className="relative z-10 mb-4 rounded-2xl p-5  w-full  max-w-[95vw] md:max-w-[70vw] lg:max-w-[50vw] mx-auto min-h-[60vh]  lg:min-h-[70vh] bg-linear-to-br bg-stone-700/20 backdrop-blur-md ">
        <div className="addTodo   ">
          <h2 className="md:text-xl  p-2 text-stone-700 font-bold font-serif">
            Add a Todo
          </h2>
          {/* add todo section */}
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault(); // prevent page refresh
              handleAdd();
            }}
          >
            <input
              onChange={handleChange}
              value={todo}
              className="bg-white rounded-2xl p-2 flex-1"
              type="text"
              placeholder="Write your todo..."
            />
            <button
              type="submit" // important for form submit
              disabled={todo.length <= 2}
              className="cursor-pointer disabled:bg-stone-500 px-4 py-1.5 bg-stone-700 rounded-2xl text-white font-semibold whitespace-nowrap"
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
            className="m-2 p-2 bg-stone-500 text-white font-semibold rounded-2xl hover:bg-stone-700 transition cursor-pointer"
          >
            Reset
          </button>
        </div>

        <h2 className="w-auto p-2 font-bold font-serif text-center bg-[#6f5d59] text-white rounded-xl my-3">
          My Todos
        </h2>
        {/* rendering all the todos */}
        <div className="todos  w-full">
          {/* “If there are NO todos, show this message.” 
        true && <div>...</div>  // React renders the div*/}
          {todos.length === 0 && (
            <div className="m-5 text-grey">Add your Todos above</div>
          )}
          {todos.map((item, index) => {
            return (
              (showFinished || !item.isCompleted) && (
                /* 1 single todo card */
                <div
                  key={item._id}
                  className="todo group flex flex-col sm:flex-row items-stretch sm:items-center gap-2 my-2 w-full"
                >
                  {/* for checkbox for tick and cross */}
                  {/* checkbox + todo text */}
                  <div className="flex items-center gap-2 w-full min-w-0 sm:flex-1">
                    <input
                      type="checkbox"
                      name={item._id}
                      onClick={(e) => e.stopPropagation()} // stop todo click
                      onChange={() => handleCheckbox(item._id)}
                      checked={item.isCompleted}
                      className="w-5 accent-indigo-600 cursor-pointer"
                    />
                    {/* Todo text */}
                    <div
                      className={`bg-stone-200 rounded-xl p-2 flex-1 min-w-0 flex items-center group
                       ${item.isCompleted ? "line-through" : ""} 
                       ${editId === item._id ? "ring-1 ring-stone-400 bg-stone-300" : ""}`}
                      onClick={() =>
                        setActiveTodoId(
                          activeTodoId === item._id ? null : item._id,
                        )
                      } // click todo text only toggles active
                    >
                     
                        {item.text}
                        

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // stop bubbling
                          isFavourite(item._id);
                        }}
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

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`
    gap-2 justify-end shrink-0
    ${activeTodoId === item._id ? "flex mt-2 transition-all duration-200" : "hidden"}
    sm:flex sm:mt-0
  `}
                  >
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="Edit-button bg-stone-700 w-7 rounded-2xl p-2 text-white cursor-pointer"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      // (pass id directly)
                      onClick={() => handleDelete(item._id)}
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

export default Todos;
