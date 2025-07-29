// 1. IMPORT DEPENDENCIES
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from './routes/posts.js'; // 1. Import post routes
import userRoutes from './routes/users.js'; // 1. Import user routes

// import { InsertMany } from "./models/User.js";
// import allDocs from "./models/viewDoc.js";

// 2. INITIALIZE EXPRESS APP
const app = express();

// 3. CONNECT TO DATABASE
// This will connect to MongoDB using the URI defined in the .env file
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/user";

await connectDB(MONGO_URL);

// InsertMany() //to inset data into the User collection

// allDocs(); // to fetch all documents from the User collection

// 4. MIDDLEWARE SETUP
// Enable Cross-Origin Resource Sharing for all routes
// This allows our frontend (on a different URL) to communicate with this backend
app.use(cors());

// Enable Express to parse JSON formatted request bodies
// This is crucial for handling POST/PUT requests
app.use(express.json());

// 5. DEFINE API ROUTES
// Any request to '/api/auth' will be handled by our auth routes file
app.use("/api/auth", authRoutes);
app.use('/api/posts', postRoutes); // 2. Use post routes
app.use('/api/users', userRoutes); // 2. Use user routes

// A simple GET route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Dev Meetup API is running!");
  res.status(200).json({ message: "Welcome to the Dev Meetup API!" });
});
// 6. START THE SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access it at http://localhost:${PORT}`);
});
