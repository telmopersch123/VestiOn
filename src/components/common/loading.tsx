// components/common/Loading.tsx
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Loading;
