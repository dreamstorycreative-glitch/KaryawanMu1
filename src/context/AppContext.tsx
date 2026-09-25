import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  User,
  Employee,
  Department,
  OfficeDesk,
  AttendanceRecord,
  LeaveRequest,
  PayrollPeriod,
  Payslip,
  FinanceTransaction,
  TaxRecord,
  TaskItem,
  AiWorker,
  DocumentItem,
  NotificationItem,
  SubscriptionPlan,
  SubscriptionInvoice,
  UserRole,
  TodayStatus,
  ForumChannel,
  ForumMessage,
  ForumIdeaCard,
} from '../types';
import {
  INITIAL_COMPANY,
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_AI_WORKERS,
  INITIAL_OFFICE_DESKS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL_PERIOD,
  INITIAL_PAYSLIPS,
  INITIAL_TRANSACTIONS,
  INITIAL_TAX_RECORDS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_INVOICES,
  INITIAL_FORUM_CHANNELS,
  INITIAL_FORUM_MESSAGES,
  ADMIN_WHATSAPP_NUMBER,
} from '../data/initialData';
import { askForumBrainstormWithAi } from '../services/geminiService';

export type AppTab =
  | 'dashboard'
  | 'officemap'
  | 'forum'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'finance'
  | 'tax'
  | 'tasks'
  | 'documents'
  | 'digitalteam'
  | 'aiworkspace'
  | 'reports'
  | 'settings'
  | 'superadmin';

interface AppContextType {
  // Navigation & View Mode
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;

  // Multi-tenant & Active User
  company: Company;
  updateCompany: (data: Partial<Company>) => void;
  currentUser: User;
  setCurrentRole: (role: UserRole) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  // Data Collections
  departments: Department[];
  employees: Employee[];
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  officeDesks: OfficeDesk[];
  updateDesk: (deskId: string, updates: Partial<OfficeDesk>) => void;
  assignEmployeeToDesk: (deskId: string, employeeId?: string) => void;
  addDesk: (desk: OfficeDesk) => void;
  deleteDesk: (deskId: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  todayEmployeeAttendance: AttendanceRecord | undefined;
  performAttendanceCheckIn: () => { success: boolean; message: string; inRadius: boolean };
  performAttendanceCheckOut: () => { success: boolean; message: string };
  performBreakStart: () => void;
  performBreakEnd: () => void;
  mockCurrentDistance: number;
  setMockCurrentDistance: (meters: number) => void;

  // Leave Management
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  approveLeaveRequest: (leaveId: string, byRole: 'manager' | 'hr') => void;
  rejectLeaveRequest: (leaveId: string, reason?: string) => void;

  // Payroll
  payrollPeriod: PayrollPeriod;
  payslips: Payslip[];
  processPayrollRun: () => void;
  releasePayrollToPaid: () => void;

  // Finance & OCR
  transactions: FinanceTransaction[];
  addTransaction: (trx: Omit<FinanceTransaction, 'id'>) => void;
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string) => void;

  // Tax Center
  taxRecords: TaxRecord[];
  toggleTaxChecklist: (taxId: string, checklistId: string) => void;

  // Task Management
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  updateTaskProgress: (taskId: string, current: number) => void;

  // AI Workers & Governance
  aiWorkers: AiWorker[];
  activeWorkerApprovals: { workerId: string; approval: any }[];
  resolveAiApproval: (workerId: string, approvalId: string, action: 'approve' | 'reject') => void;
  triggerAiWorkerTask: (workerCode: string, prompt: string) => Promise<string>;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Subscription & Billing
  subscriptionPlans: SubscriptionPlan[];
  updatePlanPricing: (planId: string, monthlyPrice: number, employeeLimit: number) => void;
  invoices: SubscriptionInvoice[];
  createSubscriptionInvoice: (planId: string) => SubscriptionInvoice;
  activateSubscriptionInvoice: (invoiceId: string) => void;
  adminWhatsApp: string;

  // Forum Chat & AI Ideation
  forumChannels: ForumChannel[];
  forumMessages: ForumMessage[];
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  aiCopilotEnabled: boolean;
  setAiCopilotEnabled: (enabled: boolean) => void;
  isAiResponding: boolean;
  addForumMessage: (content: string, options?: {
    ideaCard?: ForumIdeaCard;
    requestedAiRole?: string;
    replyToId?: string;
    replyToSnippet?: string;
    askAiNow?: boolean;
    generateIdeaCard?: boolean;
  }) => Promise<void>;
  toggleMessageReaction: (messageId: string, emoji: string) => void;
  voteForumIdea: (messageId: string) => void;
  convertIdeaToTask: (messageId: string) => void;
  createForumChannel: (channel: Omit<ForumChannel, 'id'>) => void;
  triggerAiBrainstormInChannel: (prompt: string, aiRole?: string, generateCard?: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Views & Routing State
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  // Tenant & User
  const [company, setCompany] = useState<Company>(INITIAL_COMPANY);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('owner');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Forum State
  const [forumChannels, setForumChannels] = useState<ForumChannel[]>(INITIAL_FORUM_CHANNELS);
  const [forumMessages, setForumMessages] = useState<ForumMessage[]>(INITIAL_FORUM_MESSAGES);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan_ide');
  const [aiCopilotEnabled, setAiCopilotEnabled] = useState<boolean>(true);
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);

  // Collections
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [officeDesks, setOfficeDesks] = useState<OfficeDesk[]>(INITIAL_OFFICE_DESKS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [payrollPeriod, setPayrollPeriod] = useState<PayrollPeriod>(INITIAL_PAYROLL_PERIOD);
  const [payslips, setPayslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>(INITIAL_TAX_RECORDS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [aiWorkers, setAiWorkers] = useState<AiWorker[]>(INITIAL_AI_WORKERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(INITIAL_INVOICES);

  // GPS Attendance Simulation
  const [mockCurrentDistance, setMockCurrentDistance] = useState<number>(35); // 35 meters within 100m radius

  // Mapping role to demo user profile
  const roleProfiles: Record<UserRole, User> = {
    owner: {
      id: 'usr_owner',
      name: 'Hendra Wijaya',
      email: 'hendra.wijaya@karyawanmu.co.id',
      role: 'owner',
      avatarUrl: '/src/assets/images/avatar_ceo_hendra_1790356913815.jpg',
      companyId: company.id,
      jobTitle: 'Chief Executive Officer (Owner)',
    },
    hr: {
      id: 'usr_hr',
      name: 'Maya Safitri',
      email: 'maya.safitri@karyawanmu.co.id',
      role: 'hr',
      avatarUrl: '/src/assets/images/avatar_hr_maya_1790356929294.jpg',
      companyId: company.id,
      jobTitle: 'Head of People & Culture (HRD)',
    },
    manager: {
      id: 'usr_mgr',
      name: 'Budi Santoso',
      email: 'budi.santoso@karyawanmu.co.id',
      role: 'manager',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      companyId: company.id,
      jobTitle: 'Engineering Manager',
    },
    finance: {
      id: 'usr_fin',
      name: 'Rina Kusuma',
      email: 'rina.kusuma@karyawanmu.co.id',
      role: 'finance',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      companyId: company.id,
      jobTitle: 'Finance & Accounting Lead',
    },
    tax: {
      id: 'usr_tax',
      name: 'Dimas Prasetyo',
      email: 'dimas.prasetyo@karyawanmu.co.id',
      role: 'tax',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      companyId: company.id,
      jobTitle: 'Tax Specialist',
    },
    employee: {
      id: 'usr_emp',
      name: 'Andi Pratama',
      email: 'andi.pratama@karyawanmu.co.id',
      role: 'employee',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      companyId: company.id,
      jobTitle: 'Senior Fullstack Engineer',
    },
    superadmin: {
      id: 'usr_sa',
      name: 'Super Admin KaryawanMu',
      email: 'root@karyawanmu.co.id',
      role: 'superadmin',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      companyId: 'global',
      jobTitle: 'Platform Super Administrator',
    },
  };

  const currentUser = roleProfiles[currentRole];

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'superadmin') {
      setCurrentTab('superadmin');
    } else if (currentTab === 'superadmin') {
      setCurrentTab('dashboard');
    }
  };

  const updateCompany = (data: Partial<Company>) => {
    setCompany((prev) => ({ ...prev, ...data }));
  };

  // Employee Handlers
  const addEmployee = (empData: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      employeeId: `KMU-${String(employees.length + 1).padStart(3, '0')}`,
      name: empData.name || 'Karyawan Baru',
      photo: empData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      email: empData.email || 'karyawan@karyawanmu.co.id',
      whatsapp: empData.whatsapp || '081200000000',
      jobTitle: empData.jobTitle || 'Staff',
      department: empData.department || 'Engineering & Tech',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      basicSalary: empData.basicSalary || 8000000,
      allowance: empData.allowance || 1500000,
      bankName: empData.bankName || 'BCA',
      accountNumber: empData.accountNumber || '8830000000',
      npwp: empData.npwp || '00.000.000.0-000.000',
      bpjsKesehatan: '000100000000',
      bpjsKetenagakerjaan: '19000000000',
      workingHours: '09:00 - 18:00 WIB',
      todayStatus: 'hadir',
      checkInTime: '08:50 WIB',
      leaveBalance: 12,
      ...empData,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    setCompany((prev) => ({ ...prev, employeeCount: prev.employeeCount + 1 }));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Office Desks
  const updateDesk = (deskId: string, updates: Partial<OfficeDesk>) => {
    setOfficeDesks((prev) => prev.map((d) => (d.id === deskId ? { ...d, ...updates } : d)));
  };

  const assignEmployeeToDesk = (deskId: string, employeeId?: string) => {
    setOfficeDesks((prev) =>
      prev.map((d) => (d.id === deskId ? { ...d, employeeId } : d))
    );
    if (employeeId) {
      updateEmployee(employeeId, { deskId });
    }
  };

  const addDesk = (desk: OfficeDesk) => {
    setOfficeDesks((prev) => [...prev, desk]);
  };

  const deleteDesk = (deskId: string) => {
    setOfficeDesks((prev) => prev.filter((d) => d.id !== deskId));
  };

  // Attendance
  const currentEmpId = currentUser.role === 'employee' ? 'emp_06' : 'emp_01';
  const todayEmployeeAttendance = attendanceRecords.find(
    (a) => a.employeeId === currentEmpId && a.date === new Date().toISOString().split('T')[0]
  );

  const performAttendanceCheckIn = () => {
    const inRadius = mockCurrentDistance <= company.officeCoordinates.radiusMeters;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const today = new Date().toISOString().split('T')[0];

    const isLate = new Date().getHours() >= 9 && new Date().getMinutes() > 15;
    const status: TodayStatus = inRadius ? (isLate ? 'terlambat' : 'hadir') : 'wfh';

    const record: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: currentEmpId,
      employeeName: currentUser.name,
      department: 'Engineering & Tech',
      date: today,
      checkIn: nowTime,
      status,
      distanceMeters: mockCurrentDistance,
      inOfficeRadius: inRadius,
      deviceInfo: 'Chrome macOS · IP 182.253.110.12',
    };

    setAttendanceRecords((prev) => [record, ...prev]);
    updateEmployee(currentEmpId, {
      todayStatus: status,
      checkInTime: nowTime,
    });

    // Notify AI HR
    setAiWorkers((prev) =>
      prev.map((w) =>
        w.code === 'ai_hr'
          ? {
              ...w,
              activityLogs: [
                {
                  id: `log_${Date.now()}`,
                  timestamp: nowTime,
                  action: `Absensi masuk: ${currentUser.name} (${status.toUpperCase()} · ${mockCurrentDistance}m)`,
                  status: inRadius ? 'success' : 'warning',
                },
                ...w.activityLogs.slice(0, 4),
              ],
            }
          : w
      )
    );

    return {
      success: true,
      message: inRadius
        ? `Presensi Berhasil: Anda berada dalam radius kantor (${mockCurrentDistance}m)`
        : `Presensi Terdeteksi di luar area kantor (${mockCurrentDistance}m). Dicatat sebagai WFH.`,
      inRadius,
    };
  };

  const performAttendanceCheckOut = () => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const today = new Date().toISOString().split('T')[0];

    setAttendanceRecords((prev) =>
      prev.map((a) => (a.employeeId === currentEmpId && a.date === today ? { ...a, checkOut: nowTime } : a))
    );
    updateEmployee(currentEmpId, { checkOutTime: nowTime });

    return { success: true, message: `Check-out berhasil dicatat pada ${nowTime}. Terima kasih atas kerja keras Anda hari ini!` };
  };

  const performBreakStart = () => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords((prev) =>
      prev.map((a) => (a.employeeId === currentEmpId && a.date === today ? { ...a, breakStart: nowTime } : a))
    );
  };

  const performBreakEnd = () => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords((prev) =>
      prev.map((a) => (a.employeeId === currentEmpId && a.date === today ? { ...a, breakEnd: nowTime } : a))
    );
  };

  // Leave Management
  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `leave_${Date.now()}`,
      appliedAt: new Date().toLocaleString('id-ID') + ' WIB',
      status: 'pending_manager',
    };
    setLeaveRequests((prev) => [newReq, ...prev]);

    // Send notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        type: 'leave',
        title: 'Pengajuan Cuti Baru',
        message: `${req.employeeName} mengajukan ${req.leaveType} selama ${req.daysCount} hari.`,
        time: 'Baru saja',
        read: false,
        linkTab: 'leave',
      },
      ...prev,
    ]);
  };

  const approveLeaveRequest = (leaveId: string, byRole: 'manager' | 'hr') => {
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.id !== leaveId) return l;
        if (byRole === 'manager') {
          return {
            ...l,
            status: 'pending_hr',
            managerApproval: {
              approved: true,
              by: currentUser.name,
              at: new Date().toLocaleString('id-ID') + ' WIB',
            },
          };
        } else {
          // HR approval: deduct leave quota!
          const targetEmp = employees.find((e) => e.id === l.employeeId);
          if (targetEmp) {
            updateEmployee(l.employeeId, {
              leaveBalance: Math.max(0, targetEmp.leaveBalance - l.daysCount),
            });
          }
          return {
            ...l,
            status: 'approved',
            hrApproval: {
              approved: true,
              by: currentUser.name,
              at: new Date().toLocaleString('id-ID') + ' WIB',
            },
          };
        }
      })
    );
  };

  const rejectLeaveRequest = (leaveId: string, reason?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: 'rejected' } : l))
    );
  };

  // Payroll
  const processPayrollRun = () => {
    setPayrollPeriod((prev) => ({
      ...prev,
      status: 'completed',
      processedDate: new Date().toISOString().split('T')[0],
    }));
  };

  const releasePayrollToPaid = () => {
    setPayrollPeriod((prev) => ({ ...prev, status: 'paid' }));
    setPayslips((prev) => prev.map((p) => ({ ...p, status: 'paid' })));
  };

  // Finance
  const addTransaction = (trx: Omit<FinanceTransaction, 'id'>) => {
    const newTrx: FinanceTransaction = {
      ...trx,
      id: `trx_${Date.now()}`,
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const approveTransaction = (id: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'approved' } : t)));
  };

  const rejectTransaction = (id: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'rejected' } : t)));
  };

  // Tax Checklist
  const toggleTaxChecklist = (taxId: string, checklistId: string) => {
    setTaxRecords((prev) =>
      prev.map((t) =>
        t.id === taxId
          ? {
              ...t,
              checklist: t.checklist.map((c) => (c.id === checklistId ? { ...c, checked: !c.checked } : c)),
            }
          : t
      )
    );
  };

  // Task Management
  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskItem['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const updateTaskProgress = (taskId: string, current: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, progressCurrent: current } : t))
    );
  };

  // AI Workers & Governance
  const activeWorkerApprovals = aiWorkers.flatMap((w) =>
    w.pendingApprovals.map((appr) => ({ workerId: w.id, approval: appr }))
  );

  const resolveAiApproval = (workerId: string, approvalId: string, action: 'approve' | 'reject') => {
    setAiWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          pendingApprovals: w.pendingApprovals.filter((a) => a.id !== approvalId),
          activityLogs: [
            {
              id: `log_${Date.now()}`,
              timestamp: 'Sekarang',
              action: `Human ${action.toUpperCase()} pada tugas #${approvalId}`,
              status: action === 'approve' ? 'success' : 'warning',
            },
            ...w.activityLogs,
          ],
        };
      })
    );
  };

  const triggerAiWorkerTask = async (workerCode: string, prompt: string): Promise<string> => {
    const target = aiWorkers.find((w) => w.code === workerCode);
    if (!target) return 'Worker tidak ditemukan';

    // Simulate worker actively working
    setAiWorkers((prev) =>
      prev.map((w) =>
        w.code === workerCode
          ? {
              ...w,
              status: 'processing',
              activeJob: prompt,
              activeTasksCount: w.activeTasksCount + 1,
            }
          : w
      )
    );

    return `Tugas "${prompt}" berhasil dialokasikan ke ${target.name}.`;
  };

  // Documents
  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc_${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Subscriptions & Super Admin
  const updatePlanPricing = (planId: string, monthlyPrice: number, employeeLimit: number) => {
    setSubscriptionPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, monthlyPrice, employeeLimit } : p))
    );
  };

  const createSubscriptionInvoice = (planId: string): SubscriptionInvoice => {
    const plan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[1];
    const invoiceNum = `#KMU-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: SubscriptionInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNum,
      companyName: company.name,
      planId: plan.id,
      planName: `Paket ${plan.name} (Bulanan)`,
      amount: plan.monthlyPrice,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'pending_payment',
      paymentMethod: 'whatsapp_manual',
      adminWhatsApp: ADMIN_WHATSAPP_NUMBER,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const activateSubscriptionInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'active' } : inv))
    );
    setCompany((prev) => ({ ...prev, subscriptionStatus: 'active' }));
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        type: 'invoice',
        title: 'Paket Langganan Diaktifkan!',
        message: 'Super Admin telah memverifikasi pembayaran Anda. Seluruh fitur paket kini aktif.',
        time: 'Baru saja',
        read: false,
      },
      ...prev,
    ]);
  };

  // Forum Chat & AI Brainstorming Handlers
  const addForumMessage = async (
    content: string,
    options?: {
      ideaCard?: ForumIdeaCard;
      requestedAiRole?: string;
      replyToId?: string;
      replyToSnippet?: string;
      askAiNow?: boolean;
      generateIdeaCard?: boolean;
    }
  ) => {
    const activeChan = forumChannels.find((c) => c.id === activeChannelId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ForumMessage = {
      id: `msg_${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      senderJobTitle: currentUser.jobTitle,
      isAi: false,
      content,
      timestamp: timeStr,
      replyToId: options?.replyToId,
      replyToSnippet: options?.replyToSnippet,
      reactions: [],
      ideaCard: options?.ideaCard,
      isIdeaPrompt: options?.askAiNow,
    };

    setForumMessages((prev) => [...prev, userMsg]);

    // Check if AI should respond
    const lowerContent = content.toLowerCase();
    const mentionsAi =
      lowerContent.includes('@ai') ||
      lowerContent.includes('@ai worker') ||
      lowerContent.includes('@ai office') ||
      lowerContent.includes('@ai hr') ||
      lowerContent.includes('@ai finance');

    const shouldTriggerAi =
      options?.askAiNow ||
      mentionsAi ||
      (aiCopilotEnabled &&
        (lowerContent.includes('ide') ||
          lowerContent.includes('gagasan') ||
          lowerContent.includes('usul') ||
          lowerContent.includes('brainstorm') ||
          lowerContent.includes('bagaimana pendapat') ||
          lowerContent.includes('minta rekomendasi') ||
          lowerContent.includes('solusi')));

    if (shouldTriggerAi) {
      setIsAiResponding(true);

      // Determine appropriate AI role
      let roleCode = options?.requestedAiRole || 'ai_office';
      if (lowerContent.includes('@ai hr') || lowerContent.includes('hr') || lowerContent.includes('cuti') || lowerContent.includes('karyawan')) {
        roleCode = 'ai_hr';
      } else if (lowerContent.includes('@ai finance') || lowerContent.includes('finance') || lowerContent.includes('biaya') || lowerContent.includes('reimburse')) {
        roleCode = 'ai_finance';
      } else if (lowerContent.includes('@ai tax') || lowerContent.includes('pajak')) {
        roleCode = 'ai_tax';
      }

      try {
        const history = forumMessages
          .filter((m) => m.channelId === activeChannelId)
          .slice(-6)
          .map((m) => ({ senderName: m.senderName, content: m.content }));

        const aiResult = await askForumBrainstormWithAi({
          channelName: activeChan?.name || 'forum',
          userPrompt: content,
          messagesHistory: history,
          requestedAiRole: roleCode,
          generateIdeaCard: options?.generateIdeaCard || lowerContent.includes('ide') || lowerContent.includes('gagasan'),
        });

        const aiMsg: ForumMessage = {
          id: `msg_ai_${Date.now()}`,
          channelId: activeChannelId,
          senderId: roleCode,
          senderName: aiResult.senderName || 'AI Office Assistant',
          senderRole: 'ai_worker',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
          senderJobTitle: aiResult.senderJobTitle || 'Digital Team • Ideation & Productivity',
          isAi: true,
          aiWorkerCode: roleCode,
          content: aiResult.response,
          timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
          replyToId: userMsg.id,
          replyToSnippet: content.slice(0, 60),
          reactions: [
            { emoji: '💡', count: 1, userIds: [currentUser.id] },
          ],
          ideaCard: aiResult.ideaCard
            ? {
                title: aiResult.ideaCard.title,
                category: aiResult.ideaCard.category,
                summary: aiResult.ideaCard.summary,
                keyPoints: aiResult.ideaCard.keyPoints || [],
                votes: 1,
                votedUserIds: [currentUser.id],
                status: 'draft',
              }
            : undefined,
        };

        setForumMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('Error in forum AI flow:', err);
      } finally {
        setIsAiResponding(false);
      }
    }
  };

  const toggleMessageReaction = (messageId: string, emoji: string) => {
    setForumMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existingRx = msg.reactions.find((r) => r.emoji === emoji);
        let updatedReactions = [...msg.reactions];

        if (existingRx) {
          const userVoted = existingRx.userIds.includes(currentUser.id);
          if (userVoted) {
            const nextUsers = existingRx.userIds.filter((id) => id !== currentUser.id);
            if (nextUsers.length === 0) {
              updatedReactions = updatedReactions.filter((r) => r.emoji !== emoji);
            } else {
              updatedReactions = updatedReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: nextUsers.length, userIds: nextUsers } : r
              );
            }
          } else {
            updatedReactions = updatedReactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, userIds: [...r.userIds, currentUser.id] }
                : r
            );
          }
        } else {
          updatedReactions.push({
            emoji,
            count: 1,
            userIds: [currentUser.id],
          });
        }
        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  const voteForumIdea = (messageId: string) => {
    setForumMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.ideaCard) return msg;
        const hasVoted = msg.ideaCard.votedUserIds.includes(currentUser.id);
        const nextVotedUserIds = hasVoted
          ? msg.ideaCard.votedUserIds.filter((uid) => uid !== currentUser.id)
          : [...msg.ideaCard.votedUserIds, currentUser.id];

        return {
          ...msg,
          ideaCard: {
            ...msg.ideaCard,
            votes: nextVotedUserIds.length,
            votedUserIds: nextVotedUserIds,
          },
        };
      })
    );
  };

  const convertIdeaToTask = (messageId: string) => {
    const targetMsg = forumMessages.find((m) => m.id === messageId);
    if (!targetMsg || !targetMsg.ideaCard) return;

    const taskId = `task_idea_${Date.now()}`;
    const newTask: TaskItem = {
      id: taskId,
      title: `[Inisiatif Tim] ${targetMsg.ideaCard.title}`,
      description: `${targetMsg.ideaCard.summary}\n\nPoin Kunci:\n${targetMsg.ideaCard.keyPoints.map((k) => `• ${k}`).join('\n')}`,
      assigneeType: 'ai',
      assigneeId: 'ai_office',
      assigneeName: 'AI Office Assistant',
      department: 'Executive & Direksi',
      priority: 'high',
      dueDate: '2026-10-15',
      status: 'todo',
      requiresHumanApproval: true,
      approvalStatus: 'none',
    };

    setTasks((prev) => [newTask, ...prev]);

    // Update message card status
    setForumMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.ideaCard
          ? {
              ...m,
              ideaCard: {
                ...m.ideaCard,
                status: 'accepted',
                convertedToTaskId: taskId,
              },
            }
          : m
      )
    );

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        type: 'ai_approval',
        title: 'Gagasan Forum Diadopsi Jadi Tugas Tim!',
        message: `Ide "${targetMsg.ideaCard?.title}" telah otomatis dikonversi menjadi task di menu Task Management.`,
        time: 'Baru saja',
        read: false,
        linkTab: 'tasks',
      },
      ...prev,
    ]);
  };

  const createForumChannel = (channel: Omit<ForumChannel, 'id'>) => {
    const newChan: ForumChannel = {
      ...channel,
      id: `chan_${Date.now()}`,
    };
    setForumChannels((prev) => [...prev, newChan]);
    setActiveChannelId(newChan.id);
  };

  const triggerAiBrainstormInChannel = async (prompt: string, aiRole?: string, generateCard?: boolean) => {
    await addForumMessage(prompt, {
      askAiNow: true,
      requestedAiRole: aiRole || 'ai_office',
      generateIdeaCard: generateCard ?? true,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        showLanding,
        setShowLanding,
        showAuthModal,
        setShowAuthModal,
        showOnboarding,
        setShowOnboarding,
        showSubscriptionModal,
        setShowSubscriptionModal,

        company,
        updateCompany,
        currentUser,
        setCurrentRole,
        selectedEmployee,
        setSelectedEmployee,

        departments,
        employees,
        addEmployee,
        updateEmployee,

        officeDesks,
        updateDesk,
        assignEmployeeToDesk,
        addDesk,
        deleteDesk,

        attendanceRecords,
        todayEmployeeAttendance,
        performAttendanceCheckIn,
        performAttendanceCheckOut,
        performBreakStart,
        performBreakEnd,
        mockCurrentDistance,
        setMockCurrentDistance,

        leaveRequests,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,

        payrollPeriod,
        payslips,
        processPayrollRun,
        releasePayrollToPaid,

        transactions,
        addTransaction,
        approveTransaction,
        rejectTransaction,

        taxRecords,
        toggleTaxChecklist,

        tasks,
        addTask,
        updateTaskStatus,
        updateTaskProgress,

        aiWorkers,
        activeWorkerApprovals,
        resolveAiApproval,
        triggerAiWorkerTask,

        documents,
        addDocument,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        subscriptionPlans,
        updatePlanPricing,
        invoices,
        createSubscriptionInvoice,
        activateSubscriptionInvoice,
        adminWhatsApp: ADMIN_WHATSAPP_NUMBER,

        // Forum Chat & AI Ideation
        forumChannels,
        forumMessages,
        activeChannelId,
        setActiveChannelId,
        aiCopilotEnabled,
        setAiCopilotEnabled,
        isAiResponding,
        addForumMessage,
        toggleMessageReaction,
        voteForumIdea,
        convertIdeaToTask,
        createForumChannel,
        triggerAiBrainstormInChannel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
