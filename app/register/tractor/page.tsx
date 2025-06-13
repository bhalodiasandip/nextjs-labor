"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import AcmeLogo from "@/app/ui/acme-logo";
import dynamic from "next/dynamic";

import {
  registerTractor,
  fetchVillages,
  fetchSkills,
  Village,
  Skill,
} from "@/services/authService";
import {
  createRegistrationTractor,
  RegistrationTractorData,
} from "@/schemas/registrationTractor";

const GroupedMultiSelect = dynamic(
  () => import("@/app/ui/GroupedMultiSelect"),
  { ssr: false }
);

export default function TractorRegistrationPage() {
  const t = useTranslations("Global");
  const router = useRouter();

  const registrationData = useSelector(
    (state: RootState) => state.registration
  );

  const [villages, setVillages] = useState<Village[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = createRegistrationTractor(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationTractorData>({
    resolver: zodResolver(schema),
  });

  // Fetch villages and skills on mount
  useEffect(() => {
    fetchVillages().then(setVillages).catch(console.error);
    fetchSkills("tractor").then(setSkills).catch(console.error); // fetch skills with skill_type='tractor'
  }, []);

  const onSubmit = async (data: RegistrationTractorData) => {
    setApiError(null);

    if (!registrationData) {
      setApiError(t("missing_step1_data"));
      return;
    }

    try {
      setLoading(true);
      await registerTractor({
        full_name: registrationData.full_name,
        phone_number: registrationData.contact_number,
        password: registrationData.password,
        role: "tractor",
        village_ids: data.village_ids,
        skill_ids: data.skill_ids,
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

  const skillOptions = skills.map((s) => ({
    label: s.skill_name,
    value: s.id,
  }));

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
              {/* Village Multi-Select */}
              <div>
                <Label htmlFor="village">{t("village")}</Label>
                <Controller
                  control={control}
                  name="village_ids"
                  render={({ field }) => (
                    <GroupedMultiSelect
                      options={villageOptions}
                      value={villageOptions.filter((opt) =>
                        field.value?.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((s) => s.value))
                      }
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

              {/* Skill Multi-Select */}
              <div>
                <Label htmlFor="skill">{t("skill")}</Label>
                <Controller
                  control={control}
                  name="skill_ids"
                  render={({ field }) => (
                    <GroupedMultiSelect
                      options={skillOptions}
                      value={skillOptions.filter((opt) =>
                        field.value?.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((s) => s.value))
                      }
                      placeholder={t("select")}
                    />
                  )}
                />
                {errors.skill_ids && (
                  <p className="text-red-500 text-sm">
                    {errors.skill_ids.message}
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
