import type { SiteContactSettings } from "@/types/site-settings.types";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

interface InquiryContactCardProps {
  contact?: SiteContactSettings;
}

export function InquiryContactCard({
  contact,
}: InquiryContactCardProps): React.JSX.Element {
  const items = [
    { label: "Telepon Resmi", value: contact?.phone, icon: Phone },
    {
      label: "WhatsApp Layanan Cepat",
      value: contact?.whatsapp,
      icon: MessageCircle,
    },
    { label: "Korespondensi Email", value: contact?.email, icon: Mail },
    {
      label: "Alamat Kantor Operasional",
      value: contact?.address,
      icon: MapPin,
    },
    {
      label: "Jam Operasional Layanan",
      value: "Senin – Jumat: 08:00 – 17:00 WIB",
      icon: Clock,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-7 text-white shadow-xl sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl" />

      <span className="text-xs font-bold tracking-wider text-white/80 uppercase">
        Kantor & Saluran Resmi
      </span>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-white">
        Informasi Layanan Konsultasi
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-white/80">
        Hubungi tim kami secara langsung melalui saluran resmi di bawah ini atau
        kirimkan formulir pengajuan di samping.
      </p>

      <div className="mt-7 space-y-5 border-t border-white/15 pt-6 text-sm">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                <Icon className="size-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-wider text-white/75 uppercase">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-white">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
