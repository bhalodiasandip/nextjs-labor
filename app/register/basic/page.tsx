"use client";
import AcmeLogo from "@/app/ui/acme-logo";
import { Button, Radio, Label, TextInput, ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BasicInfoPage() {
  const t = useTranslations("Global");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
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
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="full_name">{t("full_name")}</Label>
                </div>
                <TextInput
                  id="full_name"
                  name="full_name"
                  placeholder={t("enter_fullname")}
                  color="success"
                  required
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="contact_number">{t("phone_number")}</Label>
                </div>
                <TextInput
                  id="contact_number"
                  name="contact_number"
                  type="number"
                  placeholder={t("enter_phonenumber")}
                  color="success"
                  required
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="password">{t("password")}</Label>
                </div>
                <TextInput
                  id="password"
                  name="password"
                  placeholder={t("enter_password")}
                  type="password"
                  color="success"
                  required
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="confirm_password">
                    {t("confirm_password")}
                  </Label>
                </div>
                <TextInput
                  id="confirm_password"
                  name="confirm_password"
                  placeholder={t("confirm_password")}
                  type="password"
                  color="success"
                  required
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="role">{t("your_role")}</Label>
                </div>
                <div className="flex flex-row">
                  <div className="basis-20">
                    <Radio
                      id="farmer"
                      name="role"
                      value="farmer"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="farmer">{t("farmer")}</Label>
                  </div>
                  <div className="basis-20">
                    <Radio
                      id="labor"
                      name="role"
                      value="labor"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="labor">{t("labor")}</Label>
                  </div>
                </div>
              </div>
              <Button type="submit" color="success">
                {t("submit")}{" "}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
