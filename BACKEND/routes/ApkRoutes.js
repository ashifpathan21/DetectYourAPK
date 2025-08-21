import express from "express" ;
import { upload } from "../middlewares/multer.js";
import {analyse } from "../controllers/ApkController.js"
const router = express.Router() ;

router.post("/analyze"  , upload.single("apk") , analyse)

export default router;