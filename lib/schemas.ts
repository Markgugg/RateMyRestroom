import { z } from "zod";

export const reviewSchema = z.object({
  cleanliness: z.number().int().min(1).max(5),
  privacy: z.number().int().min(1).max(5),
  amenities: z.number().int().min(1).max(5),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export const threadSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
});

export const replySchema = z.object({
  body: z.string().min(1).max(5000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ThreadInput = z.infer<typeof threadSchema>;
export type ReplyInput = z.infer<typeof replySchema>;
