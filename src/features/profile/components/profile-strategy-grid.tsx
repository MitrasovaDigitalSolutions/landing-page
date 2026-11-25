import { StrategyProgramGrid } from "@/components/sections/strategy-program-grid";
import type { PageSectionListItem } from "@/types/api.types";

interface ProfileStrategyGridProps {
  items: PageSectionListItem[];
}

export function ProfileStrategyGrid({
  items,
}: ProfileStrategyGridProps): React.JSX.Element {
  return <StrategyProgramGrid items={items} />;
}
