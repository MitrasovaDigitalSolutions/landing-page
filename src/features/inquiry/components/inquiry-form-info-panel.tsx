import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface InquiryFormInfoPanelProps {
  title: string;
  description: string;
  whatsappUrl?: string | null;
  whatsappLabel: string;
}

export function InquiryFormInfoPanel({
  title,
  description,
  whatsappUrl,
  whatsappLabel,
}: InquiryFormInfoPanelProps): React.JSX.Element {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-slate-100 bg-slate-50/80 p-6 sm:p-7 lg:col-span-4 lg:border-r lg:border-b-0">
      <div className="space-y-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-0.5 text-[11px] font-bold tracking-wider text-primary uppercase">
            Konsultasi & Pemesanan
          </span>
          <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        <ul className="space-y-2.5 border-t border-slate-200/80 pt-4 text-xs font-medium text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Konsultasi spesifikasi, syarat, atau estimasi biaya</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Tindak lanjut cepat langsung oleh tim kami</span>
          </li>
        </ul>
      </div>

      {whatsappUrl ? (
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          className="h-11 w-full justify-center gap-2 rounded-xl border-primary/30 bg-white text-xs font-bold text-primary hover:bg-primary/5"
          render={
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          <MessageCircle className="size-4" />
          <span>{whatsappLabel}</span>
        </Button>
      ) : null}
    </div>
  );
}
