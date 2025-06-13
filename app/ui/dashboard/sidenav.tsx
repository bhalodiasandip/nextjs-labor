import Link from "next/link";
import FarmerMenu from "./farmer-menu";
import AcmeLogo from "@/app/ui/acme-logo";
import { signOut } from "@/auth";
import LogoutLink from "@/app/ui/LogoutLink";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-50 p-4 md:h-22"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <FarmerMenu />
        <div className="hidden h-auto w-full grow rounded-md bg-green-50 md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <LogoutLink />
        </form>
      </div>
    </div>
  );
}
