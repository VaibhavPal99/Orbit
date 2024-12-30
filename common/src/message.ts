import z from "zod";

export const SendMessageSchema = z.object({
  recipientId: z.string(),
  message: z.string(),
  img: z.string().optional(),
});

export type SendMessageType = z.infer<typeof SendMessageSchema>;