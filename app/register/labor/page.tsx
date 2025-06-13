"use client";

import {
  Button,
  Radio,
  Label,
  TextInput,
  Select,
  ThemeProvider,
} from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  registerLabor,
  fetchAreasByVillage,
  Area,
  Village,
  fetchVillages,
} from "@/services/authService";
import AcmeLogo from "@/app/ui/acme-logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRegistrationLabor,
  RegistrationLaborData,
} from "@/schemas/registrationLabor";

export default function LaborStepTwo() {
  const t = useTranslations("Global");
  const router = useRouter();

  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const [villages, setVillages] = useState<Village[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = createRegistrationLabor(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationLaborData>({
    resolver: zodResolver(schema),
  });

  const watchVillageId = watch("village_id");

  useEffect(() => {
    fetchVillages().then(setVillages).catch(console.error);
  }, []);

  useEffect(() => {
    if (watchVillageId) {
      fetchAreasByVillage(parseInt(watchVillageId))
        .then(setAreas)
        .catch(console.error);
    }
  }, [watchVillageId]);

  const onSubmit = async (data: RegistrationLaborData) => {
    setApiError(null);

    if (!registrationData) {
      setApiError(t("missing_step1_data"));
      return;
    }

    try {
      setLoading(true);
      await registerLabor({
        village_id: parseInt(data.village_id),
        full_name: registrationData.full_name,
        phone_number: registrationData.contact_number,
        password: registrationData.password,
        role: "labor",
        area_id: parseInt(data.area_id),
        gender: data.gender,
        hourly_rate: parseFloat(data.hourly_rate),
      });

      router.push("/login");
    } catch (err: any) {
      setApiError(err.response?.data?.detail || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={farmTheme}>
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-10">
          <div className="flex h-20 w-full items-end rounded-lg bg-green-50 p-3">
            <div className="w-32 text-white md:w-36">
              <AcmeLogo />
            </div>
          </div>

          <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-4">
            <form
              className="flex max-w-md flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <Label htmlFor="village">{t("village")}</Label>
                <Select
                  id="village"
                  {...register("village_id")}
                  color="success"
                  defaultValue=""
                >
                  <option value="">{t("select")}</option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.village_name}
                    </option>
                  ))}
                </Select>
                {errors.village_id && (
                  <p className="text-red-500">{errors.village_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="area">{t("area")}</Label>
                <Select id="area" {...register("area_id")} color="success">
                  <option value="">{t("select")}</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.area_name}
                    </option>
                  ))}
                </Select>
                {errors.area_id && (
                  <p className="text-red-500">{errors.area_id.message}</p>
                )}
              </div>

              <div className="flex flex-row gap-4">
                <div>
                  <Radio
                    id="male"
                    value="male"
                    {...register("gender")}
                    color="success"
                  />
                  <Label htmlFor="male" className="ml-1">
                    {t("male")}
                  </Label>
                </div>
                <div>
                  <Radio
                    id="female"
                    value="female"
                    {...register("gender")}
                    color="success"
                  />
                  <Label htmlFor="female" className="ml-1">
                    {t("female")}
                  </Label>
                </div>
              </div>
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}

              <div>
                <Label htmlFor="rate">{t("rate")}</Label>
                <TextInput
                  id="rate"
                  type="number"
                  step="0.01"
                  placeholder={t("rate")}
                  {...register("hourly_rate")}
                  color="success"
                />
                {errors.hourly_rate && (
                  <p className="text-red-500">{errors.hourly_rate.message}</p>
                )}
              </div>

              {apiError && <p className="text-red-600 text-sm">{apiError}</p>}

              <Button type="submit" color="success">
                {t("submit")}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
