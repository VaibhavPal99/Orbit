
import { Hono } from 'hono'
import { userRouter } from './controllers/user';
import { postRouter } from './controllers/post';
import { v2 as cloudinary } from 'cloudinary';
import {cors} from "hono/cors"
import {config} from 'dotenv'


config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });




const app = new Hono()
app.use('/*', cors());
app.route("api/v1/user", userRouter);
app.route("api/v1/post", postRouter);


export default app
