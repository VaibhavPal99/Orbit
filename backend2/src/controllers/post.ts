import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        SECRET_KEY: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

postRouter.use('/*', async (c, next) => {
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

postRouter.post('/create', async (c) => {
    console.log("Reached /create endpoint");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        console.log(body);

        const ID = c.get('userId');
        const user = await prisma.user.findUnique({
            where: {
                id: ID
            }
        });

        if (!user) {
            return c.json({
                msg: "User not found"
            });
        }

        const currentUser = c.get('userId');
        if (currentUser !== user.id) {
            c.status(401);
            return c.json({
                msg: "Unauthorized to create a Post"
            });
        }

        const maxLength = 500;
        if (body.text && body.text.length > maxLength) {
            c.status(400); 
            return c.json({
                msg: `Text must be less than ${maxLength} characters`
            });
        }

        let imgUrl = ''; // Initialize imgUrl

        // Check if the image is in base64 format
        if (body.file) {
            try {
                // Cloudinary upload URL
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

                // Create the form data for the request
                const formData = new FormData();
                formData.append('file', body.file); // Base64 image data
                formData.append('upload_preset', 'ylxdtj0f'); // Replace with your actual upload preset

                // Make the request using fetch
                const response = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData,
                });

                // Check if the request was successful
                if (!response.ok) {
                    const errorText = await response.text(); // Read the response text
                    console.error('Error uploading image to Cloudinary:', errorText);
                    c.status(500);
                    return c.json({ msg: 'Failed to upload image to Cloudinary.' });
                }

                // Parse the response as JSON
                const result: { secure_url: string } = await response.json();
                imgUrl = result.secure_url;
                console.log('Image uploaded successfully:', imgUrl);

            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                return c.json({
                    msg: 'Failed to upload image to Cloudinary.'
                });
            }
        } else {
            console.error('Invalid image format. Expected base64 string.');
            return c.json({
                msg: 'Invalid image format. Please provide a base64 encoded image.'
            });
        }

        const newPost = await prisma.post.create({
            data: {
                text: body.text,
                img: imgUrl,
                PostedById: currentUser
            }
        });

        c.status(201);
        return c.json({
            newPost
        });

    } catch (e) {
        console.error('Error:', e);
        c.status(500);
        return c.json({
            msg: "An exception has occurred"
        });
    }
});
