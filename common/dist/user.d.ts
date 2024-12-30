import z from "zod";
export declare const SearchUserSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filter?: string | undefined;
}, {
    filter?: string | undefined;
}>;
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
export type SignupUserInput = z.infer<typeof SignupUserSchema>;
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
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    password: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    email: z.ZodOptional<z.ZodString>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    profilePic: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    bio?: string | null | undefined;
    profilePic?: string | null | undefined;
}, {
    name?: string | undefined;
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    bio?: string | null | undefined;
    profilePic?: string | null | undefined;
}>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
