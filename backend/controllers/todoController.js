import Todos from "../models/TodosModel.js"

//  GET all todos for user
export const getTodos = async (req, res) => {
  const userId = req.user.id;

  const todos = await Todos.find({ userId }).sort({ order: 1 }); //always fetch in sorted order
  res.json(todos);
};

//  ADD todo

export const addTodo = async (req, res) => {
  const userId = req.user.id;
  const { text } = req.body;
  const count = await Todos.countDocuments({ userId });
  const todo = await Todos.create({
    userId,
    text,
    order: count
  });

  res.json(todo);
};

// DELETE todo
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  await Todos.findByIdAndDelete(id);
  res.json({ msg: "Deleted" });
};

//  TOGGLE complete
export const toggleTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const todo = await Todos.findOne({ _id: id, userId });

  if (!todo) return res.status(404).json({ msg: "Todo not found" });

  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  res.json(todo);
};
//toggle favorite
export const toggleFavourite = async (req, res) => {
  const { id } = req.params;

  const todo = await Todos.findById(id);
  if (!todo) return res.status(404).json({ msg: "Todo not found" });

  todo.isFav = !todo.isFav;
  await todo.save();

  res.json(todo);
};
//update a todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const todo = await Todos.findByIdAndUpdate(
    id,
    { text },
    { new: true }
  );

  res.json(todo);
};

//reset todos
export const resetTodos = async (req, res) => {
  const userId = req.user.id;

  await Todos.deleteMany({ userId });

  res.json({ msg: "All todos deleted" });
};

//reorder todo
export const reorderTodos = async (req, res) => {
  const updates = req.body.todos;

  const bulkOps = updates.map((t) => ({
    updateOne: {
      filter: { _id: t.id },
      update: { order: t.order },
    },
  }));

  await Todos.bulkWrite(bulkOps);

  res.json({ msg: "Order updated" });
};
