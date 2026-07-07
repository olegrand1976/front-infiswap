export type CareerGradeSummary = {
    id?: number;
    slug?: string;
    name: string;
    level?: number;
    direct_commission_multiplier?: number;
    upline_override_level_1_rate?: number;
    upline_override_level_2_rate?: number;
    is_default?: boolean;
};

export type NormalizedCareerStatus = {
    grade: CareerGradeSummary | null;
    upline?: { id: number; full_name: string } | null;
    assigned_at?: string | null;
    next_grade?: CareerGradeSummary | null;
    progression?: {
        direct_bc: number;
        min_direct_bc?: number | null;
        team_revenue?: number | null;
        min_team_revenue?: number | null;
    };
};

/** Normalise la réponse API my-career-status (career_grade ou grade). */
export function normalizeMyCareerStatus(raw: Record<string, unknown>): NormalizedCareerStatus {
    const grade = (raw.grade ?? raw.career_grade) as CareerGradeSummary | null;
    const progression = raw.progression as NormalizedCareerStatus['progression'] | undefined;
    const progress = raw.progress as { direct_bc_count?: number } | undefined;

    return {
        grade: grade ?? null,
        upline: raw.upline as NormalizedCareerStatus['upline'],
        assigned_at: raw.assigned_at as string | undefined,
        next_grade: raw.next_grade as CareerGradeSummary | null | undefined,
        progression: progression ?? {
            direct_bc: progress?.direct_bc_count ?? 0,
        },
    };
}
