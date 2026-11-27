import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { InquiryContactCard } from "@/features/inquiry/components/inquiry-contact-card";
import { InquiryForm } from "@/features/inquiry/components/inquiry-form";
import type { Branch } from "@/types/api.types";
import type { SiteContactSettings } from "@/types/site-settings.types";

interface InquirySectionProps {
  contact?: SiteContactSettings;
  defaultSubject?: string;
  branches?: Branch[];
  siteName?: string;
  siteUrl?: string;
}

export function InquirySection({
  contact,
  defaultSubject,
  branches = [],
  siteName,
  siteUrl,
}: InquirySectionProps): React.JSX.Element {
  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <Container>
        <SectionHeading
          badge="Konsultasi & Pengajuan"
          title="Diskusikan Kebutuhan Anda Bersama Tim Kami"
          subtitle="Sampaikan pertanyaan, konsultasi produk, atau permohonan penawaran melalui formulir resmi di bawah ini."
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <InquiryContactCard contact={contact} />
          </div>

          <div className="lg:col-span-7">
            <InquiryForm
              defaultSubject={defaultSubject}
              branches={branches}
              fallbackWhatsapp={contact?.whatsapp}
              siteName={siteName}
              siteUrl={siteUrl}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
