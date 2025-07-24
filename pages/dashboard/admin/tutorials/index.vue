<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Liste des tutoriels"
        >
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/tutorials/create"
                >
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <DataTable
                :data="dataTutorials"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refreshTutorials"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid';
import { PERPAGE } from '~/lib/constants';
import { Button } from '@/components/ui/button';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { useTutorials } from '@/composables/useTutorials';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { useRuntimeConfig } from '#app';
import type { Tutorial } from '~/lib/types';

const { tutorials, count, fetchTutorials } = useTutorials();

const perPage = ref(PERPAGE);
const page = ref(1);
const option = ref({});
const config = useRuntimeConfig();

const mediaTypes = {
    video: 'Video',
    image: 'Image',
    audio: 'Audio',
    link: 'Lien',
};

await fetchTutorials(page.value, perPage.value, option.value);

const dataTutorials = computed(() => tutorials.value ?? []);

const refreshTutorials = async (page: number) => {
    await fetchTutorials(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await fetchTutorials(page.value, value, option.value);
};

const columns: ColumnDef<Tutorial>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : false,
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
            'class': 'mx-2',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
            'class': 'mx-2',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('title'),
            }, () => ['Titre', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('title')),
    },
    {
        accessorKey: 'media_path',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('media_path'),
            }, () => ['Chemin', h(ArrowsUpDownIcon, {})]);
        },
        cell: ({ row }) => {
            const mediaPath: string = row.getValue('media_path');
            const mediaType = row.getValue('media_type');
            const baseUrl = config.public.API_URL + '/storage/';

            if (mediaType === 'link') {
                return h('div', { class: 'ml-4' }, mediaPath);
            }

            const src = baseUrl + mediaPath;

            if (mediaType === 'image') {
                return h('img', {
                    src,
                    class: 'w-12 h-12 ml-4 object-cover rounded',
                });
            }

            if (mediaType === 'video') {
                return h('video', {
                    src,
                    class: 'w-12 h-12 object-cover rounded ml-4',
                    controls: false,
                    muted: true,
                    autoplay: false,
                    preload: 'metadata',
                });
            }

            if (mediaType === 'audio') {
                return h('div', { class: 'flex flex-col ml-4 items-center w-20' }, [
                    h('audio', {
                        src,
                        controls: true,
                        class: 'w-full',
                    }),
                    h('span', {}, 'Audio'),
                ]);
            }
            return h('div', {}, mediaPath);
        },
    },
    {
        accessorKey: 'media_type',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('media_type'),
            }, () => ['Type', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const key: string = row.getValue('media_type');
            return h('div', { class: 'ml-4' }, mediaTypes[key] || key);
        },
    },
    {
        accessorKey: 'mimes_type',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('mimes_type'),
            }, () => ['Extension MIME', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'ml-4' }, row.getValue('mimes_type') || '-');
        },
    },
    {
        accessorKey: 'description',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('description'),
            }, () => ['Description', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'ml-4' }, row.getValue('description'));
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
];

const sort = reactive({
    order: 'DESC',
    by: null,
});

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
};

watch(
    () => sort,
    async (newVal) => {
        await fetchTutorials(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

useHead({ title: 'Gestion des tutoriels' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
