export type EventAudience = "open" | "university-only" | "specific-department" | "faculty-only" | "staff-only" | "students-only";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type EventApprovalStatus = "pending" | "approved" | "rejected" | "needs-changes";
export type EventCategory = "tecnologia" | "cultura" | "academico" | "deportes" | "emprendimiento" | "talleres" | "conferencias" | "seminarios" | "exposiciones" | "otro";

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  organizer: string;
  organizerEmail: string;
  organizerPhone?: string;
  date: string;
  time: string;
  location: string;
  images?: string[];
  audience: EventAudience;
  audienceDetails?: string;
  cost: number;
  capacity?: number;
  currentAttendees?: number;
  registrationUrl?: string;
  status: EventStatus;
  approvalStatus: EventApprovalStatus;
  lastUpdated: string;
  category: EventCategory;
  tags?: string[];
  requirements?: string;
  contactInfo?: string;
  adminNotes?: string;
  proposedBy?: string;
  proposedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}
