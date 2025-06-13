import { z } from "zod";

export const getLaborBidSchema = (t: any, requiredLabors: number) =>
  z
    .object({
      per_day: z
        .union([z.number().int().positive(), z.literal(undefined)])
        .optional(),
      lump_sump: z
        .union([z.number().int().positive(), z.literal(undefined)])
        .optional(),
      per_weight: z
        .union([z.number().int().positive(), z.literal(undefined)])
        .optional(),

      male_labors: z
        .union([z.number().int().min(0), z.literal(undefined)])
        .optional(),
      female_labors: z
        .union([z.number().int().min(0), z.literal(undefined)])
        .optional(),

      date: z.date({ required_error: t("validation.required") }),
      description: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Payment type group validation
      const paymentValues = [data.per_day, data.lump_sump, data.per_weight];
      const filledPayments = paymentValues.filter((v) => v !== undefined);
      if (filledPayments.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.one_payment_type_required"),
          path: ["payment_group"],
        });
      }

      // Labor count group validation
      const male = data.male_labors ?? 0;
      const female = data.female_labors ?? 0;

      if (male + female === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.one_labor_required"),
          path: ["labor_group"],
        });
      }

      if (male + female > requiredLabors) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.labors_exceed"),
          path: ["labor_group"],
        });
      }
    });

export type LaborBidFormValues = z.infer<ReturnType<typeof getLaborBidSchema>>;
