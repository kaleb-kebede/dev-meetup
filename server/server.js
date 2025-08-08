// 1. IMPORT DEPENDENCIES
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from 'path'; // 1. Import the 'path' module
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from './routes/posts.js'; // 1. Import post routes
import userRoutes from './routes/users.js'; // 1. Import user routes
import uploadRoutes from './routes/upload.js'; // 2. Import upload routes
import messageRoutes from './routes/messages.js'; // Direct messaging routes
import githubRoutes from './routes/github.js'; // GitHub integration routes

// import { InsertMany } from "./models/User.js";
// import allDocs from "./models/viewDoc.js";

// --- ES Module Workaround for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/upload', uploadRoutes); // 3. Use the new upload routes
app.use('/api/messages', messageRoutes); // Direct messaging API
app.use('/api/github', githubRoutes); // GitHub integration API

// --- Make 'uploads' folder static ---
// 4. This makes the /uploads folder accessible to the public
// so the browser can request the images stored inside it.
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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
