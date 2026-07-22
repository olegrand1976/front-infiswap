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
    has_initial_assignment?: boolean;
    eligible_for_promotion?: boolean;
    progression?: {
        direct_bc: number;
        min_direct_bc?: number | null;
        team_revenue?: number | null;
        min_team_revenue?: number | null;
    };
};

export type CareerHistoryEntry = {
    id: number;
    assignment_type: 'initial' | 'promotion' | 'manual' | 'demotion';
    status?: string | null;
    effective_at?: string | null;
    notes?: string | null;
    notify_sent_at?: string | null;
    created_at?: string | null;
    grade?: {
        id: number;
        slug: string;
        name: string;
        level: number;
    } | null;
    assigned_by?: {
        id: number;
        full_name: string;
    } | null;
};

export type CareerProgressionMonth = {
    month: string;
    direct_bc: number;
    direct_bc_cumulative: number;
    team_revenue: number;
};

export type CareerProgressionSeries = {
    months: CareerProgressionMonth[];
    totals: {
        direct_bc: number;
        team_revenue: number;
    };
    next_grade?: {
        id?: number;
        name: string;
        min_direct_bc?: number | null;
        min_team_revenue?: number | null;
    } | null;
    eligible_for_promotion: boolean;
};

export type InstitutionCrmSettingsSection = 'periods' | 'general' | 'grades';

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

    async function getCommercialCareerStatus(userId: number) {
        const response = await $apifetch(`api/admin/commercials/${userId}/career-status`);
        return normalizeMyCareerStatus(response.data as Record<string, unknown>) as MyCareerStatus;
    }

    async function getCommercialCareerHistory(userId: number) {
        const response = await $apifetch(`api/admin/commercials/${userId}/career-history`);
        return {
            eligible_for_promotion: Boolean(response.eligible_for_promotion),
            entries: (response.data ?? []) as CareerHistoryEntry[],
        };
    }

    async function getCommercialCareerProgressionSeries(userId: number, months = 12) {
        const response = await $apifetch(`api/admin/commercials/${userId}/career-progression-series`, {
            query: { months },
        });
        return response.data as CareerProgressionSeries;
    }

    async function getCareerGrades() {
        const response = await $apifetch('api/crm/career-grades');
        return (response.data ?? []) as CommercialCareerGrade[];
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
        getCommercialCareerStatus,
        getCommercialCareerHistory,
        getCommercialCareerProgressionSeries,
        getCareerGrades,
    };
};
