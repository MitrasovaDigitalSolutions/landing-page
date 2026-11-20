import type { SiteContactSettings } from "@/types/site-settings.types";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

interface FooterContactProps {
  contact?: SiteContactSettings;
}

export function FooterContact({
  contact,
}: FooterContactProps): React.JSX.Element {
  const items = [
    { icon: MapPin, value: contact?.address },
    { icon: Phone, value: contact?.phone },
    { icon: MessageCircle, value: contact?.whatsapp },
    { icon: Mail, value: contact?.email },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="space-y-3.5 text-sm text-slate-600">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="leading-relaxed font-medium">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}
