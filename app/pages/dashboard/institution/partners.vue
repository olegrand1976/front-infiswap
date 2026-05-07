<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Recherche de binômes"
            :count="demandPartners.total"
        />

        <DashboardAdminPageContent class="flex flex-col min-h-[500px]">
            <!-- Filtres -->
            <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Codes postaux</label>
                    <TagsInput
                        v-model="searchFormData.postalCodeTags"
                        class="bg-white border-gray-200 focus-within:border-primary/50 transition-colors shadow-sm"
                    >
                        <TagsInputInput
                            v-model="postalCodeInput"
                            placeholder="Ex: 1000, 75000..."
                            @keydown.enter.prevent="addTag(postalCodeInput, searchFormData.postalCodeTags)"
                        />
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <TagsInputItem
                                v-for="item in searchFormData.postalCodeTags"
                                :key="item"
                                :value="item"
                            >
                                <TagsInputItemText />
                                <TagsInputItemDelete @click="removeTag(searchFormData.postalCodeTags, item)" />
                            </TagsInputItem>
                        </div>
                    </TagsInput>
                </div>

                <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Villes</label>
                    <TagsInput
                        v-model="searchFormData.cityTags"
                        class="bg-white border-gray-200 focus-within:border-primary/50 transition-colors shadow-sm"
                    >
                        <TagsInputInput
                            v-model="cityInput"
                            placeholder="Ex: Paris, Bruxelles..."
                            @keydown.enter.prevent="addTag(cityInput, searchFormData.cityTags)"
                        />
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <TagsInputItem
                                v-for="item in searchFormData.cityTags"
                                :key="item"
                                :value="item"
                            >
                                <TagsInputItemText />
                                <TagsInputItemDelete @click="removeTag(searchFormData.cityTags, item)" />
                            </TagsInputItem>
                        </div>
                    </TagsInput>
                </div>

                <div class="flex items-end gap-2">
                    <Button
                        class="flex-1 h-10 shadow-sm"
                        @click="search"
                    >
                        <Search class="w-4 h-4 mr-2" />
                        Rechercher
                    </Button>
                    <Button
                        variant="outline"
                        class="h-10 px-3 border-gray-200 hover:bg-gray-100 transition-colors"
                        title="Réinitialiser"
                        @click="reinitializeFilter"
                    >
                        <RefreshCw class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <DataTable
                :data="demandPartners.data"
                :columns="columns"
                :loading="loading"
            />

            <div class="mt-auto pt-6 border-t border-gray-100">
                <CustomPagination
                    v-if="demandPartners.total > 0"
                    :default-page="page"
                    :internal-per-page="perPage"
                    :total="demandPartners.total"
                    @update:page="changePage"
                    @update:per-page="changePerPage"
                />
            </div>
        </DashboardAdminPageContent>

        <!-- Detail Modal -->
        <Dialog v-model:open="detailDialog">
            <DialogContent class="sm:max-w-lg overflow-hidden border-none shadow-2xl p-0 bg-white">
                <div class="h-2 bg-primary w-full" />
                <DialogHeader class="px-6 pt-6 pb-2">
                    <DialogTitle class="text-2xl font-bold text-gray-900">
                        Détails du binôme
                    </DialogTitle>
                </DialogHeader>

                <div
                    v-if="selectedPartnership"
                    class="px-6 py-4 space-y-6"
                >
                    <!-- User Info Section -->
                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase border-2 border-white shadow-sm shrink-0">
                            {{ selectedPartnership.user.firstname[0] }}{{ selectedPartnership.user.lastname[0] }}
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-xl font-bold text-gray-900 truncate uppercase tracking-tight">
                                {{ selectedPartnership.user.firstname }} {{ selectedPartnership.user.lastname }}
                            </h3>
                            <p class="text-sm text-gray-500 font-medium">
                                <MapPin class="w-3.5 h-3.5 inline mr-1 text-primary/60" />
                                {{ selectedPartnership.user.city }} ({{ selectedPartnership.user.zip_code }})
                            </p>
                        </div>
                    </div>

                    <!-- Description Section -->
                    <div class="space-y-3">
                        <h4 class="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                            <Info class="w-4 h-4" />
                            Description de la recherche
                        </h4>
                        <div class="p-4 bg-white border border-gray-100 rounded-xl shadow-inner text-gray-700 italic leading-relaxed min-h-[100px] flex items-center justify-center text-center">
                            "{{ selectedPartnership.description || 'Aucune description fournie' }}"
                        </div>
                    </div>

                    <!-- Contact Buttons Section -->
                    <div class="grid grid-cols-2 gap-4">
                        <Button
                            as-child
                            class="rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                        >
                            <a
                                :href="`tel:${selectedPartnership.user.phone_number}`"
                                class="flex items-center justify-center gap-2 w-full"
                            >
                                <Phone class="w-5 h-5 shrink-0" />
                                Appeler
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            as-child
                            class="rounded-xl h-12 text-base font-semibold border-gray-200 hover:bg-gray-50 hover:scale-[1.02] transition-transform"
                        >
                            <a
                                :href="`mailto:${selectedPartnership.user.email}`"
                                class="flex items-center justify-center gap-2 w-full"
                            >
                                <Mail class="w-5 h-5 shrink-0" />
                                Email
                            </a>
                        </Button>
                    </div>

                    <div class="text-[10px] text-center text-gray-400 font-medium pt-2 italic">
                        Inscrit le {{ new Date(selectedPartnership.user.created_at).toLocaleDateString() }}
                    </div>
                </div>
                <div class="h-8 w-full" />
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { Eye, Info, Mail, MapPin, Phone, RefreshCw, Search, Star } from 'lucide-vue-next';

import type { ColumnDef } from '@tanstack/vue-table';
import { usePartners } from '@/composables/usePartners';
import type { UserPartner } from '~/lib/types';
import { PERPAGE } from '~/lib/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const selectedPartnership = ref<UserPartner | null>(null);
const detailDialog = ref(false);

const perPage = ref(PERPAGE);
const page = ref(1);

const { fetchDemandPartners, demandPartners, loading } = usePartners();

const postalCodeInput = ref('');
const cityInput = ref('');

const searchFormData = reactive({
    postalCodeTags: [] as string[],
    cityTags: [] as string[],
    type: 'admin', // Use admin type to get full info and broader search
});

const loadDemandPartners = async () => {
    await fetchDemandPartners(
        page.value,
        perPage.value,
        {
            zip_code: searchFormData.postalCodeTags.join(','),
            city: searchFormData.cityTags,
            type: searchFormData.type,
        },
    );
};

const handleShowDetail = (partnership: UserPartner) => {
    selectedPartnership.value = partnership;
    detailDialog.value = true;
};

const search = async () => {
    page.value = 1;
    await loadDemandPartners();
};

const reinitializeFilter = async () => {
    searchFormData.postalCodeTags = [];
    searchFormData.cityTags = [];
    page.value = 1;
    await loadDemandPartners();
};

const changePage = async (newPage: number) => {
    page.value = newPage;
    await loadDemandPartners();
};

const changePerPage = async (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    await loadDemandPartners();
};

const addTag = (inputRef: Ref<string>, tagArray: string[]) => {
    const value = inputRef.value.trim();
    if (value && !tagArray.includes(value)) {
        tagArray.push(value);
        inputRef.value = '';
    }
};

const removeTag = (tagArray: string[], tagToRemove: string) => {
    const index = tagArray.indexOf(tagToRemove);
    if (index !== -1) {
        tagArray.splice(index, 1);
    }
};

onMounted(async () => {
    await loadDemandPartners();
});

const columns: ColumnDef<UserPartner>[] = [
    {
        id: 'name',
        accessorFn: row => `${row.user.firstname} ${row.user.lastname}`,
        header: 'Nom de l\'infirmier',
        cell: ({ row }) => h('div', { class: 'font-semibold uppercase tracking-tight text-gray-900 ml-4' }, `${row.original.user.firstname} ${row.original.user.lastname}`),
    },
    {
        id: 'contact',
        header: 'Contact',
        cell: ({ row }) => {
            const user = row.original.user;
            return h('div', { class: 'space-y-1 ml-4 py-2' }, [
                user.phone_number
                    ? h('div', { class: 'flex items-center gap-2 text-xs font-medium text-gray-700' }, [
                            h(Phone, { class: 'w-3.5 h-3.5 text-primary/60' }),
                            h('span', user.phone_number),
                        ])
                    : null,
                user.email
                    ? h('div', { class: 'flex items-center gap-2 text-xs text-gray-500' }, [
                            h(Mail, { class: 'w-3.5 h-3.5 text-primary/40' }),
                            h('span', user.email),
                        ])
                    : null,
            ]);
        },
    },
    {
        id: 'location',
        header: 'Localisation',
        cell: ({ row }) => {
            const user = row.original.user;
            return h('div', { class: 'ml-4 flex items-center gap-1.5' }, [
                h(MapPin, { class: 'w-3.5 h-3.5 text-primary' }),
                h('div', [
                    h('span', { class: 'font-bold text-gray-800' }, user.zip_code),
                    h('span', { class: 'text-gray-400 ml-1.5' }, user.city),
                ]),
            ]);
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return h('div', { class: 'ml-4' }, [
                h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    class: 'text-primary font-bold hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/20 transition-all',
                    onClick: () => handleShowDetail(row.original),
                }, () => [
                    h(Eye, { class: 'w-4 h-4 mr-1.5' }),
                    'Détails',
                ]),
            ]);
        },
    },
];

useHead({ title: 'Binômes' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});
</script>
