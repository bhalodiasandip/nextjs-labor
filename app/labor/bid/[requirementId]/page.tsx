"use client";

import {
  Button,
  Label,
  TextInput,
  Textarea,
  ThemeProvider,
} from "flowbite-react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaRupeeSign } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import farmTheme from "@/app/ui/farmTheme";
import axiosInstance from "@/services/axiosInstance";
import FullPageLoader from "@/app/ui/FullPageLoader";
import { getLaborBidSchema, LaborBidFormValues } from "@/schemas/laborBid";
import { format } from "date-fns";

export default function LaborBidForm() {
  const t = useTranslations("Global");
  const router = useRouter();
  const { requirementId } = useParams<{ requirementId: string }>();

  const [requirement, setRequirement] = useState<any>(null);
  const [paymentOptions, setPaymentOptions] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const requiredLabors = requirement?.number_of_labors || 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LaborBidFormValues>({
    resolver: zodResolver(getLaborBidSchema(t, requiredLabors)),
  });

  const onSubmit = async (data: LaborBidFormValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/bids/`, {
        ...data,
        requirement: parseInt(requirementId || "0"),
        date: data.date ? format(data.date, "yyyy-MM-dd") : null,
      });
      router.push("/labor/bids");
    } catch (err) {
      console.error("Failed to submit bid", err);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors: any) => {
    const messages = Object.values(formErrors).map(
      (err: any) => err.message || "Invalid input"
    );
    alert(messages.join("\n"));
  };

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        if (!requirementId) return;
        const res = await axiosInstance.get(
          `/api/requirements/${requirementId}`
        );
        const req = res.data;
        setRequirement(req);

        const skillRes = await axiosInstance.get(`/api/skills/${req.skill}`);
        const skill = skillRes.data;

        setPaymentOptions({
          hourly: skill.hourly,
          lump_sump: skill.lump_sump,
          per_bigha: skill.per_bigha,
          per_day: skill.per_day,
          per_weight: skill.per_weight,
        });
      } catch (err) {
        console.error("Error loading requirement/skill", err);
      }
    };
    fetchRequirement();
  }, [requirementId]);

  const renderPaymentInput = (
    fieldName: keyof LaborBidFormValues,
    label: string
  ) => (
    <div className="flex flex-col w-32">
      <Label htmlFor={fieldName}>{label}</Label>
      <div className="relative">
        <TextInput
          id={fieldName}
          type="number"
          color="success"
          icon={FaRupeeSign}
          {...register(fieldName)}
        />
      </div>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm">{errors[fieldName]?.message}</p>
      )}
    </div>
  );

  return (
    <ThemeProvider theme={farmTheme}>
      {loading && <FullPageLoader />}
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full flex-col">
          <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-4">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate
            >
              <h2 className="text-lg font-semibold">
                {t("bid")} {requirement?.title && ` - ${requirement.title}`}
              </h2>

              {/* Payment Inputs */}
              <div className="flex flex-wrap gap-4">
                {paymentOptions.per_day &&
                  renderPaymentInput("per_day", t("lbl_per_day"))}
                {paymentOptions.lump_sump &&
                  renderPaymentInput("lump_sump", t("lbl_lump_sump"))}
                {paymentOptions.hourly &&
                  renderPaymentInput("hourly", t("lbl_hourly"))}
                {paymentOptions.per_bigha &&
                  renderPaymentInput("per_bigha", t("lbl_by_bigha"))}
                {paymentOptions.per_weight &&
                  renderPaymentInput("per_weight", t("lbl_by_weight"))}
              </div>

              {/* Required Labors Info */}
              <div>
                <Label className="text-base font-medium text-gray-700">
                  {t("number_of_required_labors")}:
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    {requiredLabors}
                  </span>
                </Label>
              </div>

              {/* Male / Female labors */}
              <div className="flex flex-wrap gap-4">
                <div className="w-64">
                  <Label htmlFor="male_labors">{t("lbl_male_labors")}</Label>
                  <TextInput
                    id="male_labors"
                    type="number"
                    {...register("male_labors")}
                    color="success"
                  />
                  {errors.male_labors && (
                    <p className="text-red-500 text-sm">
                      {errors.male_labors.message}
                    </p>
                  )}
                </div>

                <div className="w-64">
                  <Label htmlFor="female_labors">
                    {t("lbl_female_labors")}
                  </Label>
                  <TextInput
                    id="female_labors"
                    type="number"
                    {...register("female_labors")}
                    color="success"
                  />
                  {errors.female_labors && (
                    <p className="text-red-500 text-sm">
                      {errors.female_labors.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Availability Date */}
              <div>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={t("available_date")}
                      className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">{t("description_optional")}</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  color="success"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2">
                <Button type="submit" color="success">
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
