import type { StripePaymentKpis } from '@/composables/useStripePaymentsAdmin';

export type MarketingAnalyticsPeriod = '7d' | '30d' | '90d';

export type MarketingAccountTypeFilter = 'all' | 'nurse' | 'institution';

export type MarketingAccountTypeBreakdown = {
    logins: number;
    unique_users: number;
};

export type MarketingAttendance = {
    today: {
        logins: number;
        unique_users: number;
        by_account_type: Record<'nurse' | 'institution' | 'staff', MarketingAccountTypeBreakdown>;
    };
    period: {
        logins: number;
        unique_users: number;
        by_account_type: Record<'nurse' | 'institution' | 'staff', MarketingAccountTypeBreakdown>;
    };
    daily_series: Array<{ day: string; logins: number; unique_users: number }>;
};

export type MarketingTopScreen = {
    route_path: string;
    views: number;
    unique_users: number;
};

export type MarketingUniqueUser = {
    id: number;
    full_name: string;
    email: string;
    account_type: 'nurse' | 'institution';
    created_at: string | null;
    logins: number;
    logins_7d: number;
    logins_30d: number;
    logins_90d: number;
    last_login_at: string;
};

export type MarketingUnverifiedUser = {
    id: number;
    full_name: string;
    email: string;
    account_type: string;
    created_at: string | null;
    can_resend: boolean;
    last_resend_at: string | null;
};

export type MarketingRecentlyVerifiedUser = {
    id: number;
    full_name: string;
    email: string;
    account_type: string;
    created_at: string | null;
    email_verified_at: string | null;
};

export type MarketingAnalyticsOverview = {
    period: {
        from: string;
        to: string;
        days: number;
    };
    attendance: MarketingAttendance;
    top_screens: MarketingTopScreen[];
    acquisition: {
        registrations: number;
        email_verified: number;
        belgium: number;
        france: number;
    };
    conversion: {
        registrations: number;
        email_verified: number;
        platform_access: number;
        boost_purchases: number;
        contract_purchases: number;
    };
    journey_emails: {
        total_sends: number;
        by_workflow: Array<{
            workflow: string;
            sends: number;
            open_rate: number | null;
            click_rate: number | null;
        }>;
        daily_series: Array<{ day: string; sends: number }>;
        last_sent_at: string | null;
    };
    partners: {
        window_days: number;
        clicks: {
            nurstech: number;
            nursassur: number;
            nurstech_30d?: number;
            nursassur_30d?: number;
        };
        contacts: {
            nurstech: number;
            nursassur: number;
            nurstech_30d?: number;
            nursassur_30d?: number;
        };
        clicks_by_placement_30d: Array<{ placement: string; nurstech: number; nursassur: number; total: number }>;
        aggregate: Record<string, unknown>;
    };
    revenue: StripePaymentKpis;
};

export const MARKETING_ANALYTICS_PERIODS = [
    { value: '7d' as const, label: '7 jours' },
    { value: '30d' as const, label: '30 jours' },
    { value: '90d' as const, label: '90 jours' },
];

export const MARKETING_ACCOUNT_TYPE_FILTERS = [
    { value: 'all' as const, label: 'Tous' },
    { value: 'nurse' as const, label: 'Infirmières' },
    { value: 'institution' as const, label: 'Institutions' },
];

export type JourneyTemplateVariant = {
    key: string;
    label: string;
    subject: string;
    html: string;
};

export type JourneyTemplatePreview = {
    workflow: string;
    archived: boolean;
    variants: JourneyTemplateVariant[];
};

export type JourneySendStats = {
    sends: number;
    trackable_sends: number;
    opens: number;
    clicks: number;
    open_rate: number | null;
    click_rate: number | null;
};

export type JourneySendRecipient = {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    step: string | null;
    sent_at: string | null;
    opened_at: string | null;
    clicked_at: string | null;
    open_count: number;
    click_count: number;
    trackable: boolean;
};

export const useMarketingAnalytics = () => {
    const { $apifetch } = useNuxtApp();

    const getOverview = async (period: MarketingAnalyticsPeriod = '30d') => {
        const response = await $apifetch<{ data: MarketingAnalyticsOverview }>(
            `api/admin/marketing-analytics?period=${period}`,
        );

        return response.data;
    };

    const getJourneyTemplatePreview = async (workflow: string) => {
        const response = await $apifetch<{ data: JourneyTemplatePreview }>(
            `api/admin/marketing-analytics/journey-templates/${encodeURIComponent(workflow)}`,
        );

        return response.data;
    };

    const getJourneySends = async (
        workflow: string,
        period: MarketingAnalyticsPeriod = '30d',
        page = 1,
        perPage = 25,
    ) => {
        const params = new URLSearchParams({
            period,
            page: String(page),
            per_page: String(perPage),
        });

        return await $apifetch<{
            stats: JourneySendStats;
            users: JourneySendRecipient[];
            count: number;
        }>(
            `api/admin/marketing-analytics/journey-sends/${encodeURIComponent(workflow)}?${params.toString()}`,
        );
    };

    const getUniqueUsers = async (
        period: MarketingAnalyticsPeriod = '30d',
        accountType: MarketingAccountTypeFilter = 'all',
        page = 1,
        perPage = 25,
    ) => {
        const params = new URLSearchParams({
            period,
            account_type: accountType,
            page: String(page),
            per_page: String(perPage),
        });

        return await $apifetch<{ users: MarketingUniqueUser[]; count: number }>(
            `api/admin/marketing-analytics/unique-users?${params.toString()}`,
        );
    };

    const getUnverifiedEmails = async (
        page = 1,
        perPage = 25,
        verifiedPage = 1,
        verifiedPerPage = 25,
    ) => {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
            verified_page: String(verifiedPage),
            verified_per_page: String(verifiedPerPage),
        });

        return await $apifetch<{
            users: MarketingUnverifiedUser[];
            count: number;
            verified_recent: MarketingRecentlyVerifiedUser[];
            verified_recent_count: number;
        }>(
            `api/admin/marketing-analytics/unverified-emails?${params.toString()}`,
        );
    };

    const resendVerification = async (userId: number) => {
        return await $apifetch<{ message: string; sent_at: string }>(
            `api/admin/marketing-analytics/unverified-emails/${userId}/resend-verification`,
            { method: 'POST' },
        );
    };

    return {
        getOverview,
        getJourneyTemplatePreview,
        getJourneySends,
        getUniqueUsers,
        getUnverifiedEmails,
        resendVerification,
    };
};
