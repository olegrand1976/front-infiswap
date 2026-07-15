<template>
    <section class="min-w-0 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
                <Badge
                    v-if="count > 0"
                    class="bg-primary text-white"
                >
                    {{ count }}
                </Badge>
                <span class="text-xs text-gray-500">sur la période</span>
            </div>
            <Select
                :model-value="accountType"
                @update:model-value="onAccountTypeChange"
            >
                <SelectTrigger class="max-w-xs rounded-md">
                    <span>{{ accountTypeLabel }}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="option in MARKETING_ACCOUNT_TYPE_FILTERS"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div
            v-if="loading"
            class="h-48 rounded-md bg-gray-100 animate-pulse"
        />
        <template v-else-if="count === 0">
            <p class="text-sm text-gray-500 rounded-md border border-dashed p-4">
                Aucun utilisateur connecté sur la période sélectionnée.
            </p>
        </template>
        <template v-else>
            <DataTable
                :data="users"
                :columns="columns"
            />
            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="count"
                @update:page="onPageChange"
                @update:per-page="onPerPageChange"
            />
        </template>
    </section>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
    MARKETING_ACCOUNT_TYPE_FILTERS,
    type MarketingAccountTypeFilter,
    type MarketingAnalyticsPeriod,
    type MarketingUniqueUser,
    useMarketingAnalytics,
} from '@/composables/useMarketingAnalytics';
import { formatRelativeDate } from '@/composables/useDate';
import { PERPAGE } from '~/lib/constants';

const props = defineProps<{
    period: MarketingAnalyticsPeriod;
}>();

const { getUniqueUsers } = useMarketingAnalytics();

const loading = ref(true);
const users = ref<MarketingUniqueUser[]>([]);
const count = ref(0);
const page = ref(1);
const perPage = ref(PERPAGE);
const accountType = ref<MarketingAccountTypeFilter>('all');

const accountTypeLabel = computed(() =>
    MARKETING_ACCOUNT_TYPE_FILTERS.find(option => option.value === accountType.value)?.label ?? 'Tous',
);

function accountTypeLabelFor(value: string): string {
    if (value === 'institution') {
        return 'Institution';
    }

    return 'Infirmière';
}

const columns: ColumnDef<MarketingUniqueUser>[] = [
    {
        accessorKey: 'full_name',
        header: 'Nom',
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'account_type',
        header: 'Type',
        cell: ({ row }) => h('div', accountTypeLabelFor(String(row.getValue('account_type')))),
    },
    {
        accessorKey: 'created_at',
        header: 'Inscrit le',
        cell: ({ row }) => {
            const value = row.getValue('created_at');
            return h('div', { class: 'text-center' }, value ? formatRelativeDate(String(value)) : '—');
        },
    },
    {
        accessorKey: 'logins',
        header: 'Connexions (période)',
        cell: ({ row }) => h('div', { class: 'text-center' }, String(row.getValue('logins'))),
    },
    {
        accessorKey: 'logins_7d',
        header: 'Connexions 7j',
        cell: ({ row }) => h('div', { class: 'text-center' }, String(row.getValue('logins_7d'))),
    },
    {
        accessorKey: 'logins_30d',
        header: 'Connexions 30j',
        cell: ({ row }) => h('div', { class: 'text-center' }, String(row.getValue('logins_30d'))),
    },
    {
        accessorKey: 'logins_90d',
        header: 'Connexions 90j',
        cell: ({ row }) => h('div', { class: 'text-center' }, String(row.getValue('logins_90d'))),
    },
    {
        accessorKey: 'last_login_at',
        header: 'Dernière connexion',
        cell: ({ row }) => {
            const value = row.getValue('last_login_at');
            return h('div', { class: 'text-center' }, value ? formatRelativeDate(String(value)) : '—');
        },
    },
];

async function loadUsers() {
    loading.value = true;

    try {
        const response = await getUniqueUsers(props.period, accountType.value, page.value, perPage.value);
        users.value = response.users;
        count.value = response.count;
    } finally {
        loading.value = false;
    }
}

function onAccountTypeChange(value: unknown) {
    if (value !== 'all' && value !== 'nurse' && value !== 'institution') {
        return;
    }

    accountType.value = value;
    page.value = 1;
    void loadUsers();
}

function onPageChange(value: number) {
    page.value = value;
    void loadUsers();
}

function onPerPageChange(value: number) {
    perPage.value = value;
    page.value = 1;
    void loadUsers();
}

watch(() => props.period, () => {
    page.value = 1;
    void loadUsers();
});

onMounted(() => {
    void loadUsers();
});
</script>
