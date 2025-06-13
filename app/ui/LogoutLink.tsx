"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/services/authService";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function LogoutLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    await logout(); // ← call the function from authService

    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-green-50 p-3 text-sm font-medium hover:bg-green-200 text-green-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </button>
  );
}
