<template>
    <section class="rounded-lg border bg-muted/20 p-4 space-y-3">
        <h3 class="text-sm font-semibold text-primary">
            Mon statut carrière
        </h3>
        <div
            v-if="loading"
            class="text-sm text-muted-foreground"
        >
            Chargement…
        </div>
        <dl
            v-else
            class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm"
        >
            <div>
                <dt class="text-muted-foreground">Grade actuel</dt>
                <dd class="font-medium">{{ status?.grade?.name ?? '—' }}</dd>
            </div>
            <div>
                <dt class="text-muted-foreground">Multiplicateur direct</dt>
                <dd class="font-medium">×{{ status?.grade?.direct_commission_multiplier ?? 1 }}</dd>
            </div>
            <div>
                <dt class="text-muted-foreground">Override L1 / L2</dt>
                <dd class="font-medium">
                    {{ status?.grade?.upline_override_level_1_rate ?? 0 }}% /
                    {{ status?.grade?.upline_override_level_2_rate ?? 0 }}%
                </dd>
            </div>
            <div>
                <dt class="text-muted-foreground">Upline</dt>
                <dd class="font-medium">{{ status?.upline?.full_name ?? '—' }}</dd>
            </div>
            <div
                v-if="status?.progression && status.next_grade"
                class="sm:col-span-2 lg:col-span-4"
            >
                <dt class="text-muted-foreground">Progression vers {{ status.next_grade.name }}</dt>
                <dd class="font-medium mt-1">
                    {{ status.progression.direct_bc ?? 0 }}
                    / {{ status.progression.min_direct_bc ?? '—' }} BC directs
                    <span
                        v-if="status.progression.min_team_revenue"
                        class="text-muted-foreground"
                    >
                        — CA équipe {{ formatEuro(status.progression.team_revenue ?? 0) }}
                        / {{ formatEuro(status.progression.min_team_revenue) }}
                    </span>
                </dd>
            </div>
        </dl>
    </section>
</template>

<script setup lang="ts">
import type { MyCareerStatus } from '@/composables/useInstitutionCrmSettings';

defineProps<{
    status?: MyCareerStatus | null;
    loading?: boolean;
}>();

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}
</script>
