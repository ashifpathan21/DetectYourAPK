import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "./utils/db.js";
import ApkRoutes from "./routes/ApkRoutes.js" ;
import LinkRoutes from "./routes/LinkRoutes.js";
import FeedbackRoutes from "./routes/FeedbackRoutes.js";
import Report from "./routes/Report.js";

config();
connect();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173/", process.env.FRONTEND_URL], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
const PORT = process.env.PORT;


app.use("/apk" , ApkRoutes );
app.use("/link" , LinkRoutes );
app.use("/feedback", FeedbackRoutes);
app.use("/report", Report);

// Add this to your Express app
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Add this error handling middleware
app.use((error, req, res, next) => {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong. Please try again later.'
  });
});


export default app ;


