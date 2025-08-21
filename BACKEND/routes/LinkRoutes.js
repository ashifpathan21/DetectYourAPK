import express from "express";
const router = express.Router();
import {analyse} from "../controllers/LinkController.js"

router.post("/analyze", analyse);

export default router;