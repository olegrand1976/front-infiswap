<template>
    <div class="space-y-6 p-4">
        <div class="flex flex-wrap items-center gap-3">
            <InputIcon
                v-model="commercialSearch"
                rounded="md"
                placeholder="Rechercher une personne"
                class="max-w-xs"
                @input="debouncedSearchCommercials"
            />
            <Select
                :model-value="selectedCommercial"
                @update:model-value="onCommercialChange"
            >
                <SelectTrigger class="max-w-xs rounded-md">
                    <span>{{ selectedCommercialLabel }}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        Toutes les personnes
                    </SelectItem>
                    <SelectItem
                        v-if="user?.id"
                        value="me"
                    >
                        Moi
                    </SelectItem>
                    <SelectItem
                        v-for="commercial in commercialOptions"
                        :key="commercial.id"
                        :value="String(commercial.id)"
                    >
                        {{ commercial.full_name }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select
                :model-value="selectedProfile"
                @update:model-value="onProfileChange"
            >
                <SelectTrigger class="max-w-xs rounded-md">
                    <span>{{ profileLabel }}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        Tous les profils
                    </SelectItem>
                    <SelectItem value="users">
                        Infirmières
                    </SelectItem>
                    <SelectItem value="institutions">
                        Institutions
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select
                :model-value="selectedPeriod"
                @update:model-value="onPeriodChange"
            >
                <SelectTrigger class="max-w-xs rounded-md">
                    <span>{{ periodLabel }}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="week">
                        Cette semaine
                    </SelectItem>
                    <SelectItem value="month">
                        Ce mois
                    </SelectItem>
                    <SelectItem value="custom">
                        Période personnalisée
                    </SelectItem>
                </SelectContent>
            </Select>
            <Input
                v-if="selectedPeriod === 'custom'"
                v-model="customStartDate"
                type="date"
                class="max-w-[170px] rounded-md"
                @change="refresh"
            />
            <Input
                v-if="selectedPeriod === 'custom'"
                v-model="customEndDate"
                type="date"
                class="max-w-[170px] rounded-md"
                @change="refresh"
            />
            <Button
                variant="outline"
                class="rounded-md"
                @click="resetFilters"
            >
                <RefreshCw class="md:mr-2 size-4" />
                Restaurer
            </Button>
        </div>

        <p
            v-if="periodLabelText"
            class="text-sm text-muted-foreground"
        >
            {{ periodLabelText }}
        </p>

        <div
            v-if="loading"
            class="flex justify-center py-12"
        >
            <RollingLoader :loading="loading" />
        </div>

        <template v-else>
            <DataTable
                :data="rows"
                :columns="columns"
            />
            <p
                v-if="rows.length === 0"
                class="text-center text-sm text-muted-foreground py-8"
            >
                Aucune activité pour les filtres sélectionnés.
            </p>
        </template>

        <AlertDialog v-model:open="revokeDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Retirer l'accès CRM</AlertDialogTitle>
                    <AlertDialogDescription>
                        Retirer l'accès CRM de {{ revokeTarget?.full_name }} ?
                        Les rôles CRM (administrateur, développeur, commercial) seront supprimés pour cette personne.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        :disabled="revoking"
                        @click="confirmRevoke"
                    >
                        {{ revoking ? 'Suppression…' : 'Retirer l\'accès' }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { RefreshCw, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import RollingLoader from '~/components/RollingLoader.vue';
import { formatToDMY } from '@/composables/useDate';
import type { CrmCommercialActivityRow } from '@/composables/useCrm';

const { $apifetch } = useNuxtApp();
const { getCommercialActivity, revokeCommercialAccess } = useCrm();
const user = useUser();

type CommercialOption = {
    id: number;
    full_name: string;
};

const loading = ref(false);
const rows = ref<CrmCommercialActivityRow[]>([]);
const periodInfo = ref<{ preset?: string; start_date?: string; end_date?: string }>({});

const selectedCommercial = ref('all');
const selectedProfile = ref('all');
const selectedPeriod = ref('week');
const customStartDate = ref('');
const customEndDate = ref('');
const commercialSearch = ref('');
const commercialOptions = ref<CommercialOption[]>([]);
const revokeDialogOpen = ref(false);
const revokeTarget = ref<CrmCommercialActivityRow | null>(null);
const revoking = ref(false);

const selectedCommercialLabel = computed(() => {
    if (selectedCommercial.value === 'all') {
        return 'Toutes les personnes';
    }
    if (selectedCommercial.value === 'me') {
        return 'Moi';
    }
    const match = commercialOptions.value.find(c => String(c.id) === selectedCommercial.value);
    return match?.full_name ?? 'Personne';
});

const profileLabel = computed(() => {
    switch (selectedProfile.value) {
        case 'users':
            return 'Infirmières';
        case 'institutions':
            return 'Institutions';
        default:
            return 'Tous les profils';
    }
});

const periodLabel = computed(() => {
    switch (selectedPeriod.value) {
        case 'month':
            return 'Ce mois';
        case 'custom':
            return 'Période personnalisée';
        default:
            return 'Cette semaine';
    }
});

const periodLabelText = computed(() => {
    const start = periodInfo.value.start_date;
    const end = periodInfo.value.end_date;
    if (!start || !end) {
        return '';
    }
    return `Période : ${formatToDMY(start)} — ${formatToDMY(end)}`;
});

function mergeCommercialOptions(entries: Array<{ id: number; full_name: string }>) {
    const existingIds = new Set(commercialOptions.value.map(c => c.id));
    for (const entry of entries) {
        if (!entry.id || existingIds.has(entry.id)) {
            continue;
        }
        commercialOptions.value.push({
            id: entry.id,
            full_name: entry.full_name,
        });
        existingIds.add(entry.id);
    }
    commercialOptions.value.sort((a, b) => a.full_name.localeCompare(b.full_name, 'fr'));
}

function mergeFromRows(data: CrmCommercialActivityRow[]) {
    mergeCommercialOptions(data.map(row => ({
        id: row.user_id,
        full_name: row.full_name,
    })));
}

async function searchCommercials() {
    if (commercialSearch.value.length < 2) {
        return;
    }

    try {
        const data = await $apifetch<Array<{ id: number; firstname?: string | null; lastname?: string | null; full_name?: string | null }>>('api/admin/users/search', {
            params: {
                query: commercialSearch.value,
                roles: 'administrator,developer,sale_representative',
            },
        });
        mergeCommercialOptions(data.map(user => ({
            id: user.id,
            full_name: getCommercialDisplayName(user),
        })));
    }
    catch {
        // ignore search errors
    }
}

function getCommercialDisplayName(user: { id: number; firstname?: string | null; lastname?: string | null; full_name?: string | null }) {
    const full = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();
    if (full) {
        return full;
    }
    if (user.full_name) {
        return user.full_name;
    }
    return `Commercial #${user.id}`;
}

let commercialSearchTimer: ReturnType<typeof setTimeout>;
function debouncedSearchCommercials() {
    clearTimeout(commercialSearchTimer);
    commercialSearchTimer = setTimeout(searchCommercials, 350);
}

function buildQueryParams(): Record<string, unknown> {
    const params: Record<string, unknown> = {
        period: selectedPeriod.value,
        profile: selectedProfile.value,
    };

    if (selectedCommercial.value === 'me' && user.value?.id) {
        params.creator_id = user.value.id;
    }
    else if (selectedCommercial.value !== 'all') {
        params.creator_id = Number(selectedCommercial.value);
    }

    if (selectedPeriod.value === 'custom' && customStartDate.value && customEndDate.value) {
        params.start_date = customStartDate.value;
        params.end_date = customEndDate.value;
    }

    return params;
}

async function refresh() {
    if (selectedPeriod.value === 'custom' && (!customStartDate.value || !customEndDate.value)) {
        return;
    }

    loading.value = true;
    try {
        const data = await getCommercialActivity(buildQueryParams());
        rows.value = data.rows ?? [];
        periodInfo.value = data.period ?? {};
        mergeFromRows(rows.value);
    }
    catch {
        rows.value = [];
        periodInfo.value = {};
        $toast({
            description: 'Impossible de charger le récapitulatif d\'activité.',
            variant: 'destructive',
        });
    }
    finally {
        loading.value = false;
    }
}

function onCommercialChange(value: unknown) {
    selectedCommercial.value = typeof value === 'string' ? value : 'all';
    refresh();
}

function onProfileChange(value: unknown) {
    selectedProfile.value = typeof value === 'string' ? value : 'all';
    refresh();
}

function onPeriodChange(value: unknown) {
    selectedPeriod.value = typeof value === 'string' ? value : 'week';
    if (selectedPeriod.value !== 'custom') {
        refresh();
    }
}

function resetFilters() {
    selectedCommercial.value = 'all';
    selectedProfile.value = 'all';
    selectedPeriod.value = 'week';
    customStartDate.value = '';
    customEndDate.value = '';
    commercialSearch.value = '';
    refresh();
}

function openRevokeDialog(row: CrmCommercialActivityRow) {
    revokeTarget.value = row;
    revokeDialogOpen.value = true;
}

async function confirmRevoke() {
    if (!revokeTarget.value || revoking.value) {
        return;
    }

    const targetId = revokeTarget.value.user_id;
    revoking.value = true;
    try {
        await revokeCommercialAccess(targetId);
        $toast({ description: 'Accès CRM retiré.' });
        revokeDialogOpen.value = false;
        revokeTarget.value = null;

        if (selectedCommercial.value === String(targetId)) {
            selectedCommercial.value = 'all';
        }

        await refresh();
    }
    catch {
        $toast({
            description: 'Impossible de retirer l\'accès CRM.',
            variant: 'destructive',
        });
    }
    finally {
        revoking.value = false;
    }
}

const columns: ColumnDef<CrmCommercialActivityRow>[] = [
    {
        accessorKey: 'full_name',
        header: 'Personne',
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.full_name),
    },
    {
        accessorKey: 'roles_label',
        header: 'Rôles',
        cell: ({ row }) => row.original.roles_label || '—',
    },
    {
        accessorKey: 'status_label',
        header: 'Statut',
        cell: ({ row }) => row.original.status_label || '—',
    },
    {
        accessorKey: 'email',
        header: 'E-mail',
        cell: ({ row }) => row.original.email || '—',
    },
    {
        accessorKey: 'nb_call',
        header: 'Appels',
        cell: ({ row }) => row.original.nb_call,
    },
    {
        accessorKey: 'nb_sale',
        header: 'Ventes',
        cell: ({ row }) => row.original.nb_sale,
    },
    {
        accessorKey: 'nb_recommandation',
        header: 'Recommandations',
        cell: ({ row }) => row.original.nb_recommandation,
    },
    {
        accessorKey: 'nb_meeting',
        header: 'RDV',
        cell: ({ row }) => row.original.nb_meeting,
    },
    {
        accessorKey: 'nb_pending',
        header: 'Réponses en attente',
        cell: ({ row }) => row.original.nb_pending,
    },
    {
        accessorKey: 'total_actions',
        header: 'Total',
        cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.total_actions),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            if (!row.original.can_revoke) {
                return null;
            }

            return h(
                Button,
                {
                    variant: 'ghost',
                    size: 'icon',
                    class: 'text-destructive hover:text-destructive',
                    title: 'Retirer l\'accès CRM',
                    onClick: () => openRevokeDialog(row.original),
                },
                () => h(Trash2, { class: 'size-4' }),
            );
        },
    },
];

onMounted(async () => {
    if (user.value?.id) {
        mergeCommercialOptions([{
            id: user.value.id,
            full_name: user.value.full_name ?? `Commercial #${user.value.id}`,
        }]);
    }
    await refresh();
});
</script>
