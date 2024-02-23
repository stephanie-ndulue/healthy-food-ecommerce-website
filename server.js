import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

// configure env
dotenv.config();

// database config
connectDB();

// rest  object
const app = express()

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);


//rest api
app.get('/', (req, res) => {
    res.send('<h1>welcome to Healthy Food E-commerce App</h1>')
});

// PORT
const PORT = process.env.PORT || 8080;

// MODE
const DEV_MODE = process.env.DEV_MODE;

// run listen
app.listen(PORT, () => {
    console.log(`Server is Running on ${DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})