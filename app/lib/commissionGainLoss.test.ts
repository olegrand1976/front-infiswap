import { describe, expect, it } from 'vitest';
import type { CommissionKpis, GainLossRow } from '@/composables/useInstitutionCommissionTracking';

describe('commission KPI types', () => {
    it('accepts extended gain/loss fields', () => {
        const kpis: CommissionKpis = {
            total_received: 1000,
            commission_due: 100,
            commission_paid: 50,
            commission_earned: 150,
            commission_reversed: 10,
            commission_net: 140,
            commission_clawback_due: 5,
            commission_at_risk: 200,
            client_collection_rate: 80,
            net_remuneration_impact: 95,
            signed_contracts: 3,
            active_vendors: 2,
            payout_rate: 33.33,
        };

        expect(kpis.net_remuneration_impact).toBe(95);
        expect(kpis.commission_at_risk).toBe(200);
    });

    it('accepts gain loss series rows', () => {
        const row: GainLossRow = {
            month: '2026-07',
            received: 500,
            earned: 300,
            paid: 100,
            reversed: 20,
            net: 280,
        };

        expect(row.net).toBe(row.earned - row.reversed);
    });
});
