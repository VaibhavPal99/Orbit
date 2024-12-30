import z from "zod";
export declare const PostSchema: z.ZodObject<{
    postedBy: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    img: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    postedBy: string;
    img?: string | undefined;
    text?: string | undefined;
}, {
    postedBy: string;
    img?: string | undefined;
    text?: string | undefined;
}>;
export type PostInput = z.infer<typeof PostSchema>;
export declare const ReplySchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export type ReplyInput = z.infer<typeof ReplySchema>;
