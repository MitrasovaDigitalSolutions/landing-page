import {
  HistorySection,
  type HistoryMilestone,
} from "@/components/sections/history-section";
import type { PageSection } from "@/types/api.types";

interface ProfileHistoryProps {
  section?: PageSection;
  showKspMilestones?: boolean;
}

const KSP_MILESTONES: readonly HistoryMilestone[] = [
  {
    year: "2005",
    label: "21 Maret 2005 — Pendirian KSU Mitra Sejati dari peleburan 5 kelompok",
  },
  {
    year: "2006",
    label: "Memperoleh Badan Hukum awal Nomor 180/518/44 Tahun 2006",
  },
  {
    year: "2025",
    label:
      "Transformasi kelembagaan KSP Mitra Sejati Persada (AHU-0003640.AH.38.TAHUN 2025)",
  },
];

export function ProfileHistory({
  section,
  showKspMilestones = false,
}: ProfileHistoryProps): React.JSX.Element | null {
  return (
    <HistorySection
      section={section}
      milestones={showKspMilestones ? KSP_MILESTONES : undefined}
    />
  );
}
