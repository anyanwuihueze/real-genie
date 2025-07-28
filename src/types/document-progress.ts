
export type DocumentStatusType = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface DocumentProgress {
  id: string;
  name: string;
  status: DocumentStatusType;
  details?: string; // Optional details, e.g., "Submitted on 2024-07-15" or "Rejection reason: blurry scan"
}
