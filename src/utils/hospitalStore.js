/**
 * Medix Healthcare Portal - Hospital Data Store & Database Layer
 * Provides persistent data storage in localStorage for:
 * 1. Three distinct demo patient accounts (Kabir Patel, Ananya Singh, Rahul Mehta)
 * 2. Patient-specific appointments, medication schedules, doses, vitals, and reports
 * 3. Configurable email notification recipients and delivery audit logs
 * 4. Evaluation demo mode helpers
 */

const STORAGE_KEYS = {
  PATIENTS: 'medix_db_patients',
  EMAIL_RECIPIENTS: 'medix_db_email_recipients',
  EMAIL_LOGS: 'medix_db_email_logs',
  DOSE_LOGS: 'medix_db_dose_logs',
  ACTIVE_PATIENT_ID: 'medix_active_patient_id'
};

// ---------------------------------------------------------------------------
// INITIAL DEMO PATIENTS DATA (Fictional, realistic healthcare data for evaluation)
// ---------------------------------------------------------------------------
const DEFAULT_PATIENTS = [
  // -------------------------------------------------------------------------
  // PATIENT 1: Kabir Patel (Cardiology & Hypertension Focus)
  // -------------------------------------------------------------------------
  {
    id: 'MX-1001',
    name: 'Kabir Patel',
    age: 45,
    dob: '1981-05-14',
    gender: 'Male',
    email: 'kabir.patel@medix.com',
    password: 'MedixPatient2026!',
    phone: '+1 (555) 234-5678',
    bloodGroup: 'B+',
    address: '742 Heritage Boulevard, Edison, NJ 08820',
    emergencyContact: {
      name: 'Priya Patel',
      relationship: 'Spouse',
      phone: '+1 (555) 901-2345'
    },
    primaryPhysician: 'Dr. Sarah Jenkins, MD (Cardiologist)',
    knownAllergies: [
      { allergen: 'Penicillin', severity: 'Moderate', reaction: 'Diffuse cutaneous rash & pruritus' },
      { allergen: 'Peanuts', severity: 'Severe', reaction: 'Anaphylaxis - Epipen prescribed' }
    ],
    chronicConditions: ['Hypertension (Stage 1)', 'Mild Intermittent Asthma'],
    medicalHistory: 'Diagnosed with essential hypertension in 2021. Well-controlled with Lisinopril. Childhood asthma with seasonal exacerbations. Appendectomy in 2014. No prior cardiac events. Non-smoker.',
    vitals: {
      bp: '124/82 mmHg',
      bpStatus: 'Normal (Controlled)',
      pulse: '72 bpm',
      spo2: '98%',
      temp: '98.6 °F',
      glucose: '94 mg/dL',
      weight: '74 kg (163 lbs)',
      bmi: '24.2 kg/m²'
    },
    medications: [
      {
        id: 'med_101',
        name: 'Lisinopril',
        dosage: '10mg',
        unit: '1 tablet daily',
        period: 'Morning',
        time: '8:00 AM',
        instructions: 'Take with food and full glass of water. Do not skip doses.',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        startDate: '2026-01-10',
        endDate: 'Ongoing',
        rxNumber: 'RX-492019',
        refillsRemaining: 3,
        purpose: 'Blood Pressure Control',
        taken: true,
        takenTime: '8:15 AM'
      },
      {
        id: 'med_102',
        name: 'Albuterol Inhaler (Ventolin HFA)',
        dosage: '90mcg',
        unit: '2 puffs',
        period: 'Morning',
        time: '8:30 AM',
        instructions: 'Rinse mouth with water following use. Use spacer for optimal delivery.',
        doctor: 'Dr. Kevin Reed',
        specialty: 'Pulmonology',
        startDate: '2026-03-01',
        endDate: 'Ongoing',
        rxNumber: 'RX-881920',
        refillsRemaining: 2,
        purpose: 'Asthma Maintenance',
        taken: true,
        takenTime: '8:35 AM'
      },
      {
        id: 'med_103',
        name: 'Daily Multivitamin + Zinc',
        dosage: 'Standard',
        unit: '1 softgel',
        period: 'Afternoon',
        time: '1:00 PM',
        instructions: 'Take with midday meal.',
        doctor: 'Dr. Mark Davis',
        specialty: 'Internal Medicine',
        startDate: '2026-02-15',
        endDate: '2026-12-31',
        rxNumber: 'RX-339102',
        refillsRemaining: 5,
        purpose: 'General Wellness',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_104',
        name: 'Atorvastatin (Lipitor)',
        dosage: '20mg',
        unit: '1 tablet',
        period: 'Evening',
        time: '7:30 PM',
        instructions: 'Take with water after dinner. Avoid grapefruit juice.',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        startDate: '2026-01-10',
        endDate: 'Ongoing',
        rxNumber: 'RX-492022',
        refillsRemaining: 4,
        purpose: 'Cholesterol & Lipid Management',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_105',
        name: 'Magnesium Glycinate',
        dosage: '200mg',
        unit: '1 capsule',
        period: 'Night',
        time: '10:00 PM',
        instructions: 'Take 30 minutes before bedtime with water for sleep and muscle relaxation.',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        startDate: '2026-04-01',
        endDate: 'Ongoing',
        rxNumber: 'RX-119204',
        refillsRemaining: 6,
        purpose: 'Musculoskeletal Relaxation',
        taken: false,
        takenTime: ''
      }
    ],
    appointments: [
      {
        id: 'APT-1001',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        date: '2026-11-04',
        month: 'NOV',
        day: '04',
        time: '10:00 AM',
        department: 'Cardiovascular Care Center - Suite 4B',
        status: 'Upcoming',
        visitType: 'In-Person Consultation',
        reason: 'Hypertension 3-Month Follow-up & BP Monitoring',
        notes: 'Please bring your 14-day home blood pressure logbook.',
        initials: 'SJ'
      },
      {
        id: 'APT-1002',
        doctor: 'Dr. Kevin Reed',
        specialty: 'Pulmonology',
        date: '2026-11-18',
        month: 'NOV',
        day: '18',
        time: '02:30 PM',
        department: 'Respiratory Health Clinic - Room 208',
        status: 'Upcoming',
        visitType: 'Diagnostic Check',
        reason: 'Annual Respiratory Review & Spirometry Test',
        notes: 'Refrain from vigorous exercise and caffeine 4 hours prior.',
        initials: 'KR'
      },
      {
        id: 'APT-1003',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        date: '2026-09-12',
        month: 'SEP',
        day: '12',
        time: '09:15 AM',
        department: 'Cardiovascular Care Center',
        status: 'Completed',
        visitType: 'Diagnostic ECG',
        reason: 'Baseline Resting 12-Lead Electrocardiogram (ECG)',
        notes: 'Normal sinus rhythm confirmed at 72 bpm. PR & QTc intervals normal.',
        initials: 'SJ'
      },
      {
        id: 'APT-1004',
        doctor: 'Dr. Mark Davis',
        specialty: 'General Practice',
        date: '2026-08-28',
        month: 'AUG',
        day: '28',
        time: '03:45 PM',
        department: 'Primary Care Ambulatory Wing',
        status: 'Completed',
        visitType: 'Annual Physical',
        reason: 'Comprehensive Preventive Health Assessment',
        notes: 'All systemic screenings unremarkable. Patient reported high compliance with meds.',
        initials: 'MD'
      }
    ],
    reports: [
      {
        id: 'REP-101',
        category: 'Blood Work',
        title: 'Comprehensive Metabolic Panel (CMP-14)',
        date: 'Oct 12, 2026',
        doctor: 'Dr. Emily Smith',
        initials: 'ES',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'Sodium: 139 mEq/L, Potassium: 4.1 mEq/L, BUN: 14 mg/dL, Creatinine: 0.85 mg/dL. Renal and liver markers within optimal limits.'
      },
      {
        id: 'REP-102',
        category: 'Diagnostic Imaging',
        title: 'Chest Radiograph (PA & Lateral)',
        date: 'Sep 28, 2026',
        doctor: 'Dr. Michael Jones',
        initials: 'MJ',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'Lungs are clear bilaterally. Cardiothoracic ratio normal (<50%). No pleural effusion or active infiltrates.'
      },
      {
        id: 'REP-103',
        category: 'Lipid Panel',
        title: 'Fasting Lipid & Cholesterol Panel',
        date: 'Sep 12, 2026',
        doctor: 'Dr. Sarah Jenkins',
        initials: 'SJ',
        status: 'REVIEWED',
        type: 'review-report',
        summary: 'Total Cholesterol: 198 mg/dL, HDL: 56 mg/dL, LDL: 118 mg/dL, Triglycerides: 120 mg/dL. Statin therapy effective.'
      }
    ],
    notifications: [
      {
        id: 'notif_101',
        category: 'appointment',
        title: 'Upcoming Cardiology Appointment',
        message: 'Your follow-up with Dr. Sarah Jenkins is scheduled for Nov 04, 2026 at 10:00 AM.',
        timestamp: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 'notif_102',
        category: 'medication',
        title: 'Evening Medication Reminder',
        message: 'Atorvastatin 20mg is scheduled for 7:30 PM today.',
        timestamp: '5 hours ago',
        read: false,
        priority: 'medium'
      },
      {
        id: 'notif_103',
        category: 'report',
        title: 'Lab Report Ready for Review',
        message: 'Comprehensive Metabolic Panel (CMP-14) results have been uploaded.',
        timestamp: '2 days ago',
        read: true,
        priority: 'low'
      },
      {
        id: 'notif_104',
        category: 'hospital',
        title: 'Seasonal Flu Vaccination Clinic',
        message: 'Annual flu shots are available at the North Pavilion without appointment.',
        timestamp: '3 days ago',
        read: true,
        priority: 'low'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // PATIENT 2: Ananya Singh (Endocrinology & Type 2 Diabetes Focus)
  // -------------------------------------------------------------------------
  {
    id: 'MX-1002',
    name: 'Ananya Singh',
    age: 36,
    dob: '1990-09-22',
    gender: 'Female',
    email: 'ananya.singh@medix.com',
    password: 'MedixPatient2026!',
    phone: '+1 (555) 789-0123',
    bloodGroup: 'O+',
    address: '1428 Elm Creek Road, Austin, TX 78701',
    emergencyContact: {
      name: 'Rohan Singh',
      relationship: 'Spouse',
      phone: '+1 (555) 432-1098'
    },
    primaryPhysician: 'Dr. Alan Smith, MD (Endocrinologist)',
    knownAllergies: [
      { allergen: 'Sulfa Antibiotics', severity: 'Moderate', reaction: 'Generalized erythematous hives & fever' },
      { allergen: 'Latex', severity: 'Mild', reaction: 'Localized contact urticaria' }
    ],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Hyperlipidemia', 'Mild Hypothyroidism'],
    medicalHistory: 'T2D diagnosed in 2020; current HbA1c 6.9%; managed with Metformin ER and lifestyle modifications. Regular endocrine checkups, annual diabetic retinopathy screening up to date. Non-smoker.',
    vitals: {
      bp: '122/78 mmHg',
      bpStatus: 'Normal (Controlled)',
      pulse: '74 bpm',
      spo2: '98%',
      temp: '98.4 °F',
      glucose: '124 mg/dL',
      weight: '62 kg (136 lbs)',
      bmi: '23.4 kg/m²'
    },
    medications: [
      {
        id: 'med_201',
        name: 'Metformin HCl Extended-Release',
        dosage: '1000mg',
        unit: '1 tablet',
        period: 'Morning',
        time: '8:00 AM',
        instructions: 'Take with breakfast to minimize gastrointestinal discomfort.',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        startDate: '2026-01-05',
        endDate: 'Ongoing',
        rxNumber: 'RX-772019',
        refillsRemaining: 5,
        purpose: 'Glycemic Regulation',
        taken: true,
        takenTime: '8:05 AM'
      },
      {
        id: 'med_202',
        name: 'Glipizide',
        dosage: '5mg',
        unit: '1 tablet',
        period: 'Morning',
        time: '8:30 AM',
        instructions: 'Take 30 minutes before morning meal. Monitor for signs of hypoglycemia.',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        startDate: '2026-02-01',
        endDate: 'Ongoing',
        rxNumber: 'RX-551092',
        refillsRemaining: 3,
        purpose: 'Insulin Secretion Support',
        taken: true,
        takenTime: '8:30 AM'
      },
      {
        id: 'med_203',
        name: 'Glucosamine & Chondroitin Complex',
        dosage: '1500mg',
        unit: '2 caplets',
        period: 'Afternoon',
        time: '1:30 PM',
        instructions: 'Take with midday lunch for knee cartilage and joint support.',
        doctor: 'Dr. Emily Smith',
        specialty: 'Orthopedics',
        startDate: '2026-03-10',
        endDate: 'Ongoing',
        rxNumber: 'RX-992104',
        refillsRemaining: 4,
        purpose: 'Joint Health & Osteoarthritis',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_204',
        name: 'Metformin HCl Extended-Release',
        dosage: '1000mg',
        unit: '1 tablet',
        period: 'Evening',
        time: '7:00 PM',
        instructions: 'Take with evening meal.',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        startDate: '2026-01-05',
        endDate: 'Ongoing',
        rxNumber: 'RX-772020',
        refillsRemaining: 5,
        purpose: 'Glycemic Regulation',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_205',
        name: 'Rosuvastatin (Crestor)',
        dosage: '10mg',
        unit: '1 tablet',
        period: 'Evening',
        time: '8:00 PM',
        instructions: 'Take with water following dinner.',
        doctor: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        startDate: '2026-01-15',
        endDate: 'Ongoing',
        rxNumber: 'RX-663910',
        refillsRemaining: 2,
        purpose: 'Cardiovascular Risk Reduction',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_206',
        name: 'Melatonin',
        dosage: '3mg',
        unit: '1 quick-dissolve tablet',
        period: 'Night',
        time: '10:15 PM',
        instructions: 'Dissolve in mouth 20 minutes prior to sleep.',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        startDate: '2026-03-01',
        endDate: 'Ongoing',
        rxNumber: 'RX-228193',
        refillsRemaining: 6,
        purpose: 'Circadian Sleep Rhythm',
        taken: false,
        takenTime: ''
      }
    ],
    appointments: [
      {
        id: 'APT-2001',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        date: '2026-11-08',
        month: 'NOV',
        day: '08',
        time: '11:15 AM',
        department: 'Diabetes & Metabolism Institute - Suite 3',
        status: 'Upcoming',
        visitType: 'Consultation & Review',
        reason: 'Quarterly HbA1c & Diabetic Care Assessment',
        notes: 'Fasting blood draw scheduled 45 minutes prior at Outpatient Lab.',
        initials: 'AS'
      },
      {
        id: 'APT-2002',
        doctor: 'Dr. Emily Smith',
        specialty: 'Orthopedics',
        date: '2026-11-22',
        month: 'NOV',
        day: '22',
        time: '09:00 AM',
        department: 'Joint Replacement & Sports Medicine Pavilion',
        status: 'Upcoming',
        visitType: 'Follow-up Evaluation',
        reason: 'Bilateral Knee Joint Pain & Mobility Evaluation',
        notes: 'Wear comfortable athletic attire suitable for mobility testing.',
        initials: 'ES'
      },
      {
        id: 'APT-2003',
        doctor: 'Dr. Alan Smith',
        specialty: 'Endocrinology',
        date: '2026-08-14',
        month: 'AUG',
        day: '14',
        time: '02:00 PM',
        department: 'Diabetes & Metabolism Institute',
        status: 'Completed',
        visitType: 'Diabetic Screening',
        reason: 'Comprehensive Monofilament Foot & Retinal Screening',
        notes: 'Monofilament test demonstrated intact protective sensation bilaterally.',
        initials: 'AS'
      }
    ],
    reports: [
      {
        id: 'REP-201',
        category: 'Endocrinology',
        title: 'Glycated Hemoglobin (HbA1c) & Glucose Panel',
        date: 'Oct 08, 2026',
        doctor: 'Dr. Alan Smith',
        initials: 'AS',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'HbA1c: 7.1% (Target <7.2%), Fasting Blood Glucose: 136 mg/dL. Demonstrates stable glycemic control.'
      },
      {
        id: 'REP-202',
        category: 'Renal Panel',
        title: 'Renal Function & Urine Microalbumin',
        date: 'Sep 20, 2026',
        doctor: 'Dr. Alan Smith',
        initials: 'AS',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'eGFR: >90 mL/min/1.73m², Urine Albumin/Creatinine Ratio: 18 mg/g (Normal <30). No evidence of diabetic nephropathy.'
      }
    ],
    notifications: [
      {
        id: 'notif_201',
        category: 'appointment',
        title: 'Upcoming Endocrinology Consultation',
        message: 'Your HbA1c review with Dr. Alan Smith is set for Nov 08 at 11:15 AM.',
        timestamp: '1 day ago',
        read: false,
        priority: 'high'
      },
      {
        id: 'notif_202',
        category: 'medication',
        title: 'Afternoon Dose Due',
        message: 'Glucosamine & Chondroitin 1500mg dose is due with lunch.',
        timestamp: '3 hours ago',
        read: false,
        priority: 'medium'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // PATIENT 3: Rahul Mehta (Sports Medicine & Hematology Focus)
  // -------------------------------------------------------------------------
  {
    id: 'MX-1003',
    name: 'Rahul Mehta',
    age: 29,
    dob: '1997-03-18',
    gender: 'Male',
    email: 'rahul.mehta@medix.com',
    password: 'MedixPatient2026!',
    phone: '+1 (555) 456-7890',
    bloodGroup: 'AB+',
    address: '3200 Ocean Boulevard, San Diego, CA 92109',
    emergencyContact: {
      name: 'Neha Mehta',
      relationship: 'Sister',
      phone: '+1 (555) 876-5432'
    },
    primaryPhysician: 'Dr. Emily Smith, MD (Sports Medicine)',
    knownAllergies: [
      { allergen: 'No Known Drug Allergies (NKDA)', severity: 'None', reaction: 'No documented drug allergies' }
    ],
    chronicConditions: ['Iron Deficiency Anemia (Mild/Treated)', 'Post-ACL Reconstruction (Left Knee - Rehab Phase 3)'],
    medicalHistory: 'Left anterior cruciate ligament (ACL) reconstruction using hamstring autograft 16 weeks ago. Recovering with physical therapy 2x weekly. Athletic iron deficiency treated with oral ferrous sulfate. Excellent overall cardiovascular fitness.',
    vitals: {
      bp: '118/76 mmHg',
      bpStatus: 'Optimal',
      pulse: '66 bpm',
      spo2: '99%',
      temp: '98.6 °F',
      glucose: '88 mg/dL',
      weight: '72 kg (158 lbs)',
      bmi: '22.4 kg/m²'
    },
    medications: [
      {
        id: 'med_301',
        name: 'Ferrous Sulfate',
        dosage: '325mg (65mg Elemental Iron)',
        unit: '1 tablet',
        period: 'Morning',
        time: '7:30 AM',
        instructions: 'Take on empty stomach with Vitamin C juice. Do not consume milk, tea, or antacids within 2 hours.',
        doctor: 'Dr. Lisa Wong',
        specialty: 'Hematology',
        startDate: '2026-02-10',
        endDate: '2026-11-30',
        rxNumber: 'RX-884102',
        refillsRemaining: 1,
        purpose: 'Iron Deficiency Anemia Therapy',
        taken: true,
        takenTime: '7:40 AM'
      },
      {
        id: 'med_302',
        name: 'Ascorbic Acid (Vitamin C)',
        dosage: '500mg',
        unit: '1 tablet',
        period: 'Morning',
        time: '7:30 AM',
        instructions: 'Take concomitantly with iron supplement to enhance gastrointestinal absorption.',
        doctor: 'Dr. Lisa Wong',
        specialty: 'Hematology',
        startDate: '2026-02-10',
        endDate: '2026-11-30',
        rxNumber: 'RX-884103',
        refillsRemaining: 2,
        purpose: 'Iron Bioavailability Enhancer',
        taken: true,
        takenTime: '7:40 AM'
      },
      {
        id: 'med_303',
        name: 'Ibuprofen (Advil)',
        dosage: '400mg',
        unit: '1 tablet',
        period: 'Afternoon',
        time: '1:30 PM',
        instructions: 'Take with food only if post-physical-therapy swelling or discomfort occurs.',
        doctor: 'Dr. Emily Smith',
        specialty: 'Sports Medicine',
        startDate: '2026-06-15',
        endDate: 'As Needed',
        rxNumber: 'RX-331092',
        refillsRemaining: 3,
        purpose: 'Post-Rehab Anti-inflammatory (PRN)',
        taken: false,
        takenTime: ''
      },
      {
        id: 'med_304',
        name: 'Calcium Citrate + Vitamin D3',
        dosage: '600mg / 400 IU',
        unit: '1 caplet',
        period: 'Evening',
        time: '7:00 PM',
        instructions: 'Take with dinner. Keeps adequate separation from morning iron intake.',
        doctor: 'Dr. Lisa Wong',
        specialty: 'Hematology',
        startDate: '2026-03-01',
        endDate: 'Ongoing',
        rxNumber: 'RX-119842',
        refillsRemaining: 4,
        purpose: 'Bone Mineral Density & ACL Graft Support',
        taken: false,
        takenTime: ''
      }
      // Note: Night slot is intentionally empty to demonstrate clean empty-state handling!
    ],
    appointments: [
      {
        id: 'APT-3001',
        doctor: 'Dr. Emily Smith',
        specialty: 'Orthopedics & Sports Medicine',
        date: '2026-11-12',
        month: 'NOV',
        day: '12',
        time: '04:00 PM',
        department: 'Sports Performance & Rehabilitation Center - Pavilion B',
        status: 'Upcoming',
        visitType: 'Rehab Progression Test',
        reason: 'Post-ACL 16-Week Functional Recovery & Isokinetic Strength Assessment',
        notes: 'Wear athletic shorts and running shoes for treadmill gait analysis.',
        initials: 'ES'
      },
      {
        id: 'APT-3002',
        doctor: 'Dr. Lisa Wong',
        specialty: 'Hematology',
        date: '2026-10-02',
        month: 'OCT',
        day: '02',
        time: '10:30 AM',
        department: 'Clinical Hematology Diagnostics',
        status: 'Completed',
        visitType: 'Follow-up Lab Review',
        reason: 'Serum Ferritin & Iron Saturation Re-evaluation',
        notes: 'Ferritin increased from baseline 14 ng/mL to 38 ng/mL. Patient reports improved energy.',
        initials: 'LW'
      }
    ],
    reports: [
      {
        id: 'REP-301',
        category: 'Hematology',
        title: 'Complete Blood Count (CBC) with Ferritin & TIBC',
        date: 'Oct 02, 2026',
        doctor: 'Dr. Lisa Wong',
        initials: 'LW',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'Hemoglobin: 13.2 g/dL (Normal: 12.0-15.5), Ferritin: 38 ng/mL (Normal: 15-150), Transferrin Saturation: 28%. Anemia successfully resolved.'
      },
      {
        id: 'REP-302',
        category: 'MRI Imaging',
        title: 'Left Knee 3T MRI (Post-Operative ACL Review)',
        date: 'Aug 20, 2026',
        doctor: 'Dr. Michael Jones',
        initials: 'MJ',
        status: 'NORMAL',
        type: 'normal-report',
        summary: 'Reconstructed ACL graft is continuous and correctly oriented in the intercondylar notch. No tunnel widening, arthrofibrosis, or meniscal retear.'
      }
    ],
    notifications: [
      {
        id: 'notif_301',
        category: 'appointment',
        title: 'Rehab Assessment Scheduled',
        message: 'Post-ACL 16-Week functional test with Dr. Emily Smith on Nov 12 at 4:00 PM.',
        timestamp: '1 day ago',
        read: false,
        priority: 'high'
      },
      {
        id: 'notif_302',
        category: 'hospital',
        title: 'Physical Therapy Portal Update',
        message: 'Your home exercise guide for Phase 3 has been updated by the clinic.',
        timestamp: '4 days ago',
        read: true,
        priority: 'low'
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// CONFIGURED EMAIL RECIPIENTS (For 2–3 evaluation email addresses)
// ---------------------------------------------------------------------------
const DEFAULT_EMAIL_RECIPIENTS = [
  {
    id: 'rec_evaluator',
    name: 'College Faculty Evaluator',
    email: 'evaluator@university.edu',
    role: 'Course Instructor / Evaluator',
    description: 'Receives test evaluation reports and demo notification alerts',
    preferences: ['appointment_confirmation', 'appointment_reminder', 'medicine_schedule', 'health_summary'],
    active: true
  },
  {
    id: 'rec_student',
    name: 'Student Project Presenter',
    email: 'student.presenter@college.edu',
    role: 'Project Demonstrator',
    description: 'Receives live demonstration notifications during evaluation',
    preferences: ['appointment_confirmation', 'medicine_schedule', 'health_summary'],
    active: true
  },
  {
    id: 'rec_hospital_desk',
    name: 'Medix Clinical Records Desk',
    email: 'clinical.records@medix-hospital.org',
    role: 'Hospital Department Archive',
    description: 'Receives formal clinic appointment confirmations and audit logs',
    preferences: ['appointment_confirmation', 'appointment_reminder'],
    active: true
  }
];

// ---------------------------------------------------------------------------
// DATA STORE ACCESSORS & MUTATORS
// ---------------------------------------------------------------------------

/**
 * Get all patients from localStorage or initialize with defaults
 */
export function getAllPatients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
      return DEFAULT_PATIENTS;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
      return DEFAULT_PATIENTS;
    }

    // Auto-migrate legacy demo patient names if present in localStorage
    let needsUpdate = false;
    parsed = parsed.map(p => {
      if (p.id === 'MX-1001' && (p.name === 'Sarah Jenkins' || p.name === 'Kapir Patel' || !p.name)) {
        needsUpdate = true;
        return {
          ...p,
          name: 'Kabir Patel',
          gender: 'Male',
          email: 'kabir.patel@medix.com',
          bloodGroup: 'B+',
          emergencyContact: {
            name: 'Priya Patel',
            relationship: 'Spouse',
            phone: '+1 (555) 901-2345'
          }
        };
      }
      if (p.id === 'MX-1002' && (p.name === 'Marcus Vance' || !p.name)) {
        needsUpdate = true;
        return {
          ...p,
          name: 'Ananya Singh',
          gender: 'Female',
          email: 'ananya.singh@medix.com',
          bloodGroup: 'O+',
          emergencyContact: {
            name: 'Rohan Singh',
            relationship: 'Spouse',
            phone: '+1 (555) 432-1098'
          }
        };
      }
      if (p.id === 'MX-1003' && (p.name === 'Elena Rostova' || !p.name)) {
        needsUpdate = true;
        return {
          ...p,
          name: 'Rahul Mehta',
          gender: 'Male',
          email: 'rahul.mehta@medix.com',
          bloodGroup: 'AB+',
          emergencyContact: {
            name: 'Neha Mehta',
            relationship: 'Sister',
            phone: '+1 (555) 876-5432'
          }
        };
      }
      return p;
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(parsed));
    }

    return parsed;
  } catch (err) {
    console.error('Error loading patients from store:', err);
    return DEFAULT_PATIENTS;
  }
}

/**
 * Save all patients array to localStorage
 */
export function saveAllPatients(patients) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (err) {
    console.error('Error saving patients to store:', err);
  }
}

/**
 * Get a single patient by ID (e.g. 'MX-1001')
 */
export function getPatientById(id) {
  const patients = getAllPatients();
  return patients.find(p => p.id === id) || patients[0];
}

/**
 * Get a patient by email (used during login)
 */
export function getPatientByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const patients = getAllPatients();
  return patients.find(p => p.email.toLowerCase() === cleanEmail) || null;
}

/**
 * Update patient profile details
 */
export function updatePatient(patientId, updates) {
  const patients = getAllPatients();
  const index = patients.findIndex(p => p.id === patientId);
  if (index === -1) return null;

  patients[index] = {
    ...patients[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveAllPatients(patients);
  return patients[index];
}

/**
 * Toggle medication taken status for a patient and record timestamp
 */
export function toggleMedicationDose(patientId, medId, takenState) {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex === -1) return false;

  const patient = patients[patientIndex];
  const medIndex = patient.medications.findIndex(m => m.id === medId);
  if (medIndex === -1) return false;

  const targetMed = patient.medications[medIndex];
  const newTaken = typeof takenState === 'boolean' ? takenState : !targetMed.taken;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  patient.medications[medIndex] = {
    ...targetMed,
    taken: newTaken,
    takenTime: newTaken ? `TAKEN AT ${timeString}` : ''
  };

  saveAllPatients(patients);

  // Also log dose action to dose log history
  logDoseAction({
    patientId,
    patientName: patient.name,
    medicineId: medId,
    medicineName: targetMed.name,
    dosage: targetMed.dosage,
    status: newTaken ? 'TAKEN' : 'SKIPPED/UNCHECKED',
    timestamp: now.toISOString(),
    displayTime: timeString
  });

  return patient.medications[medIndex];
}

/**
 * Add a new medication for a patient
 */
export function addMedication(patientId, newMed) {
  const patients = getAllPatients();
  const index = patients.findIndex(p => p.id === patientId);
  if (index === -1) return null;

  const medWithId = {
    ...newMed,
    id: `med_${Date.now()}`,
    rxNumber: newMed.rxNumber || `RX-${Math.floor(100000 + Math.random() * 900000)}`,
    taken: false,
    takenTime: ''
  };

  patients[index].medications.push(medWithId);
  saveAllPatients(patients);
  return medWithId;
}

/**
 * Book a new appointment for a patient
 */
export function bookAppointment(patientId, appointmentData) {
  const patients = getAllPatients();
  const index = patients.findIndex(p => p.id === patientId);
  if (index === -1) return null;

  const appointmentDate = new Date(appointmentData.date);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const newAppointment = {
    id: `APT-${Date.now().toString().slice(-4)}`,
    doctor: appointmentData.doctor || 'Dr. Alan Smith',
    specialty: appointmentData.specialty || 'General Practice',
    date: appointmentData.date,
    month: months[appointmentDate.getMonth()] || 'NOV',
    day: String(appointmentDate.getDate()).padStart(2, '0'),
    time: appointmentData.time || '10:00 AM',
    department: appointmentData.department || 'Outpatient Clinic',
    visitType: appointmentData.visitType || 'In-Person Consultation',
    status: 'Upcoming',
    reason: appointmentData.reason || 'General Follow-up Visit',
    notes: appointmentData.notes || 'Routine consultation booked via Medix Patient Portal.',
    initials: (appointmentData.doctor || 'Dr. Alan').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  };

  patients[index].appointments.unshift(newAppointment);
  saveAllPatients(patients);
  return newAppointment;
}

/**
 * Reschedule an existing appointment
 */
export function rescheduleAppointment(patientId, appointmentId, newDateString, newTime) {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex === -1) return null;

  const patient = patients[patientIndex];
  const apptIndex = patient.appointments.findIndex(a => a.id === appointmentId);
  if (apptIndex === -1) return null;

  const d = new Date(newDateString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  patient.appointments[apptIndex] = {
    ...patient.appointments[apptIndex],
    date: newDateString,
    month: months[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    time: newTime || patient.appointments[apptIndex].time,
    status: 'Upcoming',
    notes: `${patient.appointments[apptIndex].notes || ''} [Rescheduled on ${new Date().toLocaleDateString()}]`
  };

  saveAllPatients(patients);
  return patient.appointments[apptIndex];
}

/**
 * Cancel an appointment
 */
export function cancelAppointment(patientId, appointmentId, reason = 'Cancelled by patient') {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex === -1) return null;

  const patient = patients[patientIndex];
  const apptIndex = patient.appointments.findIndex(a => a.id === appointmentId);
  if (apptIndex === -1) return null;

  patient.appointments[apptIndex] = {
    ...patient.appointments[apptIndex],
    status: 'Cancelled',
    notes: `${patient.appointments[apptIndex].notes || ''} [Cancelled: ${reason}]`
  };

  saveAllPatients(patients);
  return patient.appointments[apptIndex];
}

/**
 * Mark notification as read
 */
export function markNotificationRead(patientId, notifId) {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex === -1) return;

  const patient = patients[patientIndex];
  patient.notifications = (patient.notifications || []).map(n =>
    n.id === notifId ? { ...n, read: true } : n
  );

  saveAllPatients(patients);
}

/**
 * Mark all notifications as read for a patient
 */
export function markAllNotificationsRead(patientId) {
  const patients = getAllPatients();
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex === -1) return;

  const patient = patients[patientIndex];
  patient.notifications = (patient.notifications || []).map(n => ({ ...n, read: true }));

  saveAllPatients(patients);
}

// ---------------------------------------------------------------------------
// DOSE ACTION LOGS
// ---------------------------------------------------------------------------
export function getDoseLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logDoseAction(entry) {
  try {
    const logs = getDoseLogs();
    logs.unshift({
      id: `dose_${Date.now()}`,
      ...entry
    });
    localStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    console.error('Error logging dose action:', err);
  }
}

// ---------------------------------------------------------------------------
// EMAIL RECIPIENTS & AUDIT LOGS
// ---------------------------------------------------------------------------
export function getEmailRecipients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_RECIPIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EMAIL_RECIPIENTS, JSON.stringify(DEFAULT_EMAIL_RECIPIENTS));
      return DEFAULT_EMAIL_RECIPIENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_EMAIL_RECIPIENTS;
  } catch {
    return DEFAULT_EMAIL_RECIPIENTS;
  }
}

export function saveEmailRecipients(recipients) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL_RECIPIENTS, JSON.stringify(recipients));
  } catch (err) {
    console.error('Error saving email recipients:', err);
  }
}

export function updateEmailRecipient(id, updates) {
  const recipients = getEmailRecipients();
  const index = recipients.findIndex(r => r.id === id);
  if (index === -1) return null;

  recipients[index] = { ...recipients[index], ...updates };
  saveEmailRecipients(recipients);
  return recipients[index];
}

export function addEmailRecipient(recipient) {
  const recipients = getEmailRecipients();
  const newRec = {
    id: `rec_${Date.now()}`,
    active: true,
    preferences: ['appointment_confirmation', 'medicine_schedule', 'health_summary'],
    ...recipient
  };
  recipients.push(newRec);
  saveEmailRecipients(recipients);
  return newRec;
}

export function getEmailLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logEmailDelivery(logEntry) {
  try {
    const logs = getEmailLogs();
    const entry = {
      id: `EML-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleString(),
      status: 'Delivered',
      deliveryMode: 'Evaluation Outbox Log',
      ...logEntry
    };
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(logs.slice(0, 100)));
    return entry;
  } catch (err) {
    console.error('Error saving email log:', err);
    return null;
  }
}

/**
 * Reset all patient records and email settings to factory evaluation demo state
 */
export function resetToDemoDefaults() {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
  localStorage.setItem(STORAGE_KEYS.EMAIL_RECIPIENTS, JSON.stringify(DEFAULT_EMAIL_RECIPIENTS));
  localStorage.removeItem(STORAGE_KEYS.DOSE_LOGS);
  localStorage.removeItem(STORAGE_KEYS.EMAIL_LOGS);
  return DEFAULT_PATIENTS;
}
