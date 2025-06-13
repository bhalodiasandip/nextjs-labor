"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  Checkbox,
} from "flowbite-react";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import DatePicker from "react-datepicker";
import { parse, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { useTranslations } from "next-intl";
import { FaLocationDot, FaCalendarDays, FaTruck } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { BiFilterAlt } from "react-icons/bi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSunrise } from "react-icons/gi";
import { PiBowlSteamBold } from "react-icons/pi";

import dynamic from "next/dynamic";
import axiosInstance from "@/services/axiosInstance";
import SeeMoreText from "@/app/ui/global/SeeMoreText";
import { fetchAreasByVillage } from "@/services/authService";

// Custom Select Component
const GroupedMultiSelect = dynamic(
  () => import("@/app/ui/GroupedMultiSelect"),
  {
    ssr: false,
  }
);

interface Requirement {
  id: number;
  title: string;
  area_name: string;
  number_of_labors: number;
  has_pickup: boolean;
  snacks_facility: boolean;
  from_date: string;
  to_date: string;
  shift: "morning" | "evening" | "anytime" | "fullday";
  description: string;
  farmer_rating: number;
}

export default function Page() {
  const t = useTranslations("Global");
  const [isOpen, setIsOpen] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<
    { label: string; options: { label: string; value: number }[] }[]
  >([]);
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const [shift, setShift] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [hasPickup, setHasPickup] = useState(false);
  const [snacksFacility, setSnacksFacility] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axiosInstance.get("/api/requirements/");
        setRequirements(response.data);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/skills?skill_type=labor"
        );
        const formatted = [
          {
            label: t("skill"),
            options: response.data.map((skill: any) => ({
              label: skill.skill_name,
              value: skill.id,
            })),
          },
        ];
        setSkillOptions(formatted);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, [t]);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const villageId = user.village_ids?.[0]; // corrected here

        if (!villageId) return;

        const areas = await fetchAreasByVillage(villageId);

        const formattedOptions = [
          {
            label: t("area"),
            options: areas.map((area: any) => ({
              label: area.area_name,
              value: area.id,
            })),
          },
        ];

        setAreaOptions(formattedOptions);
      } catch (error) {
        console.error("Error loading area options:", error);
      }
    };

    loadAreas();
  }, [t]);

  if (loading) {
    return <div className="p-4">{t("loading")}...</div>;
  }
  const applyFilters = async () => {
    setLoading(true);
    try {
      const params: any = {};

      if (selectedSkills.length > 0) {
        params.skill_ids = selectedSkills.map((s: any) => s.value).join(",");
      }

      if (selectedAreas.length > 0) {
        params.area_ids = selectedAreas.map((a: any) => a.value).join(",");
      }

      if (shift.length > 0) {
        params.shifts = shift.join(",");
      }

      if (date) {
        const isoDate = format(date, "yyyy-MM-dd");
        params.date = isoDate;
      }

      if (hasPickup) {
        params.has_pickup = true;
      }

      if (snacksFacility) {
        params.snacks_facility = true;
      }
      if (minRating !== null && minRating !== 0) {
        params.min_rating = minRating;
      }

      const response = await axiosInstance.get("/api/requirements/", {
        params,
      });

      setRequirements(response.data);
      setIsOpen(false); // close drawer
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setSelectedSkills([]);
    setSelectedAreas([]);
    setShift([]);
    setDate(null);
    setHasPickup(false);
    setSnacksFacility(false);
    setMinRating(0);
    setLoading(true);

    try {
      const response = await axiosInstance.get("/api/requirements/");
      setRequirements(response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error resetting filters:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full px-4">
      <Drawer
        className="bg-green-50"
        backdrop={false}
        open={isOpen}
        onClose={handleClose}
      >
        <DrawerHeader title={t("filter")} titleIcon={() => <></>} />
        <DrawerItems>
          <div className="flex flex-col gap-4 p-4">
            <div>
              <GroupedMultiSelect
                instanceId="labor-skills-select"
                options={skillOptions}
                value={selectedSkills}
                onChange={(selected) => setSelectedSkills(selected)}
                placeholder={t("lbl_select_work")}
                isMulti
                className="w-full"
              />
            </div>

            {/* Area Filter */}
            <div>
              <GroupedMultiSelect
                name="area"
                options={areaOptions}
                value={selectedAreas}
                onChange={(value) => setSelectedAreas(value)}
                placeholder={t("lbl_select_area")}
                isMulti
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <StarRatings
                rating={Number(minRating) || 0}
                changeRating={(newRating) => setMinRating(newRating)}
                starRatedColor="#057a55"
                starHoverColor="#0e9f6e"
                numberOfStars={5}
                name="min-rating"
                starDimension="20px"
                starSpacing="2px"
              />

              {minRating > 0 && (
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="text-gray-500 cursor-pointer left-2 top-0.5 relative"
                  aria-label="Clear rating filter"
                >
                  <MdClose size={20} />
                </button>
              )}
            </div>

            {/* Shift */}
            <div>
              <div className="flex flex-col gap-2 mt-2">
                {["morning", "evening", "anytime", "fullday"].map((option) => (
                  <div className="flex items-center gap-2" key={option}>
                    <Checkbox
                      id={`shift-${option}`}
                      color="success"
                      checked={shift.includes(option)}
                      onChange={(e) => {
                        setShift((prev) =>
                          e.target.checked
                            ? [...prev, option]
                            : prev.filter((s) => s !== option)
                        );
                      }}
                    />
                    <Label htmlFor={`shift-${option}`}>
                      {t(`lbl_${option}`)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" value={t("requirement_date")} />
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                isClearable
                dateFormat="dd/MM/yyyy" // <-- add this line
                placeholderText={t("requirement_date")}
                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Snacks Facility */}
            <div className="flex items-center gap-2">
              <Checkbox
                color="success"
                id="snacks"
                checked={snacksFacility}
                onChange={(e) => setSnacksFacility(e.target.checked)}
              />
              <Label htmlFor="snacks">{t("filter_snacks_facility")}</Label>
            </div>

            {/* Has Pickup */}
            <div className="flex items-center gap-2">
              <Checkbox
                color="success"
                id="pickup"
                checked={hasPickup}
                onChange={(e) => setHasPickup(e.target.checked)}
              />
              <Label htmlFor="pickup">{t("filter_has_pickup")}</Label>
            </div>

            <div className="flex gap-4 mt-4 items-stretch">
              <Button
                color="gray"
                onClick={resetFilters}
                className="flex-1 h-full m-0 py-2"
              >
                {t("reset_filter")}
              </Button>
              <Button
                color="success"
                onClick={applyFilters}
                className="flex-1 h-full m-0 py-2"
              >
                {t("apply_filter")}
              </Button>
            </div>
          </div>
        </DrawerItems>
      </Drawer>

      <div className="flex flex-col gap-2 md:gap-4">
        <div>
          <Button
            color="success"
            className="w-[100] focus:ring-0"
            onClick={() => setIsOpen(true)}
          >
            <BiFilterAlt className="mr-2 h-5 w-5" />
            {t("filter")}
          </Button>
        </div>

        {requirements.map((item) => (
          <Card className="w-full" key={item.id}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="md:basis-5/6">
                  <h4 className="text-base md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                </div>
                <div className="md:basis-1/6">
                  <StarRatings
                    rating={item.farmer_rating ?? 0}
                    starRatedColor="#057a55"
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="2px"
                  />
                </div>
              </div>

              <div className="flex space-x-1">
                <FaLocationDot />
                <span className="relative -top-1">{item.area_name}</span>
              </div>

              <div className="flex space-x-1">
                <GrUserWorker />
                <span className="relative -top-1">{item.number_of_labors}</span>

                {item.has_pickup && (
                  <FaTruck className="relative -top-0.5 left-2 w-5 h-5 text-green-500" />
                )}
                {item.snacks_facility && (
                  <PiBowlSteamBold className="relative -top-1 left-2 w-5 h-5 text-green-500" />
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <FaCalendarDays className="w-5 h-5" />
                  <span className="relative -top-0.5">
                    {format(new Date(item.from_date), "dd/MM/yyyy")}
                  </span>
                  <span className="relative -top-0.5">
                    {t("lbl_date_start")}
                  </span>
                  <span className="relative -top-0.5">
                    {format(new Date(item.to_date), "dd/MM/yyyy")}
                  </span>
                  <span className="relative -top-0.5">{t("lbl_date_end")}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <GiSunrise className="relative -top-1 h-5 w-5 text-yellow-400" />
                <span className="relative -top-1">
                  {t(`lbl_${item.shift}`)}
                </span>
              </div>
              <div className="flex space-x-1">
                <SeeMoreText maxLength={50} text={item.description} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Link
                href={`/labor/bid/${item.id}`}
                className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                {t("bid")}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
