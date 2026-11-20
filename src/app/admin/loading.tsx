import { Loader2 } from "lucide-react";

export default function AdminLoading(): React.JSX.Element {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="size-7 animate-spin text-primary" />
      <p className="text-xs font-semibold tracking-wide text-slate-500">
        Memuat data operasional...
      </p>
    </div>
  );
}
