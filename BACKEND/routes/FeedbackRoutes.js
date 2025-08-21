import express from "express";
import {add , get } from "../controllers/FeedbackController.js"
const router = express.Router();

router.post("/add",add);
router.get("/get",get);

export default router;