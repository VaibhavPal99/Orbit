import { Hono } from 'hono';
import { userRouter } from './controllers/user';
import { postRouter } from './controllers/post';
import { v2 as cloudinary } from 'cloudinary';
import { cors } from 'hono/cors';
import { messageRouter } from './controllers/message';

const app = new Hono();

// CORS configuration
const corsOptions = {
  origin: ['https://orbit-blond.vercel.app', 'http://localhost:5173','https://social-fg6if1rlf-vaibhavs-projects-b70349fd.vercel.app'], // Allow requests from the frontend
  credentials: true, // Allow credentials (cookies)
};

app.use('/*', cors(corsOptions)); // Apply the CORS middleware globally

// Define routes
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("/api/v1/message", messageRouter);

// Initialize cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set a default route or any additional middleware if needed
app.get("/", (ctx) => ctx.json({ message: "API is working!" }));

export default app;
