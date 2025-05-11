import { z } from "zod";

export const requestUserSchema = z.object({
	role: z.object({
		code: z.string(),
		name: z.string()
	}).refine((data) => data.code !== "", {
		message: "Role is required",
	}),
	reason: z.string().min(1, {
		message: "Reason is required",
	}),
});
