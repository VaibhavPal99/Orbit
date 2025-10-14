import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { Prisma, PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { SignupUserSchema, LoginUserSchema, UpdateUserSchema } from '@vaibhavpal99/common_social3';



export const userRouter = new Hono<{
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

//Middleware for Authentication
userRouter.use('/*', async (c,next)=> {
    const authHeader = c.req.header("Authorization")|| " ";
    
    const isPublicRoute = c.req.path === '/api/v1/user/signup' || c.req.path === '/api/v1/user/signin';

    if (isPublicRoute) {
        // Skip authentication for public routes
        await next();
        return;
    }

    try {
        const user = (await verify(authHeader, c.env.SECRET_KEY)) as { id: string };
    
        if (user) {
          c.set("userId", user.id);
          await next();
        } else {
          c.status(403);
          return c.json({
            msg: "wrong jwt sent, you are not an authorized user!",
          });
        }
      } catch (e) {
        c.status(403);
        return c.json({
          msg: "An exception has occured while fetching you request",
        });
      }
})

// to get profile of a specific user
userRouter.get('/profile/:query', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const query = c.req.param('query');

    try {
        const user = await prisma.user.findFirst({
            where : {
                OR : [
                    {id: query},
                    {username: query}
                ]
            },
            select : {
                id:true,
                name:true,
                username:true,
                email:true,
                password:true,
                bio:true,
                isFrozen:true,
                profilePic:true,
                followers:true,
                followings:true,
            }
        })

        if(!user){
            return c.json({
                msg: "User not Found"
            })
        }

        return c.json(user);

    }catch(e){
        return c.json({
            msg : "An error has occured"
        })

    }
})



//Signup Route
userRouter.post('/signup', async (c) =>{

    const body = await c.req.json();
    const {success} = SignupUserSchema.safeParse(body);

    if(!success) {
        c.status(411);
        return c.json({
            msg: "Inputs are incorrect!",
        })
    }


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{  
    const user = await prisma.user.create({
        data: {
            name: body.name,
            username: body.username,
            email: body.email,
            password: body.password,
            profilePic: body.profilePic|| " ", // Required
            bio: body.bio || " ",        // Optional
            isFrozen: body.isFrozen || false
        },
        select :{
           id : true,
           name : true,
           username : true,
           email : true,
           password : true,
           bio : true,
           isFrozen : true,
           profilePic : true,
           followers: {
            include : {
                follower : true
            }
           },
           followings : true,

        }

    })
    const jwt = await sign({
        id: user.id,
        username: user.username,
    },c.env.SECRET_KEY)


    return c.json({
        user,
        token : jwt
    })

    }catch(e){
        console.log(e);
        c.status(411);
        return c.text("Invalid! Error Occured")

    }   
})

//Signin Route
userRouter.post('/signin',async (c) => {

    const body = await c.req.json();
    const {success} = LoginUserSchema.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            msg : "Incorrect Inputs!",
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{  
    const user = await prisma.user.findFirst({
        where: {
            username: body.username,
            password: body.password 
        },
        select :{
            id : true,
            name : true,
            username : true,
            email : true,
            password : true,
            bio : true,
            isFrozen : true,
            profilePic : true,
            followers: {
                include : {
                    follower : true
                }
            },
            followings : true,
        }

    })

    if(!user){
        c.status(403);
        return c.json({
            msg: "Incorrect Credentials"
        })
    }
    const jwt = await sign({
        id: user.id,
        username: user.username,
    },c.env.SECRET_KEY)
    
    return c.json({
        user,
        token : jwt
    })

    }catch(e){
        console.log(e);
        c.status(411);
        return c.text("Invalid! Error Occured")

    }   
})


//Follow & Unfollow
userRouter.post('/follow/:id',async (c) => {

   
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const targetUserId = c.req.param('id');
    const currentUserId = c.get('userId');

    try{
        const userToModify = await prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        })

        if(!userToModify){
            return c.json({
                msg: "User not found"
            })
        }

        if(targetUserId === currentUserId){
            c.status(400)
            return c.json({
                msg: "You cannot follow/unfollow yourself"
            })
        }

        const isAlreadyFollowing = await prisma.follow.findFirst({
            where: {
                    followerId: currentUserId,
                    followingId: targetUserId,
            }
        })

        if(isAlreadyFollowing){

            await prisma.follow.delete({
                where: {
                    id: isAlreadyFollowing.id,
                }
            })

            return c.json({
                msg: `You have unfollowed User ${targetUserId}`
            })

        }else{

            await prisma.follow.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                }
            })

            return c.json({
                msg: `You are now following User ${targetUserId}`
            })
        }

    }catch(e){
        return c.json({
            msg: "An exception has occured"
        })
    }    
})

//update user information
userRouter.put('/update', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const ID = c.get('userId');

    const {success} = UpdateUserSchema.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg : "Incorrect inputs!"
        })
    }
    let imgUrl = '';
    
    if(body.profilePic && body.profilePic.trim() !== ""){
        try{
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
            const formData = new FormData();
            formData.append('file', body.profilePic); 
            formData.append('upload_preset', 'ylxdtj0f');

            const response = await fetch(cloudinaryUrl, {
                method : 'POST',
                body : formData,
            });
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
        }catch(e){
            console.error('Error uploading image to Cloudinary:', e);
                return c.json({
                    msg: 'Failed to upload image to Cloudinary.'
                });
        }
    }

    const updateData: any = {};
    if (body.name && body.name.trim() !== "") updateData.name = body.name;
    if (body.password && body.password.trim() !== "") updateData.password = body.password;
    if (body.username && body.username.trim() !== "") updateData.username = body.username;
    if (body.email && body.email.trim() !== "") updateData.email = body.email;
    if (body.bio && body.bio.trim() !== "") updateData.bio = body.bio;
    if (imgUrl !== "") updateData.profilePic = imgUrl;

    // Perform the update only if there are changes
    let detail;
    if (Object.keys(updateData).length > 0) {
        detail = await prisma.user.update({
            where: {
                id: ID,
            },
            data: updateData,
        });
    } else {
        return c.json({
            msg: "No changes detected to update.",
        });
    }

    const user = await prisma.user.findUnique({
        where : {
            id : detail.id,
        },
        select : {
            id : true,
            name : true,
            username : true,
            email : true,
            password : true,
            bio : true,
            isFrozen : true,
            profilePic : true,
            followers: true,
            followings : true,
        }
    })
    
    return c.json({
        user
    })
})

userRouter.put('/freeze', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const ID = c.get('userId');
        const user = await prisma.user.update({
            where: {
                id: ID
            },
            data : {
                isFrozen: true
            }
        })

        return c.json({
            msg : `User ${ID} has been frozen`
        })

    }catch(e){
        return c.json({
            msg : "An error has occured"
        })
    }
})

userRouter.get('/suggested', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get('userId'); // Assuming `userId` is available in the context

    // Step 1: Fetch the IDs of users followed by the current user
    const usersFollowedByYou = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true, // Select only the IDs of users being followed
      },
    });

    // Extract the followed user IDs into an array
    const followedUserIds = usersFollowedByYou.map((user) => user.followingId);

    // Step 2: Fetch a list of 10 users excluding the current user and followed users
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [userId, ...followedUserIds], // Exclude the current user and followed users
        },
      },
      take: 5, // Limit the result to 10 users
      orderBy: {
        createdAt: 'desc', // Optionally, sort by a specific field like `createdAt`
      },
      select: {
        id: true,
        name: true,
        username: true, // Include fields you want to return
        profilePic: true, // Example field
      },
    });

    // Step 3: Return the suggested users
    return c.json(suggestedUsers);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch suggested users' }, 500);
  } finally {
    await prisma.$disconnect();
  }
});


userRouter.get('/bulk', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // const query = c.req.query();

    const currentUserId = c.get('userId');

    // const filter = query.filter || "";
    try{
        // const users = await prisma.user.findMany({
        //     where: {
        //       username: {
        //         contains: filter, // Use 'contains' for case-insensitive partial matching
        //         mode: 'insensitive', // This makes the filter case-insensitive
        //       },
        //     },
        //     select: {
        //       id: true,
        //       name : true,
        //       username: true,
        //       email: true, 
        //       profilePic: true,
        //       bio: true,
        //       isFrozen: true,
        //       followers: true,
        //       followings: true,
        //     },
        //   });

        // return c.json(users, 200);


        const users = await prisma.follow.findMany({
            where :{
                followerId : currentUserId
            },
            include : {
                following : {
                  include : {
                    followers : true,
                    followings : true
                  }
                },
            }
        })
        return c.json(users,200);
    }catch(e){
        console.error(e); // Log error for debugging
        return c.json({ error: "No User Found" }, 500);
    }
})


userRouter.post('/logout', async (c) => {
    try {
      // Set the JWT cookie to expire immediately to "log out" the user
      c.header('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict');
      
      return c.json({ message: 'User logged out successfully' }, 200);
    } catch (err) {
      console.error(err);
      return c.json({ error: 'An error occurred while logging out' }, 500);
    }
  });
  