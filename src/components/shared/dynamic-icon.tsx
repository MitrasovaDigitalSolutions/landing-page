import type { LucideIcon } from "lucide-react";
import { resolveDynamicIcon } from "@/utils/icon-mapper";
import { createElement } from "react";

interface DynamicIconProps {
  name?: string | null;
  className?: string;
  fallback?: LucideIcon;
}

export function DynamicIcon({
  name,
  className = "size-4",
  fallback,
}: DynamicIconProps): React.JSX.Element {
  const iconComponent = resolveDynamicIcon(name, fallback);
  return createElement(iconComponent, { className });
}
