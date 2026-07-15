import type { StripePaymentKpis } from '@/composables/useStripePaymentsAdmin';

export type MarketingAnalyticsPeriod = '7d' | '30d' | '90d';

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
        by_workflow: Array<{ workflow: string; sends: number }>;
        daily_series: Array<{ day: string; sends: number }>;
    };
    partners: {
        clicks: { nurstech_30d: number; nursassur_30d: number };
        contacts: { nurstech_30d: number; nursassur_30d: number };
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

export const useMarketingAnalytics = () => {
    const { $apifetch } = useNuxtApp();

    const getOverview = async (period: MarketingAnalyticsPeriod = '30d') => {
        const response = await $apifetch<{ data: MarketingAnalyticsOverview }>(
            `api/admin/marketing-analytics?period=${period}`,
        );

        return response.data;
    };

    return {
        getOverview,
    };
};
