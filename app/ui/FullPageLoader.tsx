import { Spinner } from "flowbite-react";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <Spinner size="xl" color="success" />
    </div>
  );
}
