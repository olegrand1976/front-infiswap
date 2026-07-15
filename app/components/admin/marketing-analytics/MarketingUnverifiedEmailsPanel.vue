<template>
    <section class="px-4 pb-4">
        <div class="flex items-center gap-2 mb-3">
            <h3 class="font-semibold text-sm text-gray-800">
                Emails non vérifiés
            </h3>
            <Badge
                v-if="count > 0"
                class="bg-amber-600 text-white"
            >
                {{ count }}
            </Badge>
        </div>

        <div
            v-if="loading"
            class="h-48 rounded-md bg-gray-100 animate-pulse"
        />
        <template v-else-if="count === 0">
            <p class="text-sm text-gray-500 rounded-md border border-dashed p-4">
                Aucun email en attente de vérification.
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
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    type MarketingUnverifiedUser,
    useMarketingAnalytics,
} from '@/composables/useMarketingAnalytics';
import { formatRelativeDate } from '@/composables/useDate';
import { PERPAGE } from '~/lib/constants';

const { $toast } = useNuxtApp();
const { getUnverifiedEmails, resendVerification } = useMarketingAnalytics();

const loading = ref(true);
const users = ref<MarketingUnverifiedUser[]>([]);
const count = ref(0);
const page = ref(1);
const perPage = ref(PERPAGE);
const resendingId = ref<number | null>(null);

function accountTypeLabel(value: string): string {
    return value === 'institution' ? 'Institution' : 'Infirmière';
}

async function handleResend(user: MarketingUnverifiedUser) {
    if (!user.can_resend || resendingId.value === user.id) {
        return;
    }

    resendingId.value = user.id;

    try {
        const response = await resendVerification(user.id);
        $toast({
            title: 'Email envoyé',
            description: response.message,
        });
        await loadUsers();
    }
    catch {
        $toast({
            title: 'Erreur',
            description: 'Impossible d\'envoyer l\'email de vérification.',
            variant: 'destructive',
        });
    }
    finally {
        resendingId.value = null;
    }
}

const columns: ColumnDef<MarketingUnverifiedUser>[] = [
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
        cell: ({ row }) => h('div', accountTypeLabel(String(row.getValue('account_type')))),
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
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const user = row.original;

            const button = h(Button, {
                size: 'sm',
                variant: 'outline',
                class: 'rounded-md',
                disabled: !user.can_resend || resendingId.value === user.id,
                onClick: () => handleResend(user),
            }, () => resendingId.value === user.id ? 'Envoi…' : 'Relancer');

            if (user.can_resend) {
                return h('div', { class: 'flex justify-end' }, [button]);
            }

            return h(TooltipProvider, {}, () => h(Tooltip, {}, () => [
                h(TooltipTrigger, { asChild: true }, () => h('div', { class: 'flex justify-end' }, [button])),
                h(TooltipContent, {}, () => 'Disponible après 2 jours'),
            ]));
        },
        enableSorting: false,
    },
];

async function loadUsers() {
    loading.value = true;

    try {
        const response = await getUnverifiedEmails(page.value, perPage.value);
        users.value = response.users;
        count.value = response.count;
    } finally {
        loading.value = false;
    }
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

onMounted(() => {
    void loadUsers();
});
</script>
