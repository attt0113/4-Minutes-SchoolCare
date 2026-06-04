/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, ActiveAlert, MedicationInventory, AdminLog, CaseRecord } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'KZ-92',
    name: 'Kevin Zhang',
    grade: 'Grade 11B',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD238hjdl28w1gm7HiUIC4TI9EpW-9Oc3IUZFGfmUT7E1EFNw8a17jP5ebIzqTxkzNntTnDRkwjvpKDUl0i8RY7JxBc3daklXy1UMoFHoSW3VL-MDw6tGvMV0oaefC6C7VTJFu-PkHZxjI_THMnWhP58BmmF3bv5CSVczHhOlJIhieBgAkdIPdQ1IT767ltHO1yHh0u8gZaWOpe1ILCUK_eVROHJ2F4fA4pREDR0OxBKkuqlmTsUlySeHo0boNYGyHk_bkVz0bhfg',
    riskLevel: 'HIGH_RISK',
    condition: 'Acute Migraine Susceptibility',
    bloodType: 'O+',
    allergies: 'SEVERE: PEANUTS, IBUPROFEN',
    regularMeds: 'None',
    guardians: [
      { name: 'David Zhang (Father)', phone: '+1 (555) 293-8492' }
    ],
    recentLogs: [
      { date: '29 May', details: 'Acute Migraine scan sequence' }
    ]
  },
  {
    id: 'CT-04',
    name: 'Chloe Tan',
    grade: 'Grade 10A',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcheSB5Nbrz8gJ2Xqpd8JPMovrgHOdet-3M7aN4iexgBNvQmi-yVtvnE_ooIjT0TG835GhJSES0kezwNoBipt9pRJbatXF9HP5zrXCVgMTRbtVHoxltgtA_Jp8-l58_pJGmfww1TDjJ182GnF4YwujmSBlYZ2GVckPg4l5vVzRCskbIJuPMd5l0nXNusVAcdwteDsrJ8W3tPx3nGRRqcxExil9afvv2N2pypGjz_-ZcHSLZ2cra-tFMP0Xv1LCigi8dBCQdHgEYQ',
    riskLevel: 'STABLE',
    condition: 'General Clearance / Healthy',
    bloodType: 'A-',
    allergies: 'None detected',
    regularMeds: 'None',
    guardians: [
      { name: 'Arthur Tan', phone: '+1 (555) 392-1248' }
    ],
    recentLogs: [
      { date: '28 May', details: 'Water hydration levels verified' }
    ]
  },
  {
    id: 'SL-05',
    name: 'Sarah Lim',
    grade: 'Form 3B',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1Un1UWtbEA-aLw8JlHS-yRZrR4xXKAcC6pnEM4noxSO8ATp67m_AOpwApi9ZWRwrnR5IzxFTKk3Meml_STtMVo2NwZa7yvbFrYpo94e0X_Z00xOJ2t45TFGGKkGLHxl334XKcmDtnKcvC-7wZacI443DIJBrIwLEOJ6NH6zEMVUr4NWJV5Zn_VE4Jbku2yyvsm3VvKZLoFNgAmey7YREeAOf1p6cXTa-oFI4zBJb_jwpe7VIoHXNkDBopSpETgHShtwGkS3UMw',
    riskLevel: 'STABLE',
    condition: 'Asthma (Mild, Controlled)',
    bloodType: 'B+',
    allergies: 'None detected',
    regularMeds: 'Rescue blue inhaler (backpack)',
    guardians: [
      { name: 'Mrs. Lim', phone: '+1 (555) 728-1925' }
    ],
    recentLogs: [
      { date: '29 May', details: 'Asthma checkup routine stable' }
    ]
  },
  {
    id: 'RL-03',
    name: 'Ryan Lee',
    grade: 'Grade 12',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjE6kLtZ9nCGXmEE-rhoQfsEljkDa3FeH1cP2u4couVg_Y_e2N4ZtxPsLqaD-0oPIp9jScy0iZIPebbj5BlD78yzeY7zL_9B1qWCip2A42Q0UkR3FY61zxQ5w6jG16mbkPUt9sb_bF9rXWlxUNI3kfy40rSQtXaXgNp1AGj6vxzUsYPYDEE2xguq3Aq83Ic4xumSisA8mwRvDVgJqDQO3oEs4vpEcKK42E8Unzr0scXb4awPcXhdBGCgcnb_GUecwrez0Jmwj0qg',
    riskLevel: 'ROUTINE',
    condition: 'General Clearance / Robust Pulse',
    bloodType: 'AB+',
    allergies: 'None detected',
    regularMeds: 'None',
    guardians: [
      { name: 'Diana Lee', phone: '+1 (555) 192-3829' }
    ],
    recentLogs: [
      { date: '27 May', details: 'Superb wellness reports' }
    ]
  }
];

export const INITIAL_ALERTS: ActiveAlert[] = [];

export const INITIAL_INVENTORY: MedicationInventory[] = [
  {
    id: 'inv-1',
    name: "Epinephrine (Adult Dose)",
    category: 'Emergency',
    stockLevel: 2,
    unit: 'Units',
    status: 'Critical Shortage',
    expiry: '12 Dec 2024',
    description: 'Auto-injector for emergency treatment of severe allergic reactions (anaphylaxis).',
    percentage: 15
  },
  {
    id: 'inv-2',
    name: 'Antacid Tablets',
    category: 'Analgesics',
    stockLevel: 112,
    unit: 'Units',
    status: 'Expiring Soon',
    expiry: 'Oct 2024',
    description: 'Calcium carbonate chewable tablets for immediate acid-reflux and digestive relief.',
    percentage: 90
  },
  {
    id: 'inv-3',
    name: "Children's Acetaminophen",
    category: 'Analgesics',
    stockLevel: 42,
    unit: 'Units',
    status: 'Sufficient',
    expiry: 'Oct 2026',
    description: 'Pain reliever and fever reducer, cherry flavored suspensions.',
    percentage: 75
  },
  {
    id: 'inv-4',
    name: 'Ibuprofen-Based Syrup',
    category: 'Analgesics',
    stockLevel: 28,
    unit: 'Units',
    status: 'Sufficient',
    expiry: 'Mar 2026',
    description: 'Non-steroidal anti-inflammatory oral suspension for minor aches and persistent fevers.',
    percentage: 60
  }
];

export const INITIAL_ADMIN_LOGS: AdminLog[] = [
  {
    id: 'log-1',
    studentId: 'SL-05',
    studentName: 'Sarah Lim',
    studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1Un1UWtbEA-aLw8JlHS-yRZrR4xXKAcC6pnEM4noxSO8ATp67m_AOpwApi9ZWRwrnR5IzxFTKk3Meml_STtMVo2NwZa7yvbFrYpo94e0X_Z00xOJ2t45TFGGKkGLHxl334XKcmDtnKcvC-7wZacI443DIJBrIwLEOJ6NH6zEMVUr4NWJV5Zn_VE4Jbku2yyvsm3VvKZLoFNgAmey7YREeAOf1p6cXTa-oFI4zBJb_jwpe7VIoHXNkDBopSpETgHShtwGkS3UMw',
    medicineName: 'Rescue Inhaler',
    dosage: '1 Puff (Inhalation)',
    time: '09:12 AM',
    staffName: 'Cikgu Lim',
    status: 'Administered'
  },
  {
    id: 'log-2',
    studentId: 'KZ-92',
    studentName: 'Kevin Zhang',
    studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD238hjdl28w1gm7HiUIC4TI9EpW-9Oc3IUZFGfmUT7E1EFNw8a17jP5ebIzqTxkzNntTnDRkwjvpKDUl0i8RY7JxBc3daklXy1UMoFHoSW3VL-MDw6tGvMV0oaefC6C7VTJFu-PkHZxjI_THMnWhP58BmmF3bv5CSVczHhOlJIhieBgAkdIPdQ1IT767ltHO1yHh0u8gZaWOpe1ILCUK_eVROHJ2F4fA4pREDR0OxBKkuqlmTsUlySeHo0boNYGyHk_bkVz0bhfg',
    medicineName: 'Cold Compress Application',
    dosage: 'Topical Compress applied to forehead',
    time: '10:45 AM',
    staffName: 'Nurse Diana',
    status: 'Emergency'
  }
];

export const INITIAL_CASE_RECORDS: CaseRecord[] = [
  {
    id: 'case-9921',
    studentId: 'KZ-92',
    studentName: 'Kevin Zhang',
    studentGrade: 'Grade 11B',
    studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD238hjdl28w1gm7HiUIC4TI9EpW-9Oc3IUZFGfmUT7E1EFNw8a17jP5ebIzqTxkzNntTnDRkwjvpKDUl0i8RY7JxBc3daklXy1UMoFHoSW3VL-MDw6tGvMV0oaefC6C7VTJFu-PkHZxjI_THMnWhP58BmmF3bv5CSVczHhOlJIhieBgAkdIPdQ1IT767ltHO1yHh0u8gZaWOpe1ILCUK_eVROHJ2F4fA4pREDR0OxBKkuqlmTsUlySeHo0boNYGyHk_bkVz0bhfg',
    hash: '7f8a9e62cd',
    activeStatusLabel: 'Active Case Audit #LOG-9921',
    severity: 'HIGH_RISK',
    summaryDescription: 'Acute Migraine Session. High visual distress. Light-sensitive.',
    reportedTime: '14:22 PM',
    registeredNurse: 'S. Sterling',
    timeline: [
      {
        id: 't-1',
        time: '14:22:04',
        title: 'AI SCAN TRIGGERED',
        description: 'Physical thermal and cranial scan sequence completed.',
        notes: '"Facial thermal congestion, cranial muscular stress, and light sensitivity indicate an active acute migraine attack with high physical discomfort."',
        type: 'AI_SCAN'
      },
      {
        id: 't-2',
        time: '14:23:45',
        title: 'CLINICAL INTERVENTION',
        description: 'Transferred Student to a dark quiet rest area. Administered a cold compress. Verified ibuprofen avoidance due to severe allergy warnings.',
        notes: 'Monitored visual auras. General condition stable but high discomfort.',
        type: 'CLINICAL'
      }
    ],
     dosageAudit: {
      medicationName: 'Cold Compress',
      dose: '1 unit',
      lotNumber: 'COMPRESS-A1'
    },
    hasAttachment: false
  },
  {
    id: 'case-9922',
    studentId: 'SL-05',
    studentName: 'Sarah Lim',
    studentGrade: 'Form 3B',
    studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1Un1UWtbEA-aLw8JlHS-yRZrR4xXKAcC6pnEM4noxSO8ATp67m_AOpwApi9ZWRwrnR5IzxFTKk3Meml_STtMVo2NwZa7yvbFrYpo94e0X_Z00xOJ2t45TFGGKkGLHxl334XKcmDtnKcvC-7wZacI443DIJBrIwLEOJ6NH6zEMVUr4NWJV5Zn_VE4Jbku2yyvsm3VvKZLoFNgAmey7YREeAOf1p6cXTa-oFI4zBJb_jwpe7VIoHXNkDBopSpETgHShtwGkS3UMw',
    hash: '8f2c3d10ab',
    activeStatusLabel: 'Case Audit #LOG-9922',
    severity: 'ROUTINE',
    summaryDescription: 'Routine Asthma Preventive Checkup',
    reportedTime: '11:15 AM',
    registeredNurse: 'S. Sterling',
    timeline: [
      {
        id: 't2-1',
        time: '11:15:00',
        title: 'CLINICAL INTAKE',
        description: 'Asthma (Mild, Controlled) routine checkup completed. Respiratory biometrics display stable flow with no indication of wheezing or dyspnea.',
        notes: 'Confirm she has rescue blue inhaler inside backpack.',
        type: 'AI_SCAN'
      }
    ],
    hasAttachment: false
  },
  {
    id: 'case-9923',
    studentId: 'CT-04',
    studentName: 'Chloe Tan',
    studentGrade: 'Grade 10A',
    studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcheSB5Nbrz8gJ2Xqpd8JPMovrgHOdet-3M7aN4iexgBNvQmi-yVtvnE_ooIjT0TG835GhJSES0kezwNoBipt9pRJbatXF9HP5zrXCVgMTRbtVHoxltgtA_Jp8-l58_pJGmfww1TDjJ182GnF4YwujmSBlYZ2GVckPg4l5vVzRCskbIJuPMd5l0nXNusVAcdwteDsrJ8W3tPx3nGRRqcxExil9afvv2N2pypGjz_-ZcHSLZ2cra-tFMP0Xv1LCigi8dBCQdHgEYQ',
    hash: '9a3c1e5509',
    activeStatusLabel: 'Routine Intake #LOG-9923',
    severity: 'ROUTINE',
    summaryDescription: 'General Wellness Clearance',
    reportedTime: '09:12 AM',
    registeredNurse: 'Nurse Diana',
    timeline: [
      {
        id: 't3-1',
        time: '09:12:00',
        title: 'CLINICAL INTAKE',
        description: 'Symmetrical facial temperature map. Happy and fully relaxed expression with normal pupil size and regular respiratory rate.',
         notes: 'Verify water hydration levels. Fully cleared for regular sports, recess, and school curriculum.',
        type: 'CLINICAL'
      }
    ],
    hasAttachment: false
  }
];
