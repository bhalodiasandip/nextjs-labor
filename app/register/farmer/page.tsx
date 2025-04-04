"use client";
import AcmeLogo from "@/app/ui/acme-logo";
import {
  Button,
  Radio,
  Label,
  TextInput,
  Select,
  ThemeProvider,
} from "flowbite-react";
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
                  <Label htmlFor="village">{t("village")}</Label>
                </div>
                <Select color="success" id="village" required>
                  <option>ભાયાવદર</option>
                  <option>અરણી</option>
                  <option>મોટી પાનેલી</option>
                </Select>
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="area">{t("area")}</Label>
                </div>
                <Select color="success" id="area" required>
                  <option>કાળીયાવાસ</option>
                  <option>જગબીડ</option>
                  <option>હોળીધાર</option>
                  <option>છેલ</option>
                </Select>
              </div>
              <div>
                <div className="flex flex-row">
                  <div className="basis-20">
                    <Radio
                      id="male"
                      name="gender"
                      value="male"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="male">{t("male")}</Label>
                  </div>
                  <div className="basis-20">
                    <Radio
                      id="female"
                      name="gender"
                      value="female"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="female">{t("female")}</Label>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="rate">{t("rate")}</Label>
                </div>
                <TextInput
                  id="rate"
                  name="rate"
                  type="number"
                  placeholder={t("rate")}
                  color="success"
                  required
                />
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
