import { z } from "zod";

export const createRegistrationTractor = (t: (key: string) => string) =>
  z.object({
    village_ids: z.array(z.number()).min(1, { message: t("village_required") }),
    skill_ids: z.array(z.number()).min(1, { message: t("skill_required") }),
  });

export type RegistrationTractorData = z.infer<
  ReturnType<typeof createRegistrationTractor>
>;
