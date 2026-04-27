import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  toggleFavourite,
  updateTodo,
  resetTodos,
  reorderTodos
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", authMiddleware, getTodos);
router.post("/", authMiddleware, addTodo);
router.delete("/reset", authMiddleware, resetTodos);
router.put("/reorder", authMiddleware, reorderTodos);
router.put("/toggle/:id", authMiddleware, toggleTodo);
router.put("/fav/:id", authMiddleware, toggleFavourite);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);



export default router;