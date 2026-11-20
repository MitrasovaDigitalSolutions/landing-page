"use client";

import {
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HeadOfficeMap } from "@/features/home/components/head-office-map";
import type { PageSection } from "@/types/api.types";
import type {
  SiteContactSettings,
  SiteLegalSettings,
} from "@/types/site-settings.types";

interface HeadOfficeSectionProps {
  section: PageSection;
  contact?: SiteContactSettings;
  legal?: SiteLegalSettings;
}

function buildMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function formatWhatsappHref(wa: string): string {
  const digits = wa.replaceAll(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function HeadOfficeSection({
  section,
  contact,
  legal,
}: HeadOfficeSectionProps): React.JSX.Element {
  const badge = section.payload?.badge ?? "Lokasi";
  const title = section.title ?? "Alamat Kantor Pusat";
  const address = section.body ?? contact?.address ?? "";
  const mapsEmbed =
    section.payload?.maps_embed ??
    contact?.maps_embed ??
    contact?.maps_embed_url;

  return (
    <section
      id="office"
      className="border-b border-slate-200/80 bg-white py-16 md:py-24"
    >
      <Container className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between lg:col-span-5"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h2>

            {address ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed font-medium text-slate-700">
                  {address}
                </p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {contact?.phone ? (
                <a
                  href={`tel:${contact.phone.replaceAll(/\s+/g, "")}`}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span>{contact.phone}</span>
                </a>
              ) : null}

              {contact?.whatsapp ? (
                <a
                  href={formatWhatsappHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-primary"
                >
                  <MessageCircle className="size-4 shrink-0 text-primary" />
                  <span>WhatsApp: +{contact.whatsapp.replaceAll(/\D/g, "")}</span>
                </a>
              ) : null}

              {contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span>{contact.email}</span>
                </a>
              ) : null}

              {legal?.badan_hukum ? (
                <div className="flex items-center gap-3 pt-1 text-xs font-medium text-slate-500">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  <span>Badan Hukum: {legal.badan_hukum}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {address ? (
              <Button
                size="lg"
                nativeButton={false}
                className="h-11 gap-2 rounded-xl px-5 text-xs font-bold shadow-xs"
                render={
                  <a
                    href={buildMapsSearchUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="size-3.5" />
              </Button>
            ) : null}

            {contact?.whatsapp ? (
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                className="h-11 rounded-xl border-slate-300 px-5 text-xs font-bold text-slate-700 hover:border-primary/40 hover:text-primary"
                render={
                  <a
                    href={formatWhatsappHref(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Hubungi WhatsApp
              </Button>
            ) : null}
          </div>
        </motion.div>

        <HeadOfficeMap title={title} address={address} mapsEmbed={mapsEmbed} />
      </Container>
    </section>
  );
}
