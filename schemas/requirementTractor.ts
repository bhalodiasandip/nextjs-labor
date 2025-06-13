import { z } from "zod";

export function getTractorRequirementSchema(t: (key: string) => string) {
  return z.object({
    area: z.number().min(1, t("area_required")),
    land_size: z.string().min(1, t("land_size_required")),
    skill: z.number().min(1, t("skill_required")),
    payment_type: z.enum(["per_bigha", "lump_sump", "hourly"]),
    description: z.string().optional(),
    date: z.date({ required_error: t("date_required") }),
    shift: z.enum(["morning", "evening", "anytime", "fullday"], {
      required_error: t("shift_required"),
    }),
    type: z.enum(["labor", "tractor"]),
  });
}

export type TractorRequirementData = z.infer<
  ReturnType<typeof getTractorRequirementSchema>
>;
