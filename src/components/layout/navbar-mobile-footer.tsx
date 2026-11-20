"use client";

import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteContactSettings } from "@/types/site-settings.types";

interface NavbarMobileFooterProps {
  contact?: SiteContactSettings;
  contactHref?: string;
  onNavigate: () => void;
}

export function NavbarMobileFooter({
  contact,
  contactHref = "/kontak",
  onNavigate,
}: NavbarMobileFooterProps): React.JSX.Element {
  const waDigits = contact?.whatsapp?.replaceAll(/\D/g, "");

  return (
    <div className="space-y-3 border-t border-slate-100 bg-slate-50/70 p-5">
      {contact?.phone || contact?.email ? (
        <div className="space-y-1.5 pb-1 text-xs text-slate-500">
          {contact.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" />
              <span>{contact.phone}</span>
            </div>
          ) : null}
          {contact.email ? (
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary" />
              <span className="truncate">{contact.email}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {waDigits ? (
          <Button
            variant="outline"
            nativeButton={false}
            onClick={onNavigate}
            className="h-10 w-full rounded-xl border-slate-200 bg-white font-semibold text-slate-700"
            render={
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircle className="size-4 text-primary" />
            <span>Chat WhatsApp</span>
          </Button>
        ) : null}

        <Button
          className="h-10 w-full rounded-xl font-bold"
          nativeButton={false}
          onClick={onNavigate}
          render={<Link href={contactHref} />}
        >
          <span>Hubungi Kami</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
