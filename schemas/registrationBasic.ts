import { z } from "zod";

export const createRegistrationBasic = (t: (key: string) => string) =>
  z
    .object({
      full_name: z.string().min(2, t("full_name_required")),
      contact_number: z
        .string()
        .regex(/^\d{10,15}$/, t("invalid_phone_number")),
      password: z.string().min(6, t("password_min")),
      confirm_password: z.string(),
      role: z.enum(["farmer", "labor", "tractor"], {
        errorMap: () => ({ message: t("role_required") }),
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t("passwords_do_not_match"),
      path: ["confirm_password"],
    });

export type RegistrationBasicData = z.infer<
  ReturnType<typeof createRegistrationBasic>
>;
