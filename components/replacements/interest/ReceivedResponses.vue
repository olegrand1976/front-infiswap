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
                        Détails du remplacement #{{ selected?.replacement?.id }}
                    </DialogTitle>
                </DialogHeader>

                <div v-if="selected">
                    <p><strong>Créé par :</strong> {{ selected.replacement.user?.full_name }}</p>
                    <p><strong>Type :</strong> {{ selected.replacement?.type }}</p>
                    <p><strong>Nombre de réponses :</strong> {{ selected.responses?.length }}</p>

                    <ul class="mt-4 list-disc ml-5 space-y-2">
                        <li
                            v-for="res in selected.responses"
                            :key="res.id"
                        >
                            <span class="font-semibold">{{ res.responded_by?.full_name }}</span>
                            <small class="text-gray-500"> ({{ formatDate(res.created_at) }}) </small>
                        </li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { NuxtLink } from '#components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ReplacementRow } from '~/lib/types';

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

const columns = [
    {
        header: () =>
            h(
                'div',
                { class: 'text-center flex items-center justify-center h-full' },
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
                { class: 'text-center flex items-center justify-center h-full' },
                `${formattedStart} - ${formattedEnd}`,
            );
        },
    },
    {
        header: () =>
            h(
                'div',
                { class: 'text-center flex items-center justify-center h-full' },
                'Plage horaire',
            ),
        accessorKey: 'replacement.time_slot',
        cell: ({ row }: { row: { original: ReplacementRow } }) => {
            const timeSlot = row.original.replacement?.timeSlot;

            if (!timeSlot) {
                return h('span', { class: 'text-center block text-gray-400' }, '—');
            }

            let parsedTimeSlot;
            try {
                parsedTimeSlot = typeof timeSlot === 'string' ? JSON.parse(timeSlot) : timeSlot;
            }
            catch (e) {
                return h('span', { class: 'text-center block text-red-500' }, 'Erreur ');
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
                { class: 'text-center block' },
                ranges.join(' / '),
            );
        },
    },
    {
        header: 'Créé par',
        accessorKey: 'replacement.user.full_name',
        cell: ({ row }: { row: { original: ReplacementRow } }) =>
            row.original.replacement?.user_owner_full_name ?? '—',
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
                        class: 'inline-block px-2 py-1 text-white text-xs font-bold rounded bg-red-500',
                    },
                    'URGENT',
                );
            }
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
                },
                `${row.original.responses_count ?? 0}`,
            ),
    },
    {
        header: () =>
            h(
                'div',
                { class: 'flex justify-center items-center' },
                'Détail',
            ),
        accessorKey: 'action',
        cell: ({ row }: { row: { original: ReplacementRow } }) =>
            h(
                'div',
                { class: 'flex justify-center items-center h-full' },
                [
                    h(
                        NuxtLink,
                        {
                            to: `/dashboard/admin/replacements/${row.original.replacement?.id}`,
                            class: 'text-gray-600 hover:text-black',
                        },
                        {
                            default: () =>
                                h(EyeIcon, {
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
