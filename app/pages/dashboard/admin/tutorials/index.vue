<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Liste des tutoriels"
            :count="count"
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
            <div class="flex justify-end items-center space-x-4 pt-4 pb-4">
                <Select
                    v-model="option.media_type"
                    @update:model-value="debouncedFilterTutorials"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Type</span>
                        <span class="ml-4 font-medium">
                            {{
                                option.media_type === 'image' ? 'Image' : option.media_type === 'audio' ? 'Audio' : option.media_type === 'video' ? 'Vidéo': option.media_type === 'link' ? 'Lien' :'Tous'
                            }}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="'image'">
                                <span class="ml-2">Image</span>
                            </SelectItem>
                            <SelectItem :value="'audio'">
                                <span class="ml-2">Audio</span>
                            </SelectItem>
                            <SelectItem :value="'video'">
                                <span class="ml-2">Vidéo</span>
                            </SelectItem>
                            <SelectItem :value="'link'">
                                <span class="ml-2">Lien</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md !mr-4"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

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

            <Dialog v-model:open="showDialog">
                <DialogContent class="w-[70vw] h-[30rem]">
                    <DialogHeader>
                        <DialogTitle>
                            Aperçu
                        </DialogTitle>
                    </DialogHeader>

                    <video
                        v-if="selectedTutorial.media_type == 'video'"
                        controls
                        class="w-[70vw] h-[24rem]"
                    >
                        <source :src="baseUrl + selectedTutorial.media_path">
                        Votre navigateur ne prend pas en charge la vidéo.
                    </video>

                    <img
                        v-else-if="selectedTutorial.media_type == 'image'"
                        :src="baseUrl + selectedTutorial.media_path"
                        alt="Ressource media"
                        class="object-cover w-full h-[24rem]"
                    >

                    <audio
                        v-else-if="selectedTutorial.media_type == 'audio'"
                        controls
                        class="w-[70vw] h-[24rem]"
                    >
                        <source :src="baseUrl + selectedTutorial.media_path">
                        Votre navigateur ne prend pas en charge l'audio.
                    </audio>
                </DialogContent>
            </Dialog>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { PERPAGE } from '~/lib/constants';
import { Button } from '@/components/ui/button';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { useTutorials } from '@/composables/useTutorials';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { useRuntimeConfig } from '#app';
import type { Tutorial } from '~/lib/types';
import { getErrorMessage } from '~/lib/utils';

const { tutorials, count, fetchTutorials, deleteTutorial } = useTutorials();
const { isSuperAdmin } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);
const config = useRuntimeConfig();
const router = useRouter();
const { $toast } = useNuxtApp();
const baseUrl = config.public.API_URL + '/storage/';

const mediaTypes = {
    video: 'Video',
    image: 'Image',
    audio: 'Audio',
    link: 'Lien',
};

const initialFilter = {
    media_type: null,
};

const option = ref({ ...initialFilter });

const debounce = (func, delay) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const filterTutorials = async () => {
    const currentFilter = { ...option.value };
    await fetchTutorials(page.value, perPage.value, currentFilter);
};

const debouncedFilterTutorials = debounce(filterTutorials, 100);

const selectedTutorial = ref<Tutorial>(null);
const showDialog = ref(false);

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
        accessorKey: 'media_path',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('media_path'),
            }, () => ['Ressource', h(ArrowsUpDownIcon, {})]);
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
            return h('div', { class: 'text-start ml-4' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: () => {
            return h('div', { class: 'mx-2' }, 'Actions');
        },
        enableHiding: false,
        cell: ({ row }) => {
            const tutorial = row.original;

            const actions = [
                tutorial.media_type === 'link'
                    ? {
                            label: 'Ouvrir le lien',
                            onClick: () => {
                                if (tutorial.media_path) {
                                    window.open(tutorial.media_path, '_blank');
                                }
                            },
                        }
                    : {
                            label: 'Aperçu',
                            onClick: () => handleShow(tutorial),
                        },
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(tutorial),
                },
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(tutorial),
                            },
                        ]
                    : []),
            ];

            return h('div', { class: 'flex justify-start ml-4' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
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

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await fetchTutorials(page.value, perPage.value, option.value);
};

const handleShow = (tutorial: Tutorial) => {
    selectedTutorial.value = tutorial;
    showDialog.value = true;
};

const handleEdit = (tutorial: Tutorial) => {
    router.push(`/dashboard/admin/tutorials/${tutorial.id}`);
};

const handleDelete = async (tutorial: Tutorial) => {
    try {
        const result = await deleteTutorial(tutorial.id);
        if (result) {
            $toast({
                description: result.message,
            });

            await fetchTutorials(page.value, perPage.value);
        }
    }
    catch (error) {
        $toast({
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
};

useHead({ title: 'Gestion des tutoriels' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
