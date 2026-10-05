import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  Employee,
  Evaluation,
  SystemSettings,
  AuditLog,
  EvaluationQuarter,
} from '../types';
import { StorageService } from '../services/storageService';
import { AuditService } from '../services/auditService';
import { useAuth } from './AuthContext';
import { logActivity } from '../utils/auditLogger';
import { 
  INITIAL_COMMON_KPIS, 
  INITIAL_DEPARTMENT_KPIS, 
  INITIAL_LEADERSHIP_KPIS,
  INITIAL_SYSTEM_SETTINGS 
} from '../config/initialData';
export interface DataContextType {
  departments: Department[];
  employees: Employee[];
  settings: SystemSettings;
  evaluations: Evaluation[];
  auditLogs: AuditLog[];
  selectedQuarter: EvaluationQuarter;
  selectedYear: number;
  setSelectedQuarter: (q: EvaluationQuarter) => void;
  setSelectedYear: (y: number) => void;
  saveEvaluation: (evaluation: Evaluation) => Promise<Evaluation>;
  acknowledgeEvaluation: (evaluationId: string, notes?: string) => Promise<void>;
  saveSettings: (settings: SystemSettings) => Promise<void>;
  saveEmployee: (emp: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  saveDepartments: (depts: Department[]) => Promise<void>;
  refreshData: () => void;
  exportBackup: () => string;
  restoreBackup: (jsonStr: string) => { success: boolean; message: string };
  importEmployeesCSV: (csv: string) => { importedCount: number; errors: string[] };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(() => StorageService.getSettings());
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [selectedQuarter, setSelectedQuarter] = useState<EvaluationQuarter>(
    settings?.activeQuarter || 'Q3'
  );
  const [selectedYear, setSelectedYear] = useState<number>(settings?.activeYear || 2026);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  const refreshData = () => {
    setDepartments(StorageService.getDepartments());
    setEmployees(StorageService.getEmployees());
    const rawSettings = StorageService.getSettings();
    const s: SystemSettings = { 
      ...INITIAL_SYSTEM_SETTINGS, 
      ...rawSettings,
      commonKPIs: rawSettings.commonKPIs || INITIAL_SYSTEM_SETTINGS.commonKPIs,
      departmentKPIs: rawSettings.departmentKPIs || INITIAL_SYSTEM_SETTINGS.departmentKPIs,
      leadershipKPIs: rawSettings.leadershipKPIs || INITIAL_SYSTEM_SETTINGS.leadershipKPIs,
      headTechManagementKPIs: rawSettings.headTechManagementKPIs || INITIAL_SYSTEM_SETTINGS.headTechManagementKPIs,
      classifications: rawSettings.classifications || INITIAL_SYSTEM_SETTINGS.classifications,
      levelExpectations: rawSettings.levelExpectations || INITIAL_SYSTEM_SETTINGS.levelExpectations
    };
    
    // Auto-migrate Arabic common KPIs to English
    let needsSave = false;
    s.commonKPIs = s.commonKPIs.map(kpi => {
      const initKpi = INITIAL_COMMON_KPIS.find(c => c.id === kpi.id);
      if (initKpi && kpi.name !== initKpi.name) {
        needsSave = true;
        return { ...kpi, name: initKpi.name, description: initKpi.description, scoringGuide: initKpi.scoringGuide };
      }
      return kpi;
    });
    if (needsSave) {
      StorageService.saveSettings(s, 'system', 'System', 'ADMIN');
    }
    
    setSettings(s);
    setEvaluations(StorageService.getEvaluations());
    setAuditLogs(AuditService.getLogs());
  };

  useEffect(() => {
    const initApp = async () => {
      StorageService.initialize();
      await StorageService.syncWithSupabase();
      refreshData();
      setIsSyncing(false);
    };
    initApp();
  }, []);

  const saveEvaluation = async (evaluation: Evaluation): Promise<Evaluation> => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';
    const actorEmail = currentUser?.email || '';

    // Pass email so Supabase gets correct evaluator_email
    const saved = await StorageService.saveEvaluation(evaluation, actorId, actorName, actorRole, actorEmail);
    
    // Log activity to audit_logs table
    logActivity({
      userRole: actorRole,
      userEmail: actorEmail || actorName,
      actionType: 'EVALUATE_EMPLOYEE',
      details: `Evaluated employee ${evaluation.employeeId} in ${evaluation.quarter} ${evaluation.year}`
    });

    refreshData();
    return saved;
  };

  const acknowledgeEvaluation = async (evaluationId: string, notes?: string) => {
    if (!currentUser) return;
    await StorageService.acknowledgeEvaluation(evaluationId, currentUser.id, currentUser.name, notes);
    
    logActivity({
      userRole: currentUser.systemRole,
      userEmail: currentUser.email,
      actionType: 'ACKNOWLEDGE_EVALUATION',
      details: `Acknowledged evaluation ${evaluationId}`
    });

    refreshData();
  };

  const saveSettings = async (newSettings: SystemSettings) => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';

    await StorageService.saveSettings(newSettings, actorId, actorName, actorRole);
    
    logActivity({
      userRole: actorRole,
      userEmail: currentUser?.email || actorName,
      actionType: 'UPDATE_SETTINGS',
      details: `Updated system settings`
    });

    refreshData();
  };

  const saveEmployee = async (emp: Employee) => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';

    await StorageService.saveEmployee(emp, actorId, actorName, actorRole);
    
    // Log to Supabase
    logActivity({
      userRole: actorRole,
      userEmail: currentUser?.email || actorName,
      actionType: 'SAVE_EMPLOYEE',
      details: `Saved/Updated employee: ${emp.name} (${emp.email})`
    });

    refreshData();
  };

  const deleteEmployee = async (id: string) => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';

    const empName = employees.find(e => e.id === id)?.name || id;

    await StorageService.deleteEmployee(id, actorId, actorName, actorRole);
    
    // Log to Supabase
    logActivity({
      userRole: actorRole,
      userEmail: currentUser?.email || actorName,
      actionType: 'DELETE_EMPLOYEE',
      details: `Deleted employee: ${empName}`
    });

    refreshData();
  };

  const saveDepartments = async (depts: Department[]) => {
    StorageService.saveDepartments(depts);
    refreshData();
  };

  const exportBackup = () => {
    return StorageService.exportFullBackup();
  };

  const restoreBackup = (jsonStr: string) => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';

    const res = StorageService.restoreBackup(jsonStr, actorId, actorName, actorRole);
    refreshData();
    return res;
  };

  const importEmployeesCSV = (csv: string) => {
    const actorId = currentUser?.id || 'system';
    const actorName = currentUser?.name || 'System User';
    const actorRole = currentUser?.systemRole || 'ADMIN';

    const res = StorageService.importEmployeesFromCSV(csv, actorId, actorName, actorRole);
    refreshData();
    return res;
  };

  if (isSyncing) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
        <p className="mt-4 text-sm font-semibold text-teal-400 tracking-widest uppercase">Syncing Cloud Data...</p>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        departments,
        employees,
        settings,
        evaluations,
        auditLogs,
        selectedQuarter,
        selectedYear,
        setSelectedQuarter,
        setSelectedYear,
        saveEvaluation,
        acknowledgeEvaluation,
        saveSettings,
        saveEmployee,
        deleteEmployee,
        saveDepartments,
        refreshData,
        exportBackup,
        restoreBackup,
        importEmployeesCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
