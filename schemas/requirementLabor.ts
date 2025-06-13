import { z } from "zod";

export const getLaborRequirementSchema = (t: any) =>
  z.object({
    area: z.number().min(1, t("validation.required")),
    land_size: z.string().min(1, t("validation.required")),

    skill: z.number().min(1, t("validation.required")),
    number_of_labors: z.number().min(1, t("validation.min")),
    description: z.string().optional(),

    // Removed `payment_type`

    // Removed old `date` field
    from_date: z.date({ required_error: t("validation_required") }),
    to_date: z.date({ required_error: t("validation_required") }),

    shift: z.enum(["morning", "evening", "anytime", "fullday"]),
    has_pickup: z.boolean().optional(),
    snacks_facility: z.boolean().optional(),
    type: z.literal("labor"),
  });

export type LaborRequirementData = z.infer<
  ReturnType<typeof getLaborRequirementSchema>
>;
