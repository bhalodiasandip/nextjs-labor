"use client";
import { lusitana } from "@/app/ui/fonts";
import {
  DevicePhoneMobileIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button, Label, TextInput, ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("Global");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  return (
    <ThemeProvider theme={farmTheme}>
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-8">
          <div className="w-full">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="contact_number">{t("phone_number")}</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="contact_number"
                  type="contact_number"
                  name="contact_number"
                  placeholder={t("enter_phonenumber")}
                  color="success"
                  icon={DevicePhoneMobileIcon}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 block">
                <Label htmlFor="password">{t("password")}</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t("enter_password")}
                  color="success"
                  icon={KeyIcon}
                  required
                />
              </div>
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button color="success">
            {t("login")}{" "}
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
      </form>
    </ThemeProvider>
  );
}
