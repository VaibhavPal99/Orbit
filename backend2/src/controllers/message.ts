import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { Prisma, PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { SignupUserSchema, LoginUserSchema, UpdateUserSchema } from '@vaibhavpal99/common_social3';



export const messageRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        SECRET_KEY : string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    }
    Variables: {
        userId: string
    }
}>()

messageRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("Authorization") || " ";

    try {
        const user = (await verify(authHeader, c.env.SECRET_KEY)) as { id: string };

        if (user) {
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403);
            return c.json({
                msg: "Wrong JWT sent, you are not an authorized user!",
            });
        }
    } catch (e) {
        c.status(403);
        return c.json({
            msg: "An exception has occurred while fetching your request",
        });
    }
});

messageRouter.post('/', async (c) => {

   
})
