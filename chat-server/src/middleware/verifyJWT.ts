import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../types/types.js";



const JWT_SECRET = process.env.SECRET_KEY!;

export const verifyJWT = (req : AuthRequest, res : Response, next : NextFunction) => {

    const authHeader = req.header("Authorization") || " ";
    
    try{
        const user = jwt.verify(authHeader, JWT_SECRET) as {id : string};
        if(user){
            req.userId = user.id;
            return next();
        }else{
            return res.status(403).json({
                msg : "Wrong JWT send, you are not authorized user"
            });
        }
    }catch(e){
        return res.status(403).json({
            msg : "An exception has occurred while fetching your request",
        })
    }

}