import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import{
    getLogs,
    addLog,
    deleteLog,
    updateLog
} from "../controllers/studylogController.js";

const router=express.Router();

router.get("/",authMiddleware,getLogs);
router.post("/",authMiddleware,addLog);
router.put("/:id",authMiddleware,updateLog);
router.delete("/:id",authMiddleware,deleteLog);

export default router;