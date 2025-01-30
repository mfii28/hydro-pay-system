import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-water-600">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Button
        onClick={() => navigate("/")}
        className="mt-8 bg-water-600 hover:bg-water-700"
      >
        Return to Dashboard
      </Button>
    </div>
  );
}