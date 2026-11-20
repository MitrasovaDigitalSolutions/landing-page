import { MessageCircle } from "lucide-react";

interface WhatsappFabProps {
  whatsappNumber?: string;
  siteName?: string;
}

export function WhatsappFab({
  whatsappNumber,
  siteName,
}: WhatsappFabProps): React.JSX.Element | null {
  if (!whatsappNumber) {
    return null;
  }

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const defaultMessage = encodeURIComponent(
    `Halo ${siteName ?? "Mitrasova"}, saya ingin menanyakan informasi layanan Anda.`
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 focus:outline-hidden"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
