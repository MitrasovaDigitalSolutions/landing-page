import { ShieldCheck } from "lucide-react";

export function LoginHeader(): React.JSX.Element {
  return (
    <div className="border-b border-slate-100 pb-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-sm shadow-primary/20">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
            Mitrasova CMS
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Portal Administrasi Unit
          </h1>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Silakan masuk menggunakan kredensial administrator resmi untuk mengelola
        konten, layanan, dan pesan masuk.
      </p>
    </div>
  );
}
