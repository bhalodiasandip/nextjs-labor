import { Card } from "flowbite-react";
import { useTranslations } from "next-intl";

export default function Thankyou() {
  const t = useTranslations("Global");
  return (
    <div className="w-full px-4">
      {" "}
      {/* Container with padding */}
      <Card className="w-full">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("thank_you")}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {t("thank_you_for_post_requirement")}
        </p>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <a
            href="/farmer/requirement/create"
            className="inline-flex items-center rounded-lg bg-green-500  px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            {t("add_more_requirement")}
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-green-500  px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            {t("check_status_of_requirement")}
          </a>
        </div>
      </Card>
    </div>
  );
}
