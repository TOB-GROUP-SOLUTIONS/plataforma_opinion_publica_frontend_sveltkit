export interface Reference {
  id: number;
  name: string;
  type: string;
  institution?: string;
  contact_email: string;
  contact_phone?: string;
  commission_rate?: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  referral_code?: string;
  link_form?: string;
}