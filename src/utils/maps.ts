export function extractMapsEmbedSrc(raw?: string | null): string | null {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return null;
  }
  if (trimmed.toLowerCase().includes("<iframe")) {
    const srcMatch = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(trimmed);
    const extracted = srcMatch?.[1] ?? srcMatch?.[2] ?? "";
    if (extracted.trim().length > 0) {
      return extracted.trim();
    }
  }
  return trimmed;
}

interface ParsedCoords {
  lat: string;
  lng: string;
}

function extractEmbedCoords(rawUrl: string): ParsedCoords | null {
  const pbMatch = /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/.exec(rawUrl);
  if (pbMatch?.[1] && pbMatch[2]) {
    return { lat: pbMatch[2], lng: pbMatch[1] };
  }
  const pbReverseMatch = /!3d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/.exec(
    rawUrl
  );
  if (pbReverseMatch?.[1] && pbReverseMatch[2]) {
    return { lat: pbReverseMatch[1], lng: pbReverseMatch[2] };
  }
  const queryMatch =
    /[?&](?:ll|q|center)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/i.exec(
      rawUrl
    );
  if (queryMatch?.[1] && queryMatch[2]) {
    return { lat: queryMatch[1], lng: queryMatch[2] };
  }
  return null;
}

function extractEmbedCid(rawUrl: string): string | null {
  const hexMatch = /!1s0x[0-9a-f]+(?::|%3A)0x([0-9a-f]+)/i.exec(rawUrl);
  if (!hexMatch?.[1]) {
    return null;
  }
  try {
    return BigInt(`0x${hexMatch[1]}`).toString();
  } catch {
    return null;
  }
}

export function resolveMapsIframeSrc(
  mapsEmbed?: string | null
): string | null {
  const src = extractMapsEmbedSrc(mapsEmbed);
  if (!src) {
    return null;
  }
  if (src.includes("/maps/embed")) {
    return src;
  }
  try {
    const parsed = new URL(src);
    const host = parsed.hostname.toLowerCase();
    const isGoogleMaps =
      host.includes("google.com") || host.includes("maps.google.");
    if (isGoogleMaps && !parsed.searchParams.has("output")) {
      parsed.searchParams.set("output", "embed");
    }
    return parsed.toString();
  } catch {
    return src;
  }
}

export function resolveDirectMapsUrl(
  mapsEmbed?: string | null,
  fallbackQuery?: string | null
): string | null {
  const src = extractMapsEmbedSrc(mapsEmbed);
  if (src) {
    if (src.includes("/maps/embed")) {
      const coords = extractEmbedCoords(src);
      const cid = extractEmbedCid(src);
      if (coords && cid) {
        return `https://maps.google.com/maps?ll=${coords.lat},${coords.lng}&z=17&t=m&hl=id&gl=ID&mapclient=embed&cid=${cid}`;
      }
      if (coords) {
        return `https://maps.google.com/maps?ll=${coords.lat},${coords.lng}&q=${coords.lat},${coords.lng}&z=17&t=m&hl=id&gl=ID`;
      }
      if (cid) {
        return `https://maps.google.com/maps?hl=id&gl=ID&cid=${cid}`;
      }
    }

    try {
      const parsed = new URL(src);
      if (parsed.searchParams.get("output") === "embed") {
        parsed.searchParams.delete("output");
        const coords = extractEmbedCoords(src);
        if (coords && !parsed.searchParams.has("ll")) {
          parsed.searchParams.set("ll", `${coords.lat},${coords.lng}`);
        }
      }
      return parsed.toString();
    } catch {
      return src;
    }
  }

  const cleanFallback = fallbackQuery?.trim() ?? "";
  if (cleanFallback.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanFallback)}`;
  }

  return null;
}
