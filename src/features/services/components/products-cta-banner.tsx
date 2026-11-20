import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/types/api.types";

interface ProductsCtaBannerProps {
  section?: PageSection;
  fallbackWhatsapp?: string;
}

export function ProductsCtaBanner({
  section,
  fallbackWhatsapp,
}: ProductsCtaBannerProps): React.JSX.Element {
  const title = section?.title ?? "Butuh Informasi Lebih Lanjut?";
  const body =
    section?.body ??
    "Tim kami siap membantu Anda memilih produk yang paling sesuai dengan kebutuhan.";
  const buttonLabel =
    section?.payload?.button_label ??
    section?.payload?.cta_label ??
    "Konsultasi Layanan";

  const waDigits = fallbackWhatsapp?.replaceAll(/\D/g, "");
  const fallbackTarget = waDigits ? `https://wa.me/${waDigits}` : "/kontak";
  const targetUrl = section?.payload?.button_url ?? fallbackTarget;
  const isExternal = targetUrl.startsWith("http");

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary px-6 py-7 text-white shadow-md sm:px-10 sm:py-9 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-white/85 sm:text-base">
              {body}
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            nativeButton={false}
            className="h-12 shrink-0 gap-2 self-start rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-sm hover:bg-slate-100 lg:self-auto"
            render={
              isExternal ? (
                <a href={targetUrl} target="_blank" rel="noopener noreferrer" />
              ) : (
                <Link href={targetUrl} />
              )
            }
          >
            {isExternal ? <MessageCircle className="size-4" /> : null}
            <span>{buttonLabel}</span>
            {!isExternal ? <ArrowRight className="size-4" /> : null}
          </Button>
        </div>
      </Container>
    </section>
  );
}
