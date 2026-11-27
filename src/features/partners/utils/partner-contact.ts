export function isInstagramUrl(url?: string | null): boolean {
  if (!url) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase().includes("instagram.com");
  } catch {
    return url.toLowerCase().includes("instagram.com");
  }
}

export function formatPartnerWebsiteLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "");
    const path = parsed.pathname.replace(/\/+$/, "");
    return path && path !== "/" ? `${host}${path}` : host;
  } catch {
    return url;
  }
}

export function normalizeIndonesianWhatsappDigits(
  phone?: string | null
): string | null {
  if (!phone) {
    return null;
  }
  const digits = phone.replaceAll(/\D/g, "");
  if (digits.startsWith("08") && digits.length >= 10 && digits.length <= 15) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith("628") && digits.length >= 11 && digits.length <= 16) {
    return digits;
  }
  if (digits.startsWith("8") && digits.length >= 9 && digits.length <= 14) {
    return `62${digits}`;
  }
  return null;
}

export function buildPartnerWhatsappMessage(
  partnerName: string,
  siteName: string,
  siteUrl: string
): string {
  return `Halo ${partnerName}, saya mendapatkan informasi kontak Anda dari website resmi ${siteName} (${siteUrl}). Saya ingin menanyakan informasi lebih lanjut.`;
}

export function buildPartnerWhatsappUrl(
  phone: string | null | undefined,
  partnerName: string,
  siteName: string,
  siteUrl: string
): string | null {
  const digits = normalizeIndonesianWhatsappDigits(phone);
  if (!digits) {
    return null;
  }
  const text = buildPartnerWhatsappMessage(partnerName, siteName, siteUrl);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function buildPartnerTelHref(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }
  const cleaned = phone.trim().replaceAll(/[^+\d]/g, "");
  const digitsOnly = cleaned.replaceAll(/\D/g, "");
  return digitsOnly.length >= 6 ? `tel:${cleaned}` : null;
}
