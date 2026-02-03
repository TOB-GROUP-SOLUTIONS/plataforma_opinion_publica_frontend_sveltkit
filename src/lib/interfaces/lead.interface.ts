export interface Lead {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  status?: {
    id: number;
    key: string;
    value: string;
    type: string;
    description?: string;
  };
  referrer_id?: number;
  interest_level?: {
    id: number;
    key: string;
    value: string;
    type: string;
    description?: string;
  };
  source?: string;
  notes?: string;
  status_lead?: {
    id: number;
    key: string;
    value: string;
    type: string;
    description?: string;
  };
  city?: string;
  created_at: Date;
  updatedAt: Date;
  deletedAt?: Date;
  assigned_to?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}
