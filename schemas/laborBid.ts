import { z } from "zod";

export type LaborBidFormValues = z.infer<ReturnType<typeof getLaborBidSchema>>;

const optionalPayment = z.preprocess((val) => {
  const num = Number(val);
  return val === "" || val == null || isNaN(num) ? undefined : num;
}, z.number().positive().optional());

export const getLaborBidSchema = (t: any, requiredLabors: number) =>
  z
    .object({
      per_day: optionalPayment,
      lump_sump: optionalPayment,
      hourly: optionalPayment,
      per_bigha: optionalPayment,
      per_weight: optionalPayment,

      male_labors: z.preprocess(
        (val) => (val === "" || val == null ? undefined : Number(val)),
        z
          .number({ invalid_type_error: t("validation.required") })
          .int()
          .min(0, t("validation.required"))
      ),

      female_labors: z.preprocess(
        (val) => (val === "" || val == null ? undefined : Number(val)),
        z
          .number({ invalid_type_error: t("validation.required") })
          .int()
          .min(0, t("validation.required"))
      ),

      date: z.preprocess(
        (val) =>
          typeof val === "string" || val instanceof Date ? new Date(val) : val,
        z.date({ required_error: t("validation.required") })
      ),

      description: z.string().optional(),
    })
    .refine(
      (data) =>
        data.per_day ||
        data.lump_sump ||
        data.hourly ||
        data.per_bigha ||
        data.per_weight,
      {
        message: t("validation.one_payment_type_required"),
        path: ["per_day"],
      }
    )
    .refine(
      (data) =>
        (data.male_labors || 0) + (data.female_labors || 0) <= requiredLabors,
      {
        message: t("validation.labors_count_must_not_exceeds"),
        path: ["male_labors"],
      }
    );
