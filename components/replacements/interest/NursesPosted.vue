<template>
    <div class="space-y-6">
        <DataTable
            :columns="columns"
            :data="data"
        />

        <CustomPagination
            :default-page="page"
            :per-page="perPage"
            :total="count"
            @update:page="refresh"
            @update:per-page="handlePerPageChange"
        />

        <Dialog v-model:open="showModal">
            <DialogContent class="max-w-[90vw] lg:max-w-4xl">
                <DialogHeader>
                    <DialogTitle class="text-center">
                        Détails des remplacements
                    </DialogTitle>
                </DialogHeader>

                <div
                    v-if="selectedNurse"
                    class="p-4 max-h-[70vh] overflow-y-auto"
                >
                    <table class="w-full text-base border border-gray-300 rounded-lg overflow-hidden">
                        <thead class="bg-gray-100 sticky top-0">
                            <tr>
                                <th class="border p-3 text-left min-w-[120px]">
                                    Codes postaux
                                </th>
                                <th class="border p-3 text-left min-w-[150px]">
                                    Ville(s)
                                </th>
                                <th class="border p-3 text-left min-w-[100px]">
                                    Du
                                </th>
                                <th class="border p-3 text-left min-w-[100px]">
                                    Au
                                </th>
                                <th class="border p-3 text-left w-20">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="replacement in selectedNurse.replacements"
                                :key="replacement.id"
                                class="h-16 even:bg-gray-50 hover:bg-gray-100"
                            >
                                <td class="border p-3">
                                    {{ replacement.zip_codes.replace(/[\[\]"]/g, '') }}
                                </td>
                                <td class="border p-3">
                                    {{ replacement.cities.replace(/[\[\]"]/g, '') }}
                                </td>
                                <td class="border p-3">
                                    {{ formatDate(replacement.start_date) }}
                                </td>
                                <td class="border p-3">
                                    {{ formatDate(replacement.end_date) }}
                                </td>
                                <td class="border p-3 text-center">
                                    <NuxtLink
                                        :to="`/dashboard/admin/replacements/${replacement.id}`"
                                        class="inline-flex items-center justify-center size-8 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors mx-auto"
                                        title="Voir détails"
                                    >
                                        <EyeIcon class="size-5 text-blue-600" />
                                    </NuxtLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, onMounted } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, EyeIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UsersName from '@/components/users/Name.vue';
import type { User } from '~/lib/types';

const { data, count, nursesPosted } = useReplacements();

const perPage = ref(PERPAGE);
const page = ref(1);
const sort = reactive({ order: 'DESC', by: null as string | null });
const selectedNurse = ref(null);
const showModal = ref(false);

const refresh = async (newPage: number) => {
    page.value = newPage;
    await nursesPosted(page.value, perPage.value, {
        sortKey: sort.by,
        sortOrder: sort.order,
    });
};

const handlePerPageChange = async (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    await refresh(page.value);
};

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = (columnKey: string) => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }
    refresh(page.value);
};

const openModal = (row: any) => {
    selectedNurse.value = row;
    showModal.value = true;
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString();
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'user.full_name',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('user.full_name') }, () => [
                'Nom',
                h(ArrowsUpDownIcon, { class: 'w-4 h-4 ml-2' }),
            ]),
        cell: info => h('div', { class: 'py-2 ml-3' }, [h(UsersName, { user: info.row.original.user })]),
    },
    {
        accessorKey: 'user.email',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('user.email') }, () => [
                'Email',
                h(ArrowsUpDownIcon, { class: 'w-4 h-4 ml-2' }),
            ]),
        cell: info => h('div', { class: 'py-2' }, info.getValue() as string),
    },
    {
        accessorKey: 'user.phone_number',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('user.phone_number') }, () => [
                'Téléphone',
                h(ArrowsUpDownIcon, { class: 'w-4 h-4 ml-2' }),
            ]),
        cell: info => h('div', { class: 'py-2' }, info.getValue() as string),
    },
    {
        accessorKey: 'total_posted',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('total_posted') }, () => [
                'Nb. remplacements postés',
                h(ArrowsUpDownIcon, { class: 'w-4 h-4 ml-2' }),
            ]),
        cell: info => {
            const row = info.row.original;
            return h('div', { class: 'py-2' }, [
                h(
                    'button',
                    {
                        class: 'text-blue-600 hover:underline',
                        onClick: () => openModal(row),
                    },
                    `${info.getValue()} posté(s)`,
                ),
            ]);
        },
    },
];

onMounted(() => {
    refresh(page.value);
});
</script>
