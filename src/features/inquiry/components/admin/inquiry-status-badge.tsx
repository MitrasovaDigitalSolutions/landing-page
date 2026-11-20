"use client";

import { StatusBadge } from "@/components/ui/status-badge";

interface InquiryStatusBadgeProps {
  status: string;
  className?: string;
}

export function InquiryStatusBadge({
  status,
  className,
}: InquiryStatusBadgeProps): React.JSX.Element {
  return <StatusBadge status={status} className={className} />;
}
