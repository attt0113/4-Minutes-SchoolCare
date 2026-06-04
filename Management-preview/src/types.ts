/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  riskLevel: 'HIGH_RISK' | 'ROUTINE' | 'OBSERVED' | 'RESOLVED' | 'STABLE';
  condition: string;
  trend?: string;
  trendIcon?: 'warning' | 'check' | 'alert';
  visitsThisWeek?: number;
  bloodType?: string;
  allergies?: string;
  regularMeds?: string;
  guardians: {
    name: string;
    phone: string;
  }[];
  recentLogs: {
    date: string;
    details: string;
  }[];
}

export interface ActiveAlert {
  id: string;
  type: 'SOS ALERT' | 'TEACHER REFERRAL';
  studentName: string;
  grade: string;
  reporter: string;
  reportedTime: string;
  description: string;
  acknowledged?: boolean;
  scanSeverity?: 'emergency' | 'mild' | 'moderate';
  aiSuggestion?: {
    insight: string;
    steps: {
      text: string;
      iconType: 'dark_area' | 'no_ibuprofen' | 'vitals_guardian' | 'hydration' | 'clearance' | 'inhaler_backpack' | 'classroom_return';
    }[];
  };
}

export interface MedicationInventory {
  id: string;
  name: string;
  category: 'Analgesics' | 'Emergency' | 'Respiratory' | 'Diabetes';
  stockLevel: number;
  unit: string;
  status: 'Sufficient' | 'Expiring Soon' | 'Low Stock' | 'Critical Shortage';
  expiry: string;
  description: string;
  percentage: number;
}

export interface AdminLog {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  medicineName: string;
  dosage: string;
  time: string;
  staffName: string;
  status: 'Administered' | 'Emergency' | 'Pending';
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  notes?: string;
  type: 'AI_SCAN' | 'CLINICAL' | 'PARENT' | 'EMS';
  statusLabel?: string;
  statusValue?: string;
}

export interface CaseRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentAvatar: string;
  hash: string;
  activeStatusLabel: string;
  severity: 'HIGH_RISK' | 'ROUTINE' | 'OBSERVED' | 'RESOLVED';
  summaryDescription: string;
  reportedTime: string;
  registeredNurse: string;
  timeline: TimelineEvent[];
  dosageAudit?: {
    medicationName: string;
    dose: string;
    lotNumber: string;
  };
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentDate?: string;
}
