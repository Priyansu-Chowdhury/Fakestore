import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import { connectDB } from "./config/db.config";
import productRoutes from "./routes/products.routes";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Enable CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
};

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
});

// Create an Express application
const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/v1/products", productRoutes);

// Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server url: http://localhost:${PORT}`);
});
