import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { link } from 'fs';
import { PostSchema,ReplySchema } from '@vaibhavpal99/common_social3';

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
//Middleware for authentication
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

// creating a post 
postRouter.post('/create', async (c) => {
    console.log("Reached /create endpoint");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        console.log(body);

        const {success} = PostSchema.safeParse(body);
        if(!success){
            c.status(411);
            return c.json({
                msg : "Incorrect inputs!"
            })
        }

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

        let imgUrl = '';

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
                PostedById: currentUser,
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
// for getting all the posts that were made by different users whom logged-in user follows
// posts that are shown at the home page of a website are retrieved from here
postRouter.get('/feed', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    try{
    const currentUser = c.get('userId');
    console.log(currentUser);
    const user = await prisma.user.findUnique({
        where : {
            id : currentUser
        }
    })

    if(!user){
        return c.json({
            msg : "User not found"
        },404)
    }

    const followingIds = (await prisma.follow.findMany({
        where: { followerId: currentUser },
        select: { followingId: true },
      })).map((f: { followingId: string }) => f.followingId);

      console.log(followingIds);
  
      const feedPosts = await prisma.post.findMany({
        where: {
          PostedById: { in: followingIds },
        },
        include: {
          postedBy: { select: { username: true, profilePic: true } }, // Include user details
          likes : true,
          replies : true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return c.json(feedPosts, 200);
    } catch (error) {
      console.error(error);
      return c.json({ msg: 'Error while fetching feed posts' }, 500);
    }
})


// to get a specific post made by any user just passing an id as a query parameter
postRouter.get('/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const ID = c.req.param('id');
        const post = await prisma.post.findUnique({
            where: {
                id: ID
            },
            include: {
                likes: true,
                replies:{
                    select :{
                        id : true,
                        text : true,
                        postId : true,
                        user : true,
                        createdAt : true,
                    }
                }
            },
        })

        if(!post){
            c.status(401);
            return c.json({
                msg : "Post not found",
            })
        }
        c.status(200);
        return c.json({post});
    }catch(e){
        console.log(e);
        c.status(500);
        return c.json({
            msg: "Error while fetching Post"
        })

    }
})
// delete a post (this can only be done by the user who has created that particular post)
postRouter.delete('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const ID = c.req.param('id');

        const currentUser = c.get('userId');

        const post = await prisma.post.findUnique({
            where: {
                id : ID,
            }
        })

        if(!post){
            c.status(404);
            return c.json({
                msg: "Post not found"
            })
        }

        if(post.PostedById.toString()!= currentUser.toString()){
            c.status(401);
            return c.json({ msg : "Unauthorized to delete post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop()?.split(".")[0];
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/destroy`;
            if(imgId){
                const body = new URLSearchParams();
                body.append('public_id', imgId);
                body.append('api_key', c.env.CLOUDINARY_API_KEY);
                body.append('timestamp', Math.floor(Date.now() / 1000).toString());
                body.append('signature', await generateSignature(imgId, c.env.CLOUDINARY_API_SECRET));
        
                // Make the request using fetch
                const response = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Cloudinary delete error:', errorText);
                } else {
                    console.log('Image deleted successfully from Cloudinary');
                }   
            }
        }


        await prisma.like.deleteMany({
            where :{
                postId : post.id
            }
        });

        await prisma.reply.deleteMany({
            where : {
                postId : post.id
            }
        });
        
        await prisma.post.delete({
            where: { id: post.id },
        });

        

        c.status(200);
        return c.json({ msg: 'Post deleted successfully.' });
        
    }catch(e){
        console.error('Error deleting post:', e);
        c.status(500);
        return c.json({ msg: 'An error occurred while deleting the post.' });
    }

})

const generateSignature = async (publicId: string, apiSecret: string): Promise<string> => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(signatureBase);

    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
};

// like a post 
postRouter.put('/like/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        const postId = c.req.param('id');
        const post = await prisma.post.findUnique({
            where: {
                id : postId
            }
        })
        const currentUser = c.get('userId');
        console.log(postId);
        console.log(post);
        console.log(currentUser);
        if(!post){
            c.status(404);
            return c.json({
                msg: "Post not found"
            })
        }

        if(!currentUser){
            c.status(404);
            return c.json({
                msg : "userId not found"
            })
        }

        const userLikedPost = await prisma.like.findFirst({
            where: {
                userId : currentUser,
                postId : postId
            }
        })
        console.log(userLikedPost);

        if(userLikedPost){
            await prisma.like.delete({
                where: {
                    id : userLikedPost.id
                }
            })
            return c.json({
                msg : "Post unliked successfully"
            },200) 
        }else{
            const updateLike = await prisma.like.create({
                data: {
                    userId: currentUser,
                    postId: postId
                }
            })
            return c.json({
                updateLike,
                msg: 'Post liked successfully',
            }, 200);
        }
        
    }catch(e){
        console.error(e);
        c.status(500);
        return c.json({
          msg: 'An error occurred while processing the request',
        });
    }
})

// reply to a post
postRouter.put('/reply/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
        console.log("reached here");
        const body = await c.req.json();

        const {success} = ReplySchema.safeParse(body);
        if(!success){
            c.status(411);
            return c.json({
                msg : "Incorrect inputs!",
            })
        }
        const postId = c.req.param('id');
        const currentUser = c.get('userId');
        const text = body.text;
    

        if(!text){
            return c.json({
                msg: "Text field is empty"
            },400)
        }

        const post = await prisma.post.findUnique({
            where: {
                id :postId
            }
        })

        if(!post){
            return c.json({
                msg: "Post not found"
            },404)
        }

        const newReply = await prisma.reply.create({
            data: {
                text : text,
                userId : currentUser,
                postId : postId,
            },
            include :{
                user : true,
                post : true
            }
        })
        c.status(200);
        return c.json(newReply);

    }catch(e){
        console.log(e);
        c.status(500);
        return c.json({ error: 'Error while replying to a post' });

    }
})

// get all the posts of a user by passing username as query parameter
postRouter.get('/user/:username', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{
    const username = c.req.param('username');
    const user = await prisma.user.findUnique({
        where : {
            username : username
        }
    })
    if(!user){ return c.json({msg : "User not found"},404)}

    const posts = await prisma.post.findMany({
        where : {
            postedBy : { 
                username : username 
            }
        },
        include: {
            postedBy: { select: { username: true, profilePic: true } }, // Include additional user details if needed
            likes: true, // Include likes
            replies: true // Include replies
        },
        orderBy: {
            createdAt: 'desc', // Order by creation date descending
        },
    })
    c.status(200);
    return c.json({
        posts,
    })
    
    }catch(e){
        console.log(e);
        c.status(500);
        return c.json({ error: 'Error while fetching the posts' });

    }
})
