"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema, LoginSchema } from "@/schemas/loginSchema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput } from "flowbite-react";
import {
  DevicePhoneMobileIcon,
  KeyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import FullPageLoader from "@/app/ui/FullPageLoader";
import { ThemeProvider } from "flowbite-react"; // Import ThemeProvider
import farmTheme from "@/app/ui/farmTheme"; // Import your custom farm theme

export default function LoginForm() {
  const t = useTranslations("Global");
  const loginSchema = createLoginSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(""); // To show API errors (invalid credentials)
  const router = useRouter();

  // Form submit handler
  const onSubmit: SubmitHandler<LoginSchema> = async ({
    username,
    password,
  }) => {
    setLoading(true);
    setFormError(""); // Reset form-level error before submission

    try {
      const tokensAndUser = await login({ username, password });

      const { access, refresh, ...user } = tokensAndUser;

      // Store tokens and user data
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      const role = user.role;
      if (role === "farmer") {
        router.push("/farmer/requirement/create");
      } else if (role === "labor") {
        router.push("/labor/requirement/list");
      } else {
        setFormError("Unknown role. Please contact support.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle API errors (invalid credentials, unexpected errors)
      if (error.message === "invalid_credentials") {
        setFormError(t("invalid_credentials"));
      } else {
        setFormError(t("unexpected_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrap the form inside the ThemeProvider
    <ThemeProvider theme={farmTheme}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-8">
          {/* Phone Number Field */}
          <div className="w-full">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username">{t("phone_number")}</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="username"
                  type="text"
                  placeholder={t("enter_phonenumber")}
                  color="success"
                  icon={DevicePhoneMobileIcon}
                  {...register("username")}
                  required
                />
              </div>
              {/* Show validation error if exists */}
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-4">
              <div className="mb-2 block">
                <Label htmlFor="password">{t("password")}</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  type="password"
                  placeholder={t("enter_password")}
                  color="success"
                  icon={KeyIcon}
                  {...register("password")}
                  required
                />
              </div>
              {/* Show validation error if exists */}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Form-level error message */}
          {formError && (
            <p className="mt-2 text-sm text-red-600">{formError}</p>
          )}

          {/* Submit Button */}
          <Button type="submit" color="success" disabled={loading}>
            {t("login")}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>

        {/* Show loading screen while submitting */}
        {loading && <FullPageLoader />}
      </form>
    </ThemeProvider>
  );
}
