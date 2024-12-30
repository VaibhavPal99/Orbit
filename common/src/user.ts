import z from "zod";

export const SearchUserSchema = z.object({
    filter: z.string().optional(),
  });
  
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
  });
  export type LoginUserInput = z.infer<typeof LoginUserSchema>;
  
  export const UpdateUserSchema = z.object({
    name: z.string().min(3).max(40).optional(),
    username: z.string().min(3).max(20).optional(),
    password: z.string().min(6).max(20).optional().or(z.literal("")),
    email: z.string().email().optional(),
    bio: z.string().max(50).optional().nullable(),
    profilePic: z.string().optional().nullable(),
  });
  export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
