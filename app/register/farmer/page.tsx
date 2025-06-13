"use client";

import dynamic from "next/dynamic";
import { Button, Label, ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import AcmeLogo from "@/app/ui/acme-logo";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  registerFarmer,
  fetchAreasByVillage,
  fetchVillages,
  Village,
  Area,
} from "@/services/authService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRegistrationFarmer,
  RegistrationFarmerData,
} from "@/schemas/registrationFarmer";

const GroupedMultiSelect = dynamic(
  () => import("@/app/ui/GroupedMultiSelect"),
  {
    ssr: false,
  }
);

export default function FarmerRegistrationPage() {
  const t = useTranslations("Global");
  const router = useRouter();

  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const [villages, setVillages] = useState<Village[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = createRegistrationFarmer(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFarmerData>({
    resolver: zodResolver(schema),
  });

  // Fetch all villages on mount
  useEffect(() => {
    fetchVillages().then(setVillages).catch(console.error);
  }, []);

  // Fetch areas whenever villages change
  useEffect(() => {
    const villageIds = selectedVillages.map((v) => v.value);
    if (villageIds.length === 0) return;

    Promise.all(villageIds.map(fetchAreasByVillage))
      .then((results) => {
        const merged = results.flat();
        const unique = Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );
        setAreas(unique);
      })
      .catch(console.error);
  }, [selectedVillages]);

  const onSubmit = async (data: RegistrationFarmerData) => {
    setApiError(null);

    if (!registrationData) {
      setApiError(t("missing_step1_data"));
      return;
    }

    try {
      setLoading(true);
      await registerFarmer({
        full_name: registrationData.full_name,
        phone_number: registrationData.contact_number,
        password: registrationData.password,
        role: "farmer",
        village_ids: data.village_ids,
        area_ids: data.area_ids,
      });

      router.push("/login");
    } catch (err: any) {
      setApiError(err.response?.data?.detail || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  const villageOptions = villages.map((v) => ({
    label: v.village_name,
    value: v.id,
  }));

  const areaOptions = selectedVillages.map((village) => {
    const groupedAreas = areas.filter(
      (area) => area.village === village.value // Ensure village match
    );
    return {
      label: village.label,
      options: groupedAreas.map((area) => ({
        label: area.area_name,
        value: area.id,
      })),
    };
  });

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
                <Controller
                  control={control}
                  name="village_ids"
                  render={({ field }) => (
                    <GroupedMultiSelect
                      instanceId="village-select"
                      options={villageOptions}
                      value={villageOptions.filter((opt) =>
                        field.value?.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const values = selected.map((s) => s.value);
                        field.onChange(values);
                        setSelectedVillages(selected);
                      }}
                      placeholder={t("select")}
                    />
                  )}
                />
                {errors.village_ids && (
                  <p className="text-red-500 text-sm">
                    {errors.village_ids.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="area">{t("area")}</Label>

                <Controller
                  control={control}
                  name="area_ids"
                  render={({ field }) => {
                    console.log("Area Options:", areaOptions); // Log area options for debugging
                    return (
                      <GroupedMultiSelect
                        instanceId="area-select"
                        options={areaOptions}
                        value={areaOptions
                          .flatMap((group) => group.options)
                          .filter((opt) => field.value?.includes(opt.value))}
                        onChange={(selected) =>
                          field.onChange(selected.map((s) => s.value))
                        }
                        placeholder={t("select")}
                      />
                    );
                  }}
                />
                {errors.area_ids && (
                  <p className="text-red-500 text-sm">
                    {errors.area_ids.message}
                  </p>
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
