"use client";

import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-50 p-3">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
