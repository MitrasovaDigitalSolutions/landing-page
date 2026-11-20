import { ExternalLink, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessUnitActionsProps {
  unitName: string;
  unitUrl: string | null;
  address: string;
}

function buildMapsUrl(address: string, name: string): string {
  const query = `${name} ${address}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function BusinessUnitActions({
  unitName,
  unitUrl,
  address,
}: BusinessUnitActionsProps): React.JSX.Element | null {
  if (!unitUrl && !address) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
      {unitUrl ? (
        <Button
          size="xs"
          nativeButton={false}
          className="h-8 gap-1.5 rounded-lg px-3 text-xs font-bold shadow-xs"
          render={
            <a href={unitUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          <Globe className="size-3.5" />
          <span>Kunjungi Website</span>
          <ExternalLink className="size-3" />
        </Button>
      ) : null}

      {address ? (
        <Button
          variant="outline"
          size="xs"
          nativeButton={false}
          className="h-8 gap-1.5 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-primary/40 hover:text-primary"
          render={
            <a
              href={buildMapsUrl(address, unitName)}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MapPin className="size-3.5 text-primary" />
          <span>Peta Lokasi</span>
        </Button>
      ) : null}
    </div>
  );
}
