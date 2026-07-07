import { useState, useNuxtApp } from '#app';
import type { CommissionRatePeriod } from '@/composables/useInstitutionCommissionTracking';
import { normalizeMyCareerStatus } from '@/lib/institutionCrmSettings';

export { normalizeMyCareerStatus } from '@/lib/institutionCrmSettings';

export type InstitutionCrmGeneralSettings = {
    monthly_commitment_months: number;
    yearly_commitment_months: number;
    price_lock_enabled: boolean;
    indexation_notice_days: number;
    payment_reminder_interval_days: number;
    payment_reminder_max_count: number;
    payment_followup_admin_roles: string[];
    amount_ranges: {
        monthly: { min: number; max: number };
        yearly: { min: number; max: number };
    };
    churn: {
        inactive_mission_days: number;
        tenure_months: number;
        usage_drop_percent: number;
    };
};

export type CommercialCareerGrade = {
    id?: number;
    slug: string;
    name: string;
    level: number;
    direct_commission_multiplier: number;
    upline_override_level_1_rate: number;
    upline_override_level_2_rate: number;
    promotion_min_direct_bc?: number | null;
    promotion_min_team_revenue?: number | null;
    is_default: boolean;
};

export type InstitutionCrmSettingsPayload = {
    periods: CommissionRatePeriod[];
    general: InstitutionCrmGeneralSettings;
    grades: CommercialCareerGrade[];
};

export type InstitutionCrmCommercial = {
    id: number;
    full_name: string;
    email: string;
    career_grade?: CommercialCareerGrade | null;
    upline?: { id: number; full_name: string; email?: string | null } | null;
    commercial_grade_assigned_at?: string | null;
    commercial_collaboration_status?: string;
    has_pending_signature?: boolean;
};

export type AssignCareerGradePayload = {
    career_grade_id: number;
    notify: boolean;
    notes?: string | null;
    assignment_type: 'initial' | 'promotion' | 'manual' | 'demotion';
};

export type MyCareerStatus = {
    grade: CommercialCareerGrade | null;
    upline?: { id: number; full_name: string } | null;
    assigned_at?: string | null;
    next_grade?: CommercialCareerGrade | null;
    progression?: {
        direct_bc: number;
        min_direct_bc?: number | null;
        team_revenue?: number | null;
        min_team_revenue?: number | null;
    };
};

export type TeamSimulatorScenario = {
    label: string;
    amount_htva: number;
    payment_mode: 'monthly' | 'yearly';
    subscription_year: number;
    count_per_month: number;
};

export type TeamSimulatorMember = {
    depth: 1 | 2;
    count: number;
    avg_bc_per_month: number;
    avg_amount: number;
};

export type TeamSimulatorPayload = {
    viewer_grade_id?: number | null;
    compare_next_grade?: boolean;
    scenarios: TeamSimulatorScenario[];
    team: TeamSimulatorMember[];
};

export type TeamSimulatorBreakdownRow = {
    source: string;
    type: 'direct' | 'override_l1' | 'override_l2';
    amount_monthly: number;
    amount_yearly: number;
};

export type TeamSimulatorResult = {
    direct_monthly: number;
    direct_yearly: number;
    override_l1_monthly: number;
    override_l1_yearly: number;
    override_l2_monthly: number;
    override_l2_yearly: number;
    total_monthly: number;
    total_yearly: number;
    breakdown: TeamSimulatorBreakdownRow[];
    next_grade?: {
        grade: CommercialCareerGrade;
        total_monthly: number;
        total_yearly: number;
        delta_monthly: number;
        delta_yearly: number;
    } | null;
};

export type InstitutionCrmSettingsSection = 'periods' | 'general' | 'grades';

export type TeamSimulatorExample = {
    description?: string;
    payload: TeamSimulatorPayload;
    labels?: Record<string, string>;
};

export const useInstitutionCrmSettings = () => {
    const { $apifetch } = useNuxtApp();
    const settings = useState<InstitutionCrmSettingsPayload | null>('institutionCrmSettings', () => null);
    const commercials = useState<InstitutionCrmCommercial[]>('institutionCrmCommercials', () => []);
    const myCareerStatus = useState<MyCareerStatus | null>('myCareerStatus', () => null);
    const loading = useState<boolean>('institutionCrmSettingsLoading', () => false);

    async function getSettings() {
        loading.value = true;
        try {
            const response = await $apifetch('api/admin/institution-crm-settings');
            settings.value = response.data as InstitutionCrmSettingsPayload;
            return settings.value;
        }
        finally {
            loading.value = false;
        }
    }

    async function updateSettings(
        payload: Partial<InstitutionCrmSettingsPayload> | InstitutionCrmSettingsPayload,
    ) {
        const response = await $apifetch('api/admin/institution-crm-settings', {
            method: 'PUT',
            body: payload,
        });
        settings.value = response.data as InstitutionCrmSettingsPayload;
        return settings.value;
    }

    async function getCommercials() {
        const response = await $apifetch('api/admin/institution-crm-settings/commercials');
        commercials.value = response.data ?? response.commercials ?? [];
        return commercials.value;
    }

    async function assignCareerGrade(userId: number, payload: AssignCareerGradePayload) {
        const response = await $apifetch(`api/admin/commercials/${userId}/career-grade`, {
            method: 'PUT',
            body: payload,
        });
        return response;
    }

    async function getMyCareerStatus() {
        const response = await $apifetch('api/crm/my-career-status');
        myCareerStatus.value = normalizeMyCareerStatus(response.data as Record<string, unknown>);
        return myCareerStatus.value;
    }

    async function assignCommercialUpline(userId: number, commercialUplineId: number | null) {
        const response = await $apifetch(`api/admin/commercials/${userId}/upline`, {
            method: 'PUT',
            body: { commercial_upline_id: commercialUplineId },
        });
        return response;
    }

    async function calculateTeamSimulator(payload: TeamSimulatorPayload) {
        const response = await $apifetch('api/crm/team-simulator/calculate', {
            method: 'POST',
            body: payload,
        });
        return response.data as TeamSimulatorResult;
    }

    async function getTeamSimulatorExample() {
        const response = await $apifetch('api/crm/team-simulator/example');
        return (response.data ?? response) as TeamSimulatorExample;
    }

    return {
        settings,
        commercials,
        myCareerStatus,
        loading,
        getSettings,
        updateSettings,
        getCommercials,
        assignCareerGrade,
        assignCommercialUpline,
        getMyCareerStatus,
        calculateTeamSimulator,
        getTeamSimulatorExample,
    };
};
