
import { Hono } from 'hono';
import { userRouter } from './controllers/user';
import { postRouter } from './controllers/post';
import { v2 as cloudinary } from 'cloudinary';
import {cors} from "hono/cors";



const app = new Hono();
app.use('/*', cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);

export default app;
