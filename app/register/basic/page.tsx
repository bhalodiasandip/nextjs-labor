"use client";

import { Button, Radio, Label, TextInput, ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRegistrationBasic,
  RegistrationBasicData,
} from "@/schemas/registrationBasic";
import { useDispatch } from "react-redux";
import { setRegistrationData } from "@/store/slices/registrationSlice";
import AcmeLogo from "@/app/ui/acme-logo";
import FullPageLoader from "@/app/ui/FullPageLoader";

export default function BasicInfoPage() {
  const t = useTranslations("Global");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationBasicData>({
    resolver: zodResolver(createRegistrationBasic(t)),
    defaultValues: {
      role: "farmer",
    },
  });

  const onSubmit = async (data: RegistrationBasicData) => {
    setApiError(null);
    dispatch(setRegistrationData(data));
    setLoading(true);

    if (data.role === "farmer") {
      router.push("/register/farmer");
    } else if (data.role === "labor") {
      router.push("/register/labor");
    } else if (data.role === "tractor") {
      router.push("/register/tractor");
    }
  };

  return (
    <ThemeProvider theme={farmTheme}>
      {loading && <FullPageLoader />}
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-1.5 p-4">
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
                <Label htmlFor="full_name">{t("full_name")}</Label>
                <TextInput
                  id="full_name"
                  placeholder={t("enter_fullname")}
                  {...register("full_name")}
                  color="success"
                />
                {errors.full_name && (
                  <p className="text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_number">{t("phone_number")}</Label>
                <TextInput
                  id="contact_number"
                  type="tel"
                  placeholder={t("enter_phonenumber")}
                  {...register("contact_number")}
                  color="success"
                />
                {errors.contact_number && (
                  <p className="text-red-500">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">{t("password")}</Label>
                <TextInput
                  id="password"
                  type="password"
                  placeholder={t("enter_password")}
                  {...register("password")}
                  color="success"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm_password">
                  {t("confirm_password")}
                </Label>
                <TextInput
                  id="confirm_password"
                  type="password"
                  placeholder={t("confirm_password")}
                  {...register("confirm_password")}
                  color="success"
                />
                {errors.confirm_password && (
                  <p className="text-red-500">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1 block">{t("your_role")}</Label>
                <div className="flex flex-col gap-2">
                  <div>
                    <Radio
                      id="farmer"
                      value="farmer"
                      {...register("role")}
                      color="success"
                    />
                    <Label htmlFor="farmer" className="ml-1">
                      {t("farmer")}
                    </Label>
                  </div>
                  <div>
                    <Radio
                      id="labor"
                      value="labor"
                      {...register("role")}
                      color="success"
                    />
                    <Label htmlFor="labor" className="ml-1">
                      {t("labor")}
                    </Label>
                  </div>
                  <div>
                    <Radio
                      id="tractor"
                      value="tractor"
                      {...register("role")}
                      color="success"
                    />
                    <Label htmlFor="tractor" className="ml-1">
                      {t("tractor")}
                    </Label>
                  </div>
                </div>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
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
