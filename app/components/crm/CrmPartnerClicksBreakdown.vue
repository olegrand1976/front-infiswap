<template>
    <section
        v-if="rows.length > 0"
        class="mx-4 mb-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
    >
        <h3 class="text-sm font-semibold text-slate-800">
            Clics partenaires par emplacement (30 j)
        </h3>
        <div class="mt-2 overflow-x-auto">
            <table class="min-w-full text-left text-xs text-slate-700">
                <thead>
                    <tr class="border-b border-slate-100 text-slate-500">
                        <th class="py-2 pr-4 font-medium">
                            Emplacement
                        </th>
                        <th class="py-2 px-3 font-medium text-right">
                            NursTech
                        </th>
                        <th class="py-2 px-3 font-medium text-right">
                            NursAssur
                        </th>
                        <th class="py-2 pl-3 font-medium text-right">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="row in rows"
                        :key="row.placement"
                        class="border-b border-slate-50 last:border-0"
                    >
                        <td class="py-2 pr-4 font-medium">
                            {{ formatPlacement(row.placement) }}
                        </td>
                        <td class="py-2 px-3 text-right tabular-nums">
                            {{ row.nurstech }}
                        </td>
                        <td class="py-2 px-3 text-right tabular-nums">
                            {{ row.nursassur }}
                        </td>
                        <td class="py-2 pl-3 text-right tabular-nums font-semibold">
                            {{ row.total }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { CrmPartnerClickPlacementRow } from '@/composables/useCrm';

const props = defineProps<{
    rows: CrmPartnerClickPlacementRow[];
}>();

const placementLabels: Record<string, string> = {
    presentation_card: 'Carte dashboard',
    presentation_contact: 'Contact dashboard',
    partner_banner: 'Bannière dashboard',
    home_partners: 'Accueil public',
    services_section: 'Page services',
    unknown: 'Non renseigné',
};

function formatPlacement(placement: string): string {
    return placementLabels[placement] ?? placement;
}

const rows = computed(() => props.rows ?? []);
</script>
