import z from "zod";

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