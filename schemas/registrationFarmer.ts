import { z } from "zod";

export const createRegistrationFarmer = (t: (key: string) => string) =>
  z.object({
    village_ids: z.array(z.number()).min(1, { message: t("village_required") }),
    area_ids: z.array(z.number()).min(1, { message: t("area_required") }),
  });

export type RegistrationFarmerData = z.infer<
  ReturnType<typeof createRegistrationFarmer>
>;
