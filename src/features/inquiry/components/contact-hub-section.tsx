import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ContactOfficePanel } from "@/features/inquiry/components/contact-office-panel";
import { InquiryForm } from "@/features/inquiry/components/inquiry-form";
import type { Branch, PageSection } from "@/types/api.types";
import type {
  SiteContactSettings,
  SiteLegalSettings,
} from "@/types/site-settings.types";

interface ContactHubSectionProps {
  contact?: SiteContactSettings;
  legal?: SiteLegalSettings;
  officeSection?: PageSection;
  showHeading?: boolean;
  defaultSubject?: string;
  branches?: Branch[];
  siteName?: string;
  siteUrl?: string;
}

export function ContactHubSection({
  contact,
  legal,
  officeSection,
  showHeading = true,
  defaultSubject,
  branches = [],
  siteName,
  siteUrl,
}: ContactHubSectionProps): React.JSX.Element {
  return (
    <section
      id="contact"
      className="border-t border-slate-200/80 bg-white py-10 md:py-14"
    >
      <Container>
        {showHeading ? (
          <SectionHeading
            badge="Lokasi & Konsultasi"
            title="Kantor Pusat & Layanan Konsultasi"
            subtitle="Kunjungi kantor pusat kami atau sampaikan pertanyaan serta kebutuhan layanan Anda langsung melalui formulir."
          />
        ) : null}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactOfficePanel
              officeSection={officeSection}
              contact={contact}
              legal={legal}
            />
          </div>

          <div className="lg:col-span-7">
            <InquiryForm
              defaultSubject={defaultSubject}
              compact
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
