"use client";
import { useTranslations } from "next-intl";
import LaborForm from "@/app/ui/requirement/create-for-labor-form";
import TractorForm from "@/app/ui/requirement/create-for-tractor-form";
import { PiTractor } from "react-icons/pi";
import { GrUserWorker } from "react-icons/gr";
import { Button, ButtonGroup, TabItem, Tabs } from "flowbite-react";
import Image from "next/image";

export default function Page() {
  const t = useTranslations("Global");
  return (
    <main>
      <Tabs aria-label="Pills" variant="pills">
        <TabItem active title={t("labor")} icon={GrUserWorker}>
          <LaborForm />
        </TabItem>
        <TabItem title={t("tractor")} icon={PiTractor}>
          <TractorForm />
        </TabItem>
      </Tabs>
    </main>
  );
}
