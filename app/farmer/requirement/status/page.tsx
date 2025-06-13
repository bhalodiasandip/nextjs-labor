"use client";

import { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import axiosInstance from "@/services/axiosInstance";

interface Requirement {
  id: number;
  title: string;
  area_name: string;
  number_of_labors: number;
  date: string;
  can_update: boolean; // 👈 new field from backend
}

export default function RequirementStatus() {
  const t = useTranslations("Global");
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axiosInstance.get("/api/my-requirements/");
        setRequirements(response.data);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  if (loading) {
    return <div className="p-4">{t("loading")}...</div>;
  }

  return (
    <div className="w-full px-4">
      <div className="flex flex-col gap-2 md:gap-4">
        {requirements.map((item) => (
          <Card className="w-full" key={item.id}>
            <div className="flex flex-col gap-3">
              <h4 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item.title}
              </h4>

              <div className="flex space-x-1">
                <FaLocationDot />
                <span className="relative -top-1">{item.area_name}</span>
              </div>

              <div className="flex space-x-1">
                <GrUserWorker />
                <span className="relative -top-1">{item.number_of_labors}</span>
              </div>

              <div className="flex space-x-1">
                <FaCalendarDays />
                <span className="relative -top-1">{item.date}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <a
                href="/farmer/requirement/create"
                className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                {t("check_bid")}
              </a>

              {item.can_update && (
                <a
                  href={`/farmer/requirement/edit/${item.id}`}
                  className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  {t("edit_requirement")}
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
