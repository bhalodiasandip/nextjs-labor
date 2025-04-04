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
  ToggleSwitch,
} from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
import { useTranslations } from "next-intl";

export default function Form() {
  const t = useTranslations("Global");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // const formattedDate = tomorrow.toLocaleDateString("en-US");
  return (
    <ThemeProvider theme={farmTheme}>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full flex-col">
          <div className="flex-1 rounded-lg bg-green-50 px-6 pb-4 pt-4">
            <form className="flex flex-col gap-3">
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="area">{t("requirement_location")}</Label>
                </div>
                <Select color="success" id="area" required>
                  <option>જગબીડ</option>
                  <option>પાનેલી ની સીમ</option>
                  <option>છેલ</option>
                </Select>
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="land_size">{t("land_size_help")}</Label>
                </div>
                <TextInput
                  type="number"
                  id="land_size"
                  name="land_size"
                  color="success"
                  required
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="title">{t("requirement_title")}</Label>
                </div>
                <Select id="title" name="title" color="success" required>
                  <option>નીંદવું</option>
                  <option>કપાસ ઉપાડવો</option>
                  <option>તલ વાઢવા</option>
                  <option>પાળા કરવા</option>
                </Select>
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="contact_number">
                    {t("requirement_desc")}
                  </Label>
                </div>
                <Textarea id="description" rows={4} color="success" />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="number_of_labors">
                    {t("lbl_number_of_labors")}
                  </Label>
                </div>
                <TextInput
                  id="number_of_labors"
                  name="number_of_labors"
                  type="number"
                  color="success"
                />
              </div>
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="date">{t("requirement_date")}</Label>
                </div>
                <Datepicker
                  className="max-w-[300px]"
                  value={tomorrow}
                  color="success"
                />
              </div>
              <div>
                <div className="flex py-2 flex-col md:flex-row">
                  <div className="w-full md:basis-36">
                    <Radio
                      id="morning"
                      name="timing"
                      value="morning_shift"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="morning">{t("lbl_morning_shift")}</Label>
                  </div>
                  <div className="w-full md:basis-36">
                    <Radio
                      id="evening"
                      name="timing"
                      value="evening_shift"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="evening">{t("lbl_evning_shift")}</Label>
                  </div>
                  <div className="w-full md:basis-24">
                    <Radio
                      id="anytime"
                      name="timing"
                      value="anytime"
                      className="mr-2"
                      color="success"
                      defaultChecked
                    />
                    <Label htmlFor="anytime">{t("lbl_anytime")}</Label>
                  </div>
                  <div className="w-full md:basis-36">
                    <Radio
                      id="fullday"
                      name="timing"
                      value="fullday"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="fullday">{t("lbl_fullday")}</Label>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex flex-row">
                  <div className="basis-24">
                    <Radio
                      id="hourly"
                      name="payment_type"
                      value="hourly"
                      className="mr-2"
                      color="success"
                      defaultChecked
                    />
                    <Label htmlFor="hourly">{t("lbl_hourly")}</Label>
                  </div>
                  <div className="basis-24">
                    <Radio
                      id="lump_sump"
                      name="payment_type"
                      value="lump_sump"
                      className="mr-2"
                      color="success"
                    />
                    <Label htmlFor="lump_sump">{t("lbl_lump_sump")}</Label>
                  </div>
                </div>
              </div>
              <div className="flex max-w-md flex-col gap-4" id="checkbox">
                <div className="flex items-center gap-2">
                  <Checkbox color="success" id="has_pickup" name="has_pickup" />
                  <Label htmlFor="has_pickup">{t("lbl_has_pickup")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    color="success"
                    id="snacks_facility"
                    name="snacks_facility"
                  />
                  <Label htmlFor="snacks_facility">
                    {t("lbl_snacks_facility")}
                  </Label>
                </div>
              </div>
              <div>
                <div className="flex flex-row-reverse gap-2">
                  <div className="flex items-end">
                    <Button type="submit" color="success">
                      {t("submit")}{" "}
                    </Button>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" color="red" outline>
                      {t("cancel")}{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
