import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { Prisma, PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        SECRET_KEY : string;
    }
    Variables: {
        userId: string
    }
}>()


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
            }
        })

        if(!user){
            return c.json({
                msg: "User not Found"
            })
        }

        return c.json({
            id: user.id,
            name:user.name,
            username: user.username,
            email: user.email,
            password: user.password,
            bio:user.bio,
            isFrozen: user.isFrozen,
            profilePic: user.profilePic,
        })

    }catch(e){
        return c.json({
            msg : "An error has occured"
        })

    }
})



//Signup Route
userRouter.post('/signup', async (c) =>{

    const body = await c.req.json();
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
        }

    })
    const jwt = await sign({
        id: user.id,
        username: user.username,
    },c.env.SECRET_KEY)
    return c.text(jwt);

    }catch(e){
        console.log(e);
        c.status(411);
        return c.text("Invalid! Error Occured")

    }   
})

//Signin Route
userRouter.post('/signin',async (c) => {

    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{  
    const user = await prisma.user.findFirst({
        where: {
            username: body.username,
            password: body.password 
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
    return c.text(jwt);

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


userRouter.put('/update', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const ID = c.get('userId');


    const detail = await prisma.user.update({
        where: {
            id: ID,
        },
        data : {
            name: body.name,
            password:body.password,
            username: body.username,
            email: body.email,
            profilePic: body.profilePic,
            bio: body.bio,
        }
    })
    
    return c.json({
        id: detail.id,
        msg: "Profile Updated"
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



