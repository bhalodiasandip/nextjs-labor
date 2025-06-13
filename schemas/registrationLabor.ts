import { z } from "zod";

export const createRegistrationLabor = (t: (key: string) => string) =>
  z.object({
    village_id: z.string().min(1, t("village_required")),
    area_id: z.string().min(1, t("area_required")),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: t("gender_required") }),
    }),
    hourly_rate: z
      .string()
      .min(1, t("rate_required"))
      .refine((val) => parseFloat(val) > 0, {
        message: t("rate_must_be_positive"),
      }),
  });

export type RegistrationLaborData = z.infer<
  ReturnType<typeof createRegistrationLabor>
>;
