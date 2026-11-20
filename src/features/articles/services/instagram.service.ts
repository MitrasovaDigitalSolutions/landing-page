import { cacheLife, cacheTag } from "next/cache";

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseMediaItem(item: unknown): InstagramMediaItem | null {
  if (!isRecord(item)) {
    return null;
  }
  const id = typeof item.id === "string" ? item.id : null;
  const mediaUrl = typeof item.media_url === "string" ? item.media_url : null;
  const permalink = typeof item.permalink === "string" ? item.permalink : null;
  const rawType = typeof item.media_type === "string" ? item.media_type : "IMAGE";

  if (!id || !mediaUrl || !permalink) {
    return null;
  }

  let mediaType: InstagramMediaItem["media_type"] = "IMAGE";
  if (rawType === "VIDEO" || rawType === "CAROUSEL_ALBUM") {
    mediaType = rawType;
  }

  return {
    id,
    caption: typeof item.caption === "string" ? item.caption : undefined,
    media_type: mediaType,
    media_url: mediaUrl,
    thumbnail_url:
      typeof item.thumbnail_url === "string" ? item.thumbnail_url : undefined,
    permalink,
    timestamp: typeof item.timestamp === "string" ? item.timestamp : undefined,
  };
}

export async function getInstagramLiveMedia(
  limit = 6
): Promise<InstagramMediaItem[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("instagram:feed");

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return [];
  }

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }
    const json: unknown = await res.json();
    if (!isRecord(json) || !Array.isArray(json.data)) {
      return [];
    }
    return json.data
      .map(parseMediaItem)
      .filter((entry): entry is InstagramMediaItem => entry !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}
