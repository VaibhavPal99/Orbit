import { WebSocketServer, WebSocket as WS } from "ws";
import { PrismaClient } from "@prisma/client";
import type { Server } from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Response } from "express";
import type { AuthRequest } from "../types/types.js";



dotenv.config();
const prisma = new PrismaClient();
const clients = new Map<string, WS>();
const JWT_SECRET = process.env.SECRET_KEY!;

interface payload {
    userId: string;
    userName: string;

}

export const websocketSetup = (server: Server) => {

    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WS) => {
        console.log("Client connected");

        let userId: string = "";

        ws.on("message", async (message: Buffer) => {

            const data = JSON.parse(message.toString());

            if (data.type === "register" && data.token) {
                try {
                    const payload = jwt.verify(data.token, JWT_SECRET) as { id: string };
                    userId = payload.id;
                    clients.set(userId, ws);
                    console.log(`User ${userId} connected`);
                } catch (err) {
                    ws.close();
                    return;
                }

            }

            if (!userId) {
                ws.close();
                return;
            }

            if (data.type === "message") {

                const { content, senderId, receiverId } = data;

                let conversation = await prisma.conversation.findFirst({
                    where: {
                        participants: {
                            every: {
                                id: { in: [senderId, receiverId] }
                            }
                        }
                    },
                    include: {
                        participants: true
                    }

                })
                console.log(conversation);

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [{ id: senderId }, { id: receiverId }]
                            }
                        },
                        include: { participants: true }
                    });
                }

                const msg = await prisma.message.create({
                    data: {
                        content,
                        senderId: senderId,
                        receiverId: receiverId,
                        conversationId: conversation.id
                    },
                    include: {
                        sender: true,
                        receiver: true,
                        conversation: true
                    }
                })

                const socket = clients.get(receiverId);
                if (socket) {
                    socket.send(JSON.stringify({ content, senderId, receiverId, conversationId: conversation.id }));
                }
            }
        });

        ws.on("close", () => {
            if (userId) {
                clients.delete(userId);
            }
        })
    });

}

export const getMessages = async (req: AuthRequest, res: Response) => {

    try {
        const { secondId } = req.params;
        const firstId = req.userId;

        if (!firstId || !secondId) {
            return res.status(401).json({ msg: "Unauthorized: userId missing" });
        }

        const convo = await prisma.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        id: { in: [firstId, secondId] }
                    }
                }
            }
        })

        if (convo?.id) {
            const allMessages = await prisma.message.findMany({
                where: {
                    conversationId: convo.id
                },
                orderBy: {
                    createdAt: "asc"
                }
            });

            res.json(allMessages);
        }
    } catch (e) {
        res.status(500).json({
            msg: "Error fetching messages"
        })
    }
}

export const getConversations = async (req: AuthRequest, res: Response) => {

    try {
        const firstId = req.userId;

        if (!firstId) {
            return res.status(401).json({ msg: "Unauthorized: userId missing" });
        }
        console.log(firstId);
        const convos = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        id: firstId
                    }
                }
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }
                },
                participants: true,
            },
            orderBy : {
                updatedAt : "desc"
            }
        })

        res.json(convos);
    } catch (e) {
        res.status(500).json({
            msg: "Error fetching conversations"
        })

    }
}





