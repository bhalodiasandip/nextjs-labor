import SideNav from "@/app/ui/dashboard/sidenav";
import { ThemeProvider } from "flowbite-react";
import farmTheme from "@/app/ui/farmTheme";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={farmTheme}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow px-2 py-0 md:overflow-y-auto md:px-12 md:py-6">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
