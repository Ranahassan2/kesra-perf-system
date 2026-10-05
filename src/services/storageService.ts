import {
  Department,
  Employee,
  Evaluation,
  SystemSettings,
  AuditLog,
  EvaluationStatus
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_EVALUATIONS
} from '../config/initialData';
import { AuditService } from './auditService';
import { CalculationEngine } from './calculationEngine';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  DEPARTMENTS: 'pes_departments_v8',
  EMPLOYEES: 'pes_employees_v8',
  SETTINGS: 'pes_settings_v8',
  EVALUATIONS: 'pes_evaluations_v8',
  INITIALIZED: 'pes_initialized_v8',
};

export class StorageService {
  // Pull EVERYTHING from Supabase and cache it in localStorage
  public static async syncWithSupabase(): Promise<void> {
    try {
      console.log('🔄 Syncing with Supabase...');
      
      // 1. Sync Settings
      const { data: settingsData, error: setErr } = await supabase.from('settings').select('*').limit(1);
      if (settingsData && settingsData.length > 0) {
        const dbSettings = settingsData[0];
        const parsedSettings: SystemSettings = {
          ...INITIAL_SYSTEM_SETTINGS,
          id: dbSettings.id,
          activeVersion: dbSettings.active_version,
          commonSkillsPercent: dbSettings.common_skills_percent,
          deptKpiPercent: dbSettings.dept_kpi_percent,
          tlLeadershipPercent: dbSettings.tl_leadership_percent,
          headTechManagementPercent: dbSettings.head_tech_management_percent,
          minEmploymentMonths: dbSettings.min_employment_months,
          commonKPIs: dbSettings.common_kpis,
          departmentKPIs: dbSettings.department_kpis,
          leadershipKPIs: dbSettings.leadership_kpis,
          headTechManagementKPIs: dbSettings.head_tech_management_kpis,
          classifications: dbSettings.classifications,
          levelExpectations: dbSettings.level_expectations
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsedSettings));
      } else {
        // Init Supabase settings if empty
        const s = INITIAL_SYSTEM_SETTINGS;
        await supabase.from('settings').insert([{
          id: s.id,
          active_version: s.activeVersion,
          common_skills_percent: s.commonSkillsPercent,
          dept_kpi_percent: s.deptKpiPercent,
          tl_leadership_percent: s.tlLeadershipPercent,
          head_tech_management_percent: s.headTechManagementPercent,
          min_employment_months: s.minEmploymentMonths,
          common_kpis: s.commonKPIs,
          department_kpis: s.departmentKPIs,
          leadership_kpis: s.leadershipKPIs,
          head_tech_management_kpis: s.headTechManagementKPIs,
          classifications: s.classifications,
          level_expectations: s.levelExpectations
        }]);
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));
      }

      // 2. Sync Departments
      const { data: deptData } = await supabase.from('departments').select('*');
      if (deptData && deptData.length > 0) {
        const depts: Department[] = deptData.map(d => ({ 
          id: d.id, 
          name: d.name,
          code: d.id,
          description: d.name,
          isActive: true
        }));
        localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
      } else {
        const depts = INITIAL_DEPARTMENTS;
        await supabase.from('departments').insert(depts.map(d => ({ id: d.id, name: d.name })));
        localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
      }

      // 3. Sync Employees
      const { data: empData } = await supabase.from('employees').select('*');
      if (empData && empData.length > 0) {
        const emps: Employee[] = empData.map(e => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone,
          departmentId: e.department_id,
          departmentName: deptData?.find(d => d.id === e.department_id)?.name || '',
          level: e.level,
          role: e.system_role === 'TEAM_LEADER' ? 'Team Leader' : 'Employee',
          systemRole: e.system_role,
          startDate: e.start_date,
          isActive: true,
          createdAt: e.created_at || new Date().toISOString(),
          updatedAt: e.updated_at || new Date().toISOString()
        }));
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(emps));
      } else {
        const emps = INITIAL_EMPLOYEES;
        await supabase.from('employees').insert(emps.map(e => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone,
          department_id: e.departmentId,
          level: e.level,
          system_role: e.systemRole,
          start_date: e.startDate
        })));
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(emps));
      }

      // 4. Sync Evaluations
      const { data: evalData } = await supabase.from('evaluations').select('*');
      if (evalData && evalData.length > 0) {
        const evals: Evaluation[] = evalData.map(e => JSON.parse(e.details));
        localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evals));
      }

      console.log('✅ Supabase Sync Complete!');
    } catch (err) {
      console.error('Failed to sync with Supabase', err);
    }
  }

  public static initialize(): void {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SYSTEM_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(INITIAL_EVALUATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // --- DEPARTMENTS ---
  public static getDepartments(): Department[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  }

  public static saveDepartments(depts: Department[]): void {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
  }

  // --- EMPLOYEES ---
  public static getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  public static async saveEmployee(employee: Employee, actorId: string, actorName: string, actorRole: any): Promise<void> {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    let prev: Employee | undefined;

    if (index >= 0) {
      prev = employees[index];
      employees[index] = { ...employee, updatedAt: new Date().toISOString() };
      
      // Supabase Update
      await supabase.from('employees').update({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department_id: employee.departmentId,
        level: employee.level,
        system_role: employee.systemRole,
        start_date: employee.startDate
      }).eq('id', employee.id);

    } else {
      employees.push({
        ...employee,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Supabase Insert
      await supabase.from('employees').insert([{
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department_id: employee.departmentId,
        level: employee.level,
        system_role: employee.systemRole,
        start_date: employee.startDate
      }]);
    }

    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }

  public static async deleteEmployee(id: string, actorId: string, actorName: string, actorRole: any): Promise<void> {
    const employees = this.getEmployees();
    const filtered = employees.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));
    
    // Supabase Delete
    await supabase.from('employees').delete().eq('id', id);
  }

  // --- SETTINGS ---
  public static getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SYSTEM_SETTINGS;
    } catch {
      return INITIAL_SYSTEM_SETTINGS;
    }
  }

  public static async saveSettings(settings: SystemSettings, actorId: string, actorName: string, actorRole: any): Promise<void> {
    const prev = this.getSettings();
    const updated = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: `${actorName} (${actorRole})`,
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));

    // Supabase Upsert
    await supabase.from('settings').upsert({
      id: settings.id,
      active_version: settings.activeVersion,
      common_skills_percent: settings.commonSkillsPercent,
      dept_kpi_percent: settings.deptKpiPercent,
      tl_leadership_percent: settings.tlLeadershipPercent,
      head_tech_management_percent: settings.headTechManagementPercent,
      min_employment_months: settings.minEmploymentMonths,
      common_kpis: settings.commonKPIs,
      department_kpis: settings.departmentKPIs,
      leadership_kpis: settings.leadershipKPIs,
      head_tech_management_kpis: settings.headTechManagementKPIs,
      classifications: settings.classifications,
      level_expectations: settings.levelExpectations,
      updated_by: updated.updatedBy
    });
  }

  // --- EVALUATIONS ---
  public static getEvaluations(): Evaluation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return data ? JSON.parse(data) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  }

  public static async saveEvaluation(
    evaluation: Evaluation,
    actorId: string,
    actorName: string,
    actorRole: any,
    actorEmail?: string
  ): Promise<Evaluation> {
    let evaluations = this.getEvaluations();
    const index = evaluations.findIndex((e) => e.id === evaluation.id);
    let prev: Evaluation | undefined;

    const shouldLock = [
      'HR_MANAGEMENT_APPROVED',
      'PUBLISHED',
      'EMPLOYEE_VIEWED',
      'ACKNOWLEDGED',
    ].includes(evaluation.status);

    const recordToSave: Evaluation = {
      ...evaluation,
      locked: evaluation.locked || shouldLock,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      prev = evaluations[index];
      evaluations[index] = recordToSave;
    } else {
      evaluations.push(recordToSave);
    }

    evaluations = CalculationEngine.recalculateDepartmentRanks(
      evaluations,
      recordToSave.departmentId,
      recordToSave.quarter,
      recordToSave.year
    );

    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));

    // Push to Supabase synchronously
    try {
      const existing = await supabase.from('evaluations').select('id').eq('id', recordToSave.id);
      if (existing.data && existing.data.length > 0) {
        await supabase.from('evaluations').update({
          employee_id: recordToSave.employeeId,
          employee_name: recordToSave.employeeName,
          evaluator_role: recordToSave.evaluatorRole,
          evaluator_email: actorEmail || actorName,
          department: recordToSave.departmentName,
          status: recordToSave.status,
          classification: recordToSave.classification,
          performance_score: recordToSave.finalScore,
          communication_score: recordToSave.commonScore,
          notes: recordToSave.strengths || '',
          details: JSON.stringify(recordToSave),
        }).eq('id', recordToSave.id);
      } else {
        await supabase.from('evaluations').insert([{
          id: recordToSave.id,
          employee_id: recordToSave.employeeId,
          employee_name: recordToSave.employeeName,
          evaluator_role: recordToSave.evaluatorRole,
          evaluator_email: actorEmail || actorName,
          department: recordToSave.departmentName,
          status: recordToSave.status,
          classification: recordToSave.classification,
          performance_score: recordToSave.finalScore,
          communication_score: recordToSave.commonScore,
          notes: recordToSave.strengths || '',
          details: JSON.stringify(recordToSave),
        }]);
      }
    } catch (err: any) {
      console.error('Failed to sync to Supabase', err);
    }

    const saved = evaluations.find((e) => e.id === recordToSave.id) || recordToSave;
    return saved;
  }

  public static async acknowledgeEvaluation(
    evaluationId: string,
    employeeId: string,
    employeeName: string,
    notes?: string
  ): Promise<Evaluation | null> {
    const evaluations = this.getEvaluations();
    const target = evaluations.find((e) => e.id === evaluationId);
    if (!target) return null;

    target.status = 'ACKNOWLEDGED';
    target.acknowledgedAt = new Date().toISOString();
    target.acknowledgedBy = employeeName;
    target.acknowledgementNotes = notes || '';
    target.locked = true;

    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
    
    await supabase.from('evaluations').update({
      status: target.status,
      details: JSON.stringify(target)
    }).eq('id', target.id);

    return target;
  }

  // --- BACKUP & RESTORE ---
  public static exportFullBackup(): string {
    const payload = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      departments: this.getDepartments(),
      employees: this.getEmployees(),
      settings: this.getSettings(),
      evaluations: this.getEvaluations(),
      auditLogs: AuditService.getLogs(),
    };
    return JSON.stringify(payload, null, 2);
  }

  public static async restoreBackup(
    jsonString: string,
    actorId: string,
    actorName: string,
    actorRole: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.departments || !data.employees || !data.settings || !data.evaluations) {
        return { success: false, message: 'Invalid backup structure' };
      }

      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(data.departments));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(data.employees));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(data.evaluations));
      
      // Sync to Supabase
      await this.saveSettings(data.settings, actorId, actorName, actorRole);
      
      for(const e of data.employees) {
        await supabase.from('employees').upsert({
          id: e.id, name: e.name, email: e.email, phone: e.phone,
          department_id: e.departmentId, level: e.level, system_role: e.systemRole, start_date: e.startDate
        });
      }
      for(const e of data.evaluations) {
        await supabase.from('evaluations').upsert({
          id: e.id, employee_id: e.employeeId, employee_name: e.employeeName,
          evaluator_role: e.evaluatorRole, evaluator_email: e.evaluatorEmail, department: e.departmentName,
          status: e.status, classification: e.classification, performance_score: e.finalScore,
          communication_score: e.commonScore, notes: e.strengths || '', details: JSON.stringify(e)
        });
      }

      return { success: true, message: 'Restored successfully' };
    } catch (err: any) {
      return { success: false, message: `Failed: ${err.message}` };
    }
  }

  // --- CSV ---
  public static exportEvaluationsCSV(quarter?: string, year?: number): string { return ""; }
  public static exportEmployeesCSV(): string { return ""; }

  public static async importEmployeesFromCSV(
    csvContent: string,
    actorId: string,
    actorName: string,
    actorRole: any
  ): Promise<{ importedCount: number; errors: string[] }> {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return { importedCount: 0, errors: ['CSV empty'] };

    const currentEmployees = this.getEmployees();
    const departments = this.getDepartments();
    const errors: string[] = [];
    let importedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());

      if (cleanCols.length < 5) continue;
      const [name, email, deptName, role, level, startDate, teamLeaderName] = cleanCols;
      if (!name || !email) continue;

      const matchedDept = departments.find((d) => d.name.toLowerCase() === deptName.toLowerCase() || d.id === deptName) || departments[0];
      const validLevel = ['Junior', 'Mid', 'Senior', 'Team Leader'].includes(level) ? (level as any) : 'Mid';
      const existingIndex = currentEmployees.findIndex((e) => e.email.toLowerCase() === email.toLowerCase());

      const employeeRecord: Employee = {
        id: existingIndex >= 0 ? currentEmployees[existingIndex].id : `emp-imp-${Date.now()}-${i}`,
        name, email, departmentId: matchedDept.id, departmentName: matchedDept.name,
        role: role || 'Team Member', level: validLevel, startDate: startDate || new Date().toISOString().split('T')[0],
        teamLeaderName: teamLeaderName || matchedDept.teamLeaderName, systemRole: validLevel === 'Team Leader' ? 'TEAM_LEADER' : 'EMPLOYEE',
        isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) currentEmployees[existingIndex] = employeeRecord;
      else currentEmployees.push(employeeRecord);

      await supabase.from('employees').upsert({
          id: employeeRecord.id, name: employeeRecord.name, email: employeeRecord.email, phone: employeeRecord.phone,
          department_id: employeeRecord.departmentId, level: employeeRecord.level, system_role: employeeRecord.systemRole, start_date: employeeRecord.startDate
      });
      importedCount++;
    }

    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(currentEmployees));
    return { importedCount, errors };
  }
}
