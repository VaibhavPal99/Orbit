import z from 'zod';

export const SignupUserSchema = z.object({

    name: z.string().min(3).max(40),
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(20),
});

export type SignupUserInput = z.infer<typeof SignupUserSchema>;


export const LoginUserSchema = z.object({

    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
})

export type LoginUserInput = z.infer<typeof LoginUserSchema>

export const UpdateUserSchema = z.object({
    name: z.string().min(3).max(40),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
    email: z.string().email(),
    bio: z.string().max(50).optional().nullable(),
    profilePic: z.string().optional().nullable(),
})
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const PostSchema = z.object({
    postedBy: z.string(),
    text: z.string().optional(),
    img: z.string().optional(),
});

export type PostInput = z.infer<typeof PostSchema>;

export const ReplySchema = z.object({
    text: z.string(),
});

export type ReplyInput = z.infer<typeof ReplySchema>;

export const SendMessageSchema = z.object({
    recipientId: z.string(),
    message: z.string(),
    img: z.string().optional(),
});

export type SendMessageType = z.infer<typeof SendMessageSchema>;