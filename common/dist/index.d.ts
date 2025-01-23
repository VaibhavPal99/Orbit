import z from 'zod';
export declare const SignupUserSchema: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
}>;
export declare type SignupUserInput = z.infer<typeof SignupUserSchema>;
export declare const LoginUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare type LoginUserInput = z.infer<typeof LoginUserSchema>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    profilePic: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    email: string;
    password: string;
    bio?: string | null | undefined;
    profilePic?: string | null | undefined;
}, {
    name: string;
    username: string;
    email: string;
    password: string;
    bio?: string | null | undefined;
    profilePic?: string | null | undefined;
}>;
export declare type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export declare const PostSchema: z.ZodObject<{
    postedBy: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    img: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    postedBy: string;
    text?: string | undefined;
    img?: string | undefined;
}, {
    postedBy: string;
    text?: string | undefined;
    img?: string | undefined;
}>;
export declare type PostInput = z.infer<typeof PostSchema>;
export declare const ReplySchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export declare type ReplyInput = z.infer<typeof ReplySchema>;
export declare const SendMessageSchema: z.ZodObject<{
    recipientId: z.ZodString;
    message: z.ZodString;
    img: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    recipientId: string;
    img?: string | undefined;
}, {
    message: string;
    recipientId: string;
    img?: string | undefined;
}>;
export declare type SendMessageType = z.infer<typeof SendMessageSchema>;
