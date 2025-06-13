"use client";
import { BsBookmarkPlus, BsBookmarkCheck, BsBookmark } from "react-icons/bs";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "new_work",
    href: "/farmer/requirement/create",
    icon: BsBookmarkPlus,
  },
  {
    name: "work_status",
    href: "/farmer/requirement/status",
    icon: BsBookmark,
  },
  {
    name: "archived_work",
    href: "/dashboard/customers",
    icon: BsBookmarkCheck,
  },
];

export default function LaborMenu() {
  const t = useTranslations("Global");
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-green-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-green-100 text-green-600": pathname === link.href,
                "bg-green-50 hover:bg-green-100": pathname !== link.href,
              }
            )}
          >
            <LinkIcon className="w-5 h-5" />
            <p className="hidden md:block">{t(link.name)}</p>
          </Link>
        );
      })}
    </>
  );
}
