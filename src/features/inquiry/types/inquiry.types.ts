export type InquiryStatus = "new" | "contacted" | "closed";

export interface InquiryItem {
  id: number;
  site_id?: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  attachment_url?: string | null;
  status: InquiryStatus;
  notes?: string | null;
  created_at: string;
}
