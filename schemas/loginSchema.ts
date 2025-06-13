// /schemas/loginSchema.ts
import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().regex(/^\d{10}$/, t("invalid_phone_number")),
    password: z.string().min(6, t("password_min")),
  });

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
