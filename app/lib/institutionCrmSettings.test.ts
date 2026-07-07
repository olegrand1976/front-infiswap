import { describe, expect, it } from 'vitest';
import { normalizeMyCareerStatus } from './institutionCrmSettings';

describe('normalizeMyCareerStatus', () => {
    it('maps career_grade to grade', () => {
        const raw = {
            career_grade: {
                id: 1,
                slug: 'conseiller',
                name: 'Conseiller',
                level: 1,
                direct_commission_multiplier: 1,
                upline_override_level_1_rate: 0,
                upline_override_level_2_rate: 0,
                is_default: true,
            },
            progression: {
                direct_bc: 3,
                min_direct_bc: 5,
                team_revenue: 1000,
                min_team_revenue: 5000,
            },
        };

        const status = normalizeMyCareerStatus(raw);

        expect(status.grade?.name).toBe('Conseiller');
        expect(status.progression?.direct_bc).toBe(3);
    });

    it('falls back to progress.direct_bc_count when progression absent', () => {
        const status = normalizeMyCareerStatus({
            grade: { id: 2, name: 'Manager', slug: 'manager', level: 2, direct_commission_multiplier: 1.1, upline_override_level_1_rate: 5, upline_override_level_2_rate: 0, is_default: false },
            progress: { direct_bc_count: 7 },
        });

        expect(status.progression?.direct_bc).toBe(7);
    });
});

describe('teamSimulatorResultShape', () => {
    it('accepts API next_grade and breakdown fields', () => {
        const apiResult = {
            direct_monthly: 180,
            direct_yearly: 2160,
            override_l1_monthly: 22.5,
            override_l1_yearly: 270,
            override_l2_monthly: 0,
            override_l2_yearly: 0,
            total_monthly: 202.5,
            total_yearly: 2430,
            breakdown: [
                { source: 'Test', type: 'direct', amount_monthly: 180, amount_yearly: 2160 },
            ],
            next_grade: {
                grade: { id: 2, name: 'Manager', slug: 'manager', level: 2, direct_commission_multiplier: 1.1, upline_override_level_1_rate: 5, upline_override_level_2_rate: 0, is_default: false },
                total_monthly: 220,
                total_yearly: 2640,
                delta_monthly: 17.5,
                delta_yearly: 210,
            },
        };

        expect(apiResult.breakdown).toHaveLength(1);
        expect(apiResult.next_grade?.delta_monthly).toBe(17.5);
        expect(apiResult.total_yearly).toBe(apiResult.total_monthly * 12);
    });
});
