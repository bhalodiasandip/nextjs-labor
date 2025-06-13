"use client";

import {
  Button,
  Checkbox,
  Radio,
  Label,
  TextInput,
  Textarea,
  ThemeProvider,
  Select,
  Datepicker,
} from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getTractorRequirementSchema,
  TractorRequirementData,
} from "@/schemas/requirementTractor"; // Define this schema
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import axiosInstance from "@/services/axiosInstance";
import FullPageLoader from "@/app/ui/FullPageLoader";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const GroupedSingleSelect = dynamic(
  () => import("@/app/ui/GroupedSingleSelect"),
  { ssr: false }
);

export default function TractorForm() {
  const t = useTranslations("Global");
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(addDays(new Date(), 1));
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<{ id: number; area_name: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<
    { label: string; options: { value: number; label: string }[] }[]
  >([]);

  const [skills, setSkills] = useState<{ id: number; skill_name: string }[]>(
    []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<TractorRequirementData>({
    resolver: zodResolver(getTractorRequirementSchema(t)),
    defaultValues: {
      area: 0,
      skill: 0,
      payment_type: "per_bigha",
      shift: "anytime",
      date: addDays(new Date(), 1),
      type: "tractor",
    },
  });

  const onSubmit = async (data: TractorRequirementData) => {
    setLoading(true);
    try {
      const skillId = Number(data.skill);
      const areaId = Number(data.area);

      const skillName =
        skills.find((s) => s.id === skillId)?.skill_name || "Unknown Skill";
      const areaName =
        areaOptions
          .flatMap((group) => group.options)
          .find((opt) => opt.value === areaId)?.label || "Unknown Area";

      const title = `${skillName} - ${data.land_size} ${t(
        "lbl_bigha"
      )} - ${areaName}`;

      const payload = {
        ...data,
        title,
        date: data.date.toISOString().split("T")[0],
        area: areaId,
        skill: skillId,
        land_size: parseFloat(data.land_size),
      };

      const response = await axiosInstance.post("/api/requirements/", payload);
      router.push("/farmer/requirement/status");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert("Failed to submit tractor requirement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const groupedAreas =
          user?.areas_with_villages?.map((villageGroup: any) => ({
            label: villageGroup.label,
            options: villageGroup.options.map((area: any) => ({
              value: area.value,
              label: area.label,
            })),
          })) || [];

        setAreaOptions(groupedAreas);

        // ✅ Flatten area options for lookup
        const flatAreas = groupedAreas.flatMap((g) =>
          g.options.map((opt) => ({
            id: opt.value,
            area_name: opt.label,
          }))
        );
        setAreas(flatAreas); // 👈 This was missing

        const skillsRes = await axiosInstance.get(
          "/api/skills/?skill_type=tractor"
        );
        setSkills(skillsRes.data);
      } catch (err) {
        console.error("Failed to fetch area/skill data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={farmTheme}>
      {loading && <FullPageLoader />}
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full flex-col">
          <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-4">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <Label htmlFor="area">{t("requirement_location")}</Label>
                <Controller
                  control={control}
                  name="area"
                  render={({ field }) => {
                    const selectedOption =
                      areaOptions
                        .flatMap((group) => group.options)
                        .find((opt) => opt.value === field.value) || null;

                    return (
                      <GroupedSingleSelect
                        instanceId="tractor-area-select"
                        options={areaOptions}
                        value={selectedOption}
                        onChange={(selected) => {
                          field.onChange(selected ? selected.value : undefined);
                        }}
                        placeholder={t("select")}
                      />
                    );
                  }}
                />
                {errors.area && (
                  <p className="text-red-500">{errors.area.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="land_size">{t("land_size_help")}</Label>
                <TextInput
                  type="number"
                  id="land_size"
                  {...register("land_size")}
                  color="success"
                />
                {errors.land_size && (
                  <p className="text-red-500">{errors.land_size.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="skill">{t("requirement_title")}</Label>
                <Select
                  id="skill"
                  {...register("skill", {
                    setValueAs: (v) => parseInt(v, 10),
                  })}
                  color="success"
                >
                  <option value="">{t("select")}</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skill_name}
                    </option>
                  ))}
                </Select>
                {errors.skill && (
                  <p className="text-red-500">{errors.skill.message}</p>
                )}
              </div>

              <div className="mb-2 flex gap-4">
                <div>
                  <Radio
                    id="hourly"
                    value="hourly"
                    {...register("payment_type")}
                    color="success"
                  />
                  <Label htmlFor="hourly" className="ml-1">
                    {t("lbl_hourly")}
                  </Label>
                </div>
                <div>
                  <Radio
                    id="per_bigha"
                    value="per_bigha"
                    {...register("payment_type")}
                    color="success"
                    defaultChecked
                  />
                  <Label htmlFor="per_bigha" className="ml-1">
                    {t("lbl_by_bigha")}
                  </Label>
                </div>
                <div>
                  <Radio
                    id="lump_sump"
                    value="lump_sump"
                    {...register("payment_type")}
                    color="success"
                  />
                  <Label htmlFor="lump_sump" className="ml-1">
                    {t("lbl_lump_sump")}
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t("requirement_desc")}</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  color="success"
                />
              </div>

              <div>
                <Label htmlFor="date">{t("requirement_date")}</Label>
                <Datepicker
                  value={date}
                  onChange={(selectedDate: Date | null) => {
                    const validDate = selectedDate ?? new Date();
                    setDate(validDate);
                    setValue("date", validDate);
                  }}
                  color="success"
                />
                {errors.date && (
                  <p className="text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3">
                <div className="flex items-center">
                  <Radio
                    id="morning"
                    value="morning"
                    {...register("shift")}
                    color="success"
                  />
                  <Label htmlFor="morning" className="ml-2">
                    {t("lbl_morning")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Radio
                    id="evening"
                    value="evening"
                    {...register("shift")}
                    color="success"
                  />
                  <Label htmlFor="evening" className="ml-2">
                    {t("lbl_evening")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Radio
                    id="anytime"
                    value="anytime"
                    {...register("shift")}
                    color="success"
                  />
                  <Label htmlFor="anytime" className="ml-2">
                    {t("lbl_anytime")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Radio
                    id="fullday"
                    value="fullday"
                    {...register("shift")}
                    color="success"
                  />
                  <Label htmlFor="fullday" className="ml-2">
                    {t("lbl_fullday")}
                  </Label>
                </div>
              </div>

              {errors.shift && (
                <p className="text-red-500">{errors.shift.message}</p>
              )}

              <div className="flex justify-end flex-wrap gap-2">
                <Button type="button" color="red" outline className="w-32">
                  {t("cancel")}
                </Button>
                <Button type="submit" color="success" className="w-32">
                  {t("submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
