import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { PortfolioCard } from "@/features/portfolio/components/portfolio-card";
import type { Portfolio } from "@/types/api.types";

interface PortfolioSectionProps {
  portfolios: Portfolio[];
}

export function PortfolioSection({
  portfolios,
}: PortfolioSectionProps): React.JSX.Element | null {
  if (portfolios.length === 0) {
    return null;
  }

  return (
    <section
      id="portfolios"
      className="border-b border-slate-200/80 bg-white py-10 md:py-14"
    >
      <Container>
        <SectionHeading
          badge="Rekam Jejak & Portofolio"
          title="Realisasi Proyek & Kerjasama Klien"
          subtitle="Dokumentasi implementasi layanan, pembiayaan, dan solusi operasional yang telah kami selesaikan."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      </Container>
    </section>
  );
}
