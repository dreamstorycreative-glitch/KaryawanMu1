export type UserRole = 'owner' | 'hr' | 'manager' | 'finance' | 'tax' | 'employee' | 'superadmin';

export type TodayStatus = 'hadir' | 'wfh' | 'cuti' | 'tidak_hadir' | 'meeting' | 'terlambat';

export interface Company {
  id: string;
  name: string;
  picName: string;
  email: string;
  whatsapp: string;
  address: string;
  employeeCount: number;
  industry: string;
  planId: string;
  subscriptionStatus: 'active' | 'trial' | 'pending_payment' | 'expired';
  createdAt: string;
  logoUrl?: string;
  officeCoordinates: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  companyId: string;
  departmentId?: string;
  jobTitle: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  photo: string;
  email: string;
  whatsapp: string;
  jobTitle: string;
  department: string;
  managerId?: string;
  status: 'active' | 'probation' | 'resigned';
  joinedDate: string;
  basicSalary: number;
  allowance: number;
  bankName: string;
  accountNumber: string;
  npwp: string;
  bpjsKesehatan: string;
  bpjsKetenagakerjaan: string;
  deskId?: string;
  workingHours: string;
  todayStatus: TodayStatus;
  checkInTime?: string;
  checkOutTime?: string;
  leaveBalance: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  leadName: string;
  employeeCount: number;
  color: string;
}

export interface OfficeDesk {
  id: string;
  code: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'desk' | 'meeting_room' | 'director_room' | 'hr_room' | 'finance_room' | 'pantry' | 'toilet' | 'door' | 'printer' | 'lounge';
  employeeId?: string;
  department?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  status: TodayStatus;
  distanceMeters: number;
  inOfficeRadius: boolean;
  deviceInfo: string;
  photoUrl?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Cuti Tahunan' | 'Cuti Sakit' | 'Cuti Melahirkan' | 'Cuti Khusus' | 'Izin';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  attachmentName?: string;
  status: 'pending_manager' | 'pending_hr' | 'approved' | 'rejected';
  appliedAt: string;
  managerApproval?: {
    approved: boolean;
    by: string;
    at: string;
    notes?: string;
  };
  hrApproval?: {
    approved: boolean;
    by: string;
    at: string;
    notes?: string;
  };
}

export interface PayrollPeriod {
  id: string;
  monthName: string;
  year: number;
  status: 'draft' | 'processing' | 'completed' | 'paid';
  totalGross: number;
  totalDeduction: number;
  totalTax: number;
  totalNet: number;
  employeeCount: number;
  processedDate?: string;
}

export interface Payslip {
  id: string;
  periodId: string;
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  bankName: string;
  accountNumber: string;
  basicSalary: number;
  allowance: number;
  bonus: number;
  overtime: number;
  deductionLate: number;
  deductionAbsence: number;
  bpjsKesehatanDeduction: number;
  bpjsTkDeduction: number;
  taxPPh21: number;
  grossSalary: number;
  totalDeduction: number;
  netSalary: number;
  status: 'draft' | 'sent' | 'paid';
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  vendor: string;
  amount: number;
  description: string;
  status: 'draft' | 'approved' | 'rejected';
  receiptUrl?: string;
  ocrConfidence?: number;
  isAiGenerated?: boolean;
  account: 'BCA Operasional' | 'Mandiri Payroll' | 'Kas Kecil';
}

export interface TaxRecord {
  id: string;
  taxType: 'PPh 21' | 'PPh Badan' | 'PPN';
  period: string;
  deadline: string;
  amount: number;
  status: 'draft' | 'ready_for_review' | 'reported' | 'overdue';
  payrollRefId?: string;
  checklist: { id: string; label: string; checked: boolean }[];
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigneeType: 'human' | 'ai';
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  progressTotal?: number;
  progressCurrent?: number;
  requiresHumanApproval?: boolean;
  approvalStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  actionPayload?: any;
}

export interface AiWorker {
  id: string;
  name: string;
  code: 'ai_hr' | 'ai_finance' | 'ai_payroll' | 'ai_tax' | 'ai_document' | 'ai_office';
  roleTitle: string;
  status: 'online' | 'processing' | 'ready' | 'monitoring';
  activeJob: string;
  activeTasksCount: number;
  completedTasksCount: number;
  iconName: string;
  progressPercent: number;
  capabilities: string[];
  activityLogs: {
    id: string;
    timestamp: string;
    action: string;
    status: 'info' | 'success' | 'warning';
  }[];
  pendingApprovals: {
    id: string;
    title: string;
    detail: string;
    timestamp: string;
    actionType: string;
    payload?: any;
  }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'hr' | 'finance' | 'tax' | 'employee' | 'company' | 'contract' | 'invoice' | 'receipt';
  fileType: 'pdf' | 'xlsx' | 'docx' | 'image';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  tags: string[];
  aiSummary: string;
}

export interface NotificationItem {
  id: string;
  type: 'checkin' | 'leave' | 'payroll' | 'invoice' | 'tax' | 'ai_approval' | 'document';
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkTab?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  employeeLimit: number;
  storageLimitGb: number;
  aiWorkersCount: number;
  aiDocLimit: number;
  popular?: boolean;
  features: string[];
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  companyName: string;
  planId: string;
  planName: string;
  amount: number;
  issueDate: string;
  status: 'pending_payment' | 'verification' | 'approved' | 'active' | 'rejected' | 'expired';
  paymentMethod: 'whatsapp_manual';
  adminWhatsApp: string;
}

export interface ForumChannel {
  id: string;
  name: string;
  topic: string;
  description: string;
  category: 'ide' | 'pengumuman' | 'proyek' | 'santai' | 'tanya_jawab';
  icon: string;
  unreadCount?: number;
  isAiEnabledDefault?: boolean;
}

export interface ForumIdeaCard {
  title: string;
  category: string;
  summary: string;
  keyPoints: string[];
  votes: number;
  votedUserIds: string[];
  status: 'draft' | 'under_review' | 'accepted' | 'implemented';
  convertedToTaskId?: string;
}

export interface ForumMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'ai_worker';
  senderAvatar: string;
  senderJobTitle: string;
  isAi: boolean;
  aiWorkerCode?: string;
  content: string;
  timestamp: string;
  replyToId?: string;
  replyToSnippet?: string;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  ideaCard?: ForumIdeaCard;
  isIdeaPrompt?: boolean;
}
