<template>
    <div>
        <DataTable
            :columns="columns"
            :data="replacements"
            :loading="loading"
            @row-click="handleRowClick"
        />

        <CustomPagination
            :default-page="page"
            :per-page="perPage"
            :total="count"
            @update:page="refresh"
            @update:per-page="changePerPage"
        />

        <Dialog v-model:open="showModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Les personnes intéressées
                    </DialogTitle>
                </DialogHeader>
                <div v-if="selected">
                    <ul class="mt-4 list-disc ml-5 space-y-2">
                        <li
                            v-for="res in selected.responses"
                            :key="res.id"
                        >
                            <UsersName
                                v-if="getRespondedUser(res)"
                                :user="getRespondedUser(res)"
                                class="font-medium text-gray-800"
                            />
                            <span
                                v-else
                                class="font-medium text-gray-800"
                            >
                                {{ res.respondent?.full_name ?? 'Institution' }}
                            </span>
                        </li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { Eye } from 'lucide-vue-next';
import { NuxtLink } from '#components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ReplacementResponse, ReplacementRow, User } from '~/lib/types';

const replacements = ref([]);
const selected = ref<ReplacementRow | null>(null);
const showModal = ref(false);
const loading = ref(false);
const page = ref(1);
const perPage = ref(10);
const count = ref(0);

const { $apifetch } = useNuxtApp();

const fetchData = async () => {
    loading.value = true;
    try {
        const { data, count: total } = await $apifetch('/api/replacements/interest/responses', {
            method: 'GET',
            query: { page: page.value, perPage: perPage.value },
        });
        replacements.value = data;
        count.value = total;
    }
    catch (e) {
        console.error('Erreur de chargement :', e);
    }
    finally {
        loading.value = false;
    }
};

const refresh = (newPage: number) => {
    page.value = newPage;
    fetchData();
};

const changePerPage = (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    fetchData();
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Date invalide';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const handleRowClick = (row: { original: ReplacementRow } | ReplacementRow) => {
    selected.value = 'original' in row ? row.original : row;
    showModal.value = true;
};

const getRespondedUser = (response: ReplacementResponse): User | null => {
    if (response.respondent?.type === 'user') {
        return response.respondent;
    }

    return null;
};

const columns = [
    {
        header: () =>
            h(
                'div',
                { class: 'text-center flex items-center justify-center', style: { minHeight: '40px' } },
                'Période',
            ),
        accessorKey: 'replacement',
        cell: ({ row }: { row: { original: ReplacementRow } }) => {
            const startDate = row.original.replacement?.start_date;
            const endDate = row.original.replacement?.end_date;

            const formattedStart = startDate ? formatDate(startDate) : '-';
            const formattedEnd = endDate ? formatDate(endDate) : '-';

            return h(
                'div',
                { class: 'text-center flex items-center justify-center', style: { minHeight: '40px' } },
                `${formattedStart} - ${formattedEnd}`,
            );
        },
    },
    {
        header: () =>
            h(
                'div',
                { class: 'text-center flex items-center justify-center', style: { minHeight: '40px' } },
                'Plage horaire',
            ),
        accessorKey: 'replacement.time_slot',
        cell: ({ row }: { row: { original: ReplacementRow } }) => {
            const timeSlot = row.original.replacement?.timeSlot;

            if (!timeSlot) {
                return h('span', { class: 'text-center block text-gray-400', style: { minHeight: '40px' } }, '—');
            }

            let parsedTimeSlot;
            try {
                parsedTimeSlot = typeof timeSlot === 'string' ? JSON.parse(timeSlot) : timeSlot;
            }
            catch {
                return h('span', { class: 'text-center block text-red-500', style: { minHeight: '40px' } }, 'Erreur ');
            }

            const format = (start: string, end: string) => `${start} - ${end}`;

            const ranges: string[] = [];

            if (parsedTimeSlot.start_at && parsedTimeSlot.end_at) {
                ranges.push(format(parsedTimeSlot.start_at, parsedTimeSlot.end_at));
            }
            else {
                for (const key in parsedTimeSlot) {
                    const slot = parsedTimeSlot[key];
                    if (slot?.start_at && slot?.end_at) {
                        ranges.push(format(slot.start_at, slot.end_at));
                    }
                }
            }

            return h(
                'span',
                { class: 'text-center block', style: { minHeight: '40px' } },
                ranges.join(' / '),
            );
        },
    },
    {
        header: 'Créé par',
        accessorKey: 'replacement.user.full_name',
        cell: ({ row }: { row: { original: ReplacementRow } }) =>
            h('div', { style: { minHeight: '40px' } }, row.original.replacement?.user_owner_full_name ?? '—'),
    },
    {
        header: 'Type',
        accessorKey: 'replacement.type',
        cell: ({ row }: { row: { original: ReplacementRow } }) => {
            const type = row.original.replacement?.type;
            if (type === 'immediate') {
                return h(
                    'span',
                    {
                        class: 'inline-block px-2 py-2 text-white text-xs font-bold rounded bg-red-500',
                    },
                    'URGENT',
                );
            }
            return h('span', { style: { minHeight: '40px' } }, '');
        },
    },
    {
        header: 'Réponses',
        accessorKey: 'responses_count',
        cell: ({ row }: { row: { original: ReplacementRow } }) =>
            h(
                'button',
                {
                    class: 'text-blue-600 hover:underline',
                    onClick: () => handleRowClick(row),
                    style: { minHeight: '40px' },
                },
                `${row.original.responses_count ?? 0} réponses`,
            ),
    },
    {
        header: () =>
            h(
                'div',
                { class: 'flex justify-center items-center', style: { minHeight: '40px' } },
                'Détail',
            ),
        accessorKey: 'action',
        cell: ({ row }: { row: { original: ReplacementRow } }) =>
            h(
                'div',
                { class: 'flex justify-center items-center', style: { minHeight: '40px' } },
                [
                    h(
                        NuxtLink,
                        {
                            to: `/dashboard/admin/replacements/${row.original.replacement?.id}`,
                            class: 'text-gray-600 hover:text-black',
                        },
                        {
                            default: () =>
                                h(Eye, {
                                    class: 'w-5 h-5',
                                }),
                        },
                    ),
                ],
            ),
    },
];

onMounted(fetchData);
</script>
