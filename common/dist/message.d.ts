import z from "zod";
export declare const SendMessageSchema: z.ZodObject<{
    recipientId: z.ZodString;
    message: z.ZodString;
    img: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    recipientId: string;
    message: string;
    img?: string | undefined;
}, {
    recipientId: string;
    message: string;
    img?: string | undefined;
}>;
export type SendMessageType = z.infer<typeof SendMessageSchema>;
