import { VisionMissionSection } from "@/components/sections/vision-mission-section";
import type { PageSection } from "@/types/api.types";

interface ProfileVisionMissionProps {
  section?: PageSection;
}

export function ProfileVisionMission({
  section,
}: ProfileVisionMissionProps): React.JSX.Element | null {
  return <VisionMissionSection section={section} />;
}
