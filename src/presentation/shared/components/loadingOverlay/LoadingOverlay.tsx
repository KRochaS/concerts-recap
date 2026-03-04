import { LoaderCircle } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = 'Loading...',
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white">
        <LoaderCircle className="h-8 w-8 animate-spin" />
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
}
