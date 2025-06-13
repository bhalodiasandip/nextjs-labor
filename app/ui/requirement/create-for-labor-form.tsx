"use client";

import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Textarea,
  ThemeProvider,
  Select,
  Radio,
} from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import farmTheme from "@/app/ui/farmTheme";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getLaborRequirementSchema,
  LaborRequirementData,
} from "@/schemas/requirementLabor";
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

export default function LaborForm() {
  const t = useTranslations("Global");
  const router = useRouter();

  const [fromDate, setFromDate] = useState<Date | null>(addDays(new Date(), 1));
  const [toDate, setToDate] = useState<Date | null>(addDays(new Date(), 2));
  const [loading, setLoading] = useState(false);
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
  } = useForm<LaborRequirementData>({
    resolver: zodResolver(getLaborRequirementSchema(t)),
    defaultValues: {
      area: 0,
      skill: 0,
      shift: "anytime",
      type: "labor",
      number_of_labors: 1,
    },
  });

  const onSubmit = async (data: LaborRequirementData) => {
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
        area: areaId,
        skill: skillId,
        title,
        from_date: fromDate?.toISOString().split("T")[0],
        to_date: toDate?.toISOString().split("T")[0],
        land_size: parseFloat(data.land_size),
      };

      const response = await axiosInstance.post("/api/requirements/", payload);
      router.push("/farmer/requirement/status");
    } catch (error) {
      console.error("Error submitting labor requirement:", error);
      alert("Failed to submit labor requirement. Please try again.");
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

        const skillsRes = await axiosInstance.get(
          "/api/skills/?skill_type=labor"
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
                        instanceId="labor-area-select"
                        options={areaOptions}
                        value={selectedOption}
                        onChange={(selected) =>
                          field.onChange(selected ? selected.value : undefined)
                        }
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

              <div>
                <Label htmlFor="number_of_labors">
                  {t("lbl_number_of_labors")}
                </Label>
                <TextInput
                  id="number_of_labors"
                  type="number"
                  {...register("number_of_labors", {
                    valueAsNumber: true, // <-- This makes sure it's treated as a number
                  })}
                  color="success"
                />
                {errors.number_of_labors && (
                  <p className="text-red-500">
                    {errors.number_of_labors.message}
                  </p>
                )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Controller
                    control={control}
                    name="from_date"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("from_date")}
                        className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    )}
                  />
                  {errors.from_date && (
                    <p className="text-red-500">{errors.from_date.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="to_date"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("to_date")}
                        className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    )}
                  />
                  {errors.to_date && (
                    <p className="text-red-500">{errors.to_date.message}</p>
                  )}
                </div>
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
              <div className="flex flex-col md:flex-row md:gap-6 gap-3">
                <div className="flex items-center">
                  <Checkbox
                    id="has_pickup"
                    {...register("has_pickup")}
                    color="success"
                  />
                  <Label htmlFor="has_pickup" className="ml-2">
                    {t("lbl_has_pickup")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="snacks_facility"
                    {...register("snacks_facility")}
                    color="success"
                  />
                  <Label htmlFor="snacks_facility" className="ml-2">
                    {t("lbl_snacks_facility")}
                  </Label>
                </div>
              </div>

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
