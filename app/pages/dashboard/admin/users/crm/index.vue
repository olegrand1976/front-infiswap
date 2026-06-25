<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="CRM - Suivi utilisateurs - Suivi commercial" />
        <DashboardAdminPageContent>
            <Tabs
                v-model="selectedCrm"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="users"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi des utilisateurs
                    </TabsTrigger>
                    <TabsTrigger
                        value="commercial"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi commercial
                    </TabsTrigger>
                    <TabsTrigger
                        value="exUsers"
                        class="w-full md:w-48 h-12"
                    >
                        <span class="mr-2">Comptes supprimés</span>
                        <Badge v-if="trashCount > 0">
                            {{ trashCount }}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="w-[250px]"
                    :disabled="isListLoading"
                    @input="onFilterInput"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="numeric"
                    :disabled="isListLoading"
                    @input="onFilterInput"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    :disabled="isListLoading"
                    @input="onFilterInput"
                />
                <Select
                    v-model="option.insurance"
                    :disabled="isListLoading"
                    @update:model-value="onFilterSelect"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Nursassur</span>
                        <strong class="ml-4">
                            {{ option.insurance === 1 ? 'oui' : option.insurance === 0 ? 'non' : 'tous' }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="null">
                                <span class="ml-2">Tous</span>
                            </SelectItem>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    v-model="option.site"
                    :disabled="isListLoading"
                    @update:model-value="onFilterSelect"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>NursTech</span>
                        <strong class="ml-4">
                            {{ option.site === 1 ? 'oui' : option.site === 0 ? 'non' : 'tous' }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="null">
                                <span class="ml-2">Tous</span>
                            </SelectItem>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    v-model="option.days_without_contact"
                    :disabled="isListLoading"
                    @update:model-value="onFilterSelect"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Sans contact</span>
                        <strong class="ml-4">
                            {{ daysWithoutContactLabel }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="null">
                                <span class="ml-2">Tous</span>
                            </SelectItem>
                            <SelectItem :value="7">
                                <span class="ml-2">7+ jours</span>
                            </SelectItem>
                            <SelectItem :value="30">
                                <span class="ml-2">30+ jours</span>
                            </SelectItem>
                            <SelectItem :value="90">
                                <span class="ml-2">90+ jours</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md"
                    variant="outline"
                    :disabled="isListLoading"
                    @click="exportCurrentListCsv"
                >
                    <Download class="md:mr-2 size-4" />
                    <span class="hidden md:inline-block">Exporter CSV</span>
                </Button>
                <Button
                    class="rounded-md"
                    variant="outline"
                    :disabled="isListLoading"
                    @click="refreshData"
                >
                    <RefreshCw class="md:mr-2 size-4" />
                    <span class="hidden md:inline-block">Rafraîchir les données</span>
                </Button>
                <Button
                    class="rounded-md"
                    :disabled="isListLoading"
                    @click="resetFilter"
                >
                    <RefreshCw class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <div class="ml-4 my-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="tab in countryTabs"
                    :key="tab.value"
                    :class="[
                        'px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                        (tab.value === '' && option.country === '') || (tab.value !== '' && option.country === tab.value)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                    :disabled="isListLoading"
                    @click="setCountryFilter(tab.value)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <div
                v-if="isInitialLoad"
                class="px-4 space-y-3 mb-6"
                aria-busy="true"
                aria-label="Chargement de la liste CRM"
            >
                <div
                    v-for="i in 6"
                    :key="i"
                    class="flex flex-col gap-6"
                >
                    <Skeleton class="h-12 rounded-md bg-gray-50" />
                </div>
            </div>
            <div
                v-else
                class="relative"
            >
                <div
                    v-if="isListLoading"
                    class="absolute inset-0 z-10 flex items-start justify-center bg-background/70 pt-16"
                    aria-busy="true"
                    aria-label="Mise à jour de la liste CRM"
                >
                    <div class="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm shadow-sm">
                        <Loader2 class="size-4 animate-spin text-primary" />
                        <span>Chargement des utilisateurs…</span>
                    </div>
                </div>

                <div
                    v-if="showEmptyState"
                    class="mx-4 mb-6 rounded-md border border-dashed px-6 py-12 text-center"
                >
                    <p class="text-base font-medium text-foreground">
                        Aucun utilisateur trouvé
                    </p>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Ajustez les filtres ou cliquez sur Restaurer pour réinitialiser la recherche.
                    </p>
                </div>
                <template v-else-if="users">
                    <template v-if="selectedCrm === 'users'">
                        <CrmAdminList
                            :users="users"
                            :page="page"
                            :per-page="perPage"
                            @refresh-users="refreshUsers"
                            @handle-per-page-change="handlePerPageChange"
                            @set-sort="setSort"
                        />
                    </template>
                <template v-else-if="selectedCrm === 'commercial'">
                    <CrmSaleAdminList
                        :users="users"
                        :page="page"
                        :per-page="perPage"
                        @refresh-users="refreshUsers"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                        @user-updated="handleUserUpdate"
                    />
                </template>
                <template v-else-if="selectedCrm === 'exUsers'">
                    <CrmUserDeletedList
                        :users="users"
                        :page="page"
                        :per-page="perPage"
                        @refresh-users="refreshUsers"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                        @user-updated="handleUserUpdate"
                    />
                </template>
                </template>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { Download, Loader2, RefreshCw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { PERPAGE } from '~/lib/constants';
import { useCrm } from '@/composables/useCrm';
import { buildCrmCacheKey, getCrmUiState, hasCrmCacheEntry, saveCrmUiState } from '@/composables/useCrmCache';
import type { User } from '~/lib/types';

useHead({ title: 'Suivi utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const pageCookie = useCookie<number>('crm_page', {
    default: () => 1,
    maxAge: 60 * 60 * 24 * 7,
});

const perPageCookie = useCookie<number>('crm_per_page', {
    default: () => PERPAGE,
    maxAge: 60 * 60 * 24 * 7,
});

const selectedCrmCookie = useCookie<string>('crm_selected_tab', {
    default: () => 'users',
    maxAge: 60 * 60 * 24 * 7,
});

const selectedCrm = ref('users');
const isListLoading = ref(false);
const { getCrmPlus, users, trashCount, clearCrmCache, invalidateCrmCacheKey } = useCrm();
const route = useRoute();
const { $toast } = useNuxtApp();

const perPage = ref(perPageCookie.value);
const page = ref(pageCookie.value);
selectedCrm.value = selectedCrmCookie.value;

const countryTabs = [
    { label: 'Toutes', value: '' },
    { label: 'Belgique', value: 'be' },
    { label: 'France', value: 'fr' },
];

const emptyFilter = {
    name: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    country: '' as string,
    insurance: null as number | null,
    site: null as number | null,
    days_without_contact: null as number | null,
    deleted: false as boolean,
};

const initialFilter = {
    ...emptyFilter,
    name: (route.query.name as string) ?? null,
};

const option = ref({ ...initialFilter });

const sort = reactive({
    order: 'DESC' as 'ASC' | 'DESC',
    by: null as string | null,
});

if (import.meta.client && !route.query.name) {
    const savedUiState = getCrmUiState();
    if (savedUiState) {
        option.value = { ...savedUiState.option };
        sort.by = savedUiState.sort.by;
        sort.order = savedUiState.sort.order;
        if (savedUiState.selectedCrm) {
            selectedCrm.value = savedUiState.selectedCrm;
            selectedCrmCookie.value = savedUiState.selectedCrm;
        }
    }
}

watch(
    [option, () => ({ by: sort.by, order: sort.order }), selectedCrm],
    () => {
        saveCrmUiState({
            option: { ...option.value },
            sort: { by: sort.by, order: sort.order },
            selectedCrm: selectedCrm.value,
        });
    },
    { deep: true },
);

const daysWithoutContactLabel = computed(() => {
    const days = option.value.days_without_contact;
    if (days === 7) return '7+ jours';
    if (days === 30) return '30+ jours';
    if (days === 90) return '90+ jours';
    return 'tous';
});

const isInitialLoad = computed(() => users.value === null && isListLoading.value);

const showEmptyState = computed(() => {
    if (isListLoading.value || users.value === null) {
        return false;
    }

    return (users.value?.total ?? 0) === 0;
});

let fetchSequence = 0;

function buildCrmQueryParams(overrides: Record<string, unknown> = {}) {
    const params: Record<string, unknown> = {
        ...option.value,
        deleted: selectedCrm.value === 'exUsers',
        enrich: selectedCrm.value === 'users' ? 1 : 0,
        ...overrides,
    };

    if (sort.by) {
        params.sortKey = sort.by;
        params.sortOrder = sort.order;
    }

    ['insurance', 'site', 'days_without_contact', 'name', 'zip', 'city', 'country'].forEach((key) => {
        if (params[key] === null || params[key] === '') {
            delete params[key];
        }
    });

    return params;
}

type FetchCrmOptions = {
    force?: boolean;
};

async function fetchCrmUsers(
    pageNum = page.value,
    pageSize = perPage.value,
    overrides: Record<string, unknown> = {},
    fetchOptions: FetchCrmOptions = {},
) {
    const { force = false } = fetchOptions;
    const requestId = ++fetchSequence;
    const params = buildCrmQueryParams(overrides);
    const cacheKey = buildCrmCacheKey(pageNum, pageSize, params);
    const willUseCache = !force && hasCrmCacheEntry(cacheKey);

    if (!willUseCache) {
        isListLoading.value = true;
    }

    try {
        await getCrmPlus(pageNum, pageSize, { ...params, force });
    }
    catch {
        if (requestId === fetchSequence) {
            $toast({
                description: 'Impossible de charger la liste CRM. Réessayez.',
                variant: 'destructive',
            });
        }
    }
    finally {
        if (requestId === fetchSequence) {
            isListLoading.value = false;
        }
    }
}

async function refreshData() {
    clearCrmCache();
    await fetchCrmUsers(page.value, perPage.value, {}, { force: true });
}

const setCountryFilter = async (country: string) => {
    if (option.value.country === country || isListLoading.value) return;

    option.value.country = country;
    page.value = 1;
    pageCookie.value = 1;

    await fetchCrmUsers();
};

const debounce = (func: (...args: unknown[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: unknown[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const filterUsers = async () => {
    page.value = 1;
    pageCookie.value = 1;
    await fetchCrmUsers(1);
};

const debouncedFilterUsers = debounce(filterUsers, 300);

function onFilterInput() {
    debouncedFilterUsers();
}

function onFilterSelect() {
    if (isListLoading.value) return;

    void filterUsers();
}

await fetchCrmUsers();

const refreshUsers = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await fetchCrmUsers(newPage);
};

const handleUserUpdate = (updatedCrmObject: { user_id?: number; id?: number }) => {
    const index = users.value?.data.findIndex(u =>
        u.id === updatedCrmObject.user_id || u.crm?.id === updatedCrmObject.id,
    );
    if (index !== undefined && index !== -1 && users.value) {
        const existingUser = { ...users.value.data[index] };
        existingUser.crm = updatedCrmObject;
        users.value.data[index] = existingUser;
    }

    invalidateCrmCacheKey(page.value, perPage.value, buildCrmQueryParams());
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    perPageCookie.value = value;
    page.value = 1;
    pageCookie.value = 1;
    await fetchCrmUsers(1, value);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(emptyFilter);
    if (isSame) {
        return;
    }
    option.value = { ...emptyFilter };
    page.value = 1;
    pageCookie.value = 1;
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
    await fetchCrmUsers();
};

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = async (columnKey: string) => {
    if (sort.by === columnKey) toggleSort();
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }

    await fetchCrmUsers();
};

function exportUsersToCsv(rows: User[], filename: string) {
    if (!rows.length) {
        $toast({ description: 'Aucune donnée à exporter', variant: 'destructive' });
        return;
    }

    const headers = [
        'Nom',
        'Email',
        'Téléphone',
        'Code postal',
        'Ville',
        'NursAssur',
        'NursTech',
        'Dernier contact',
        'Mode contact',
        'Appels (sem.)',
        'Ventes (sem.)',
        'RDV (sem.)',
    ];

    const escape = (value: unknown) => {
        const str = value == null ? '' : String(value);
        return `"${str.replace(/"/g, '""')}"`;
    };

    const lines = [
        headers.join(';'),
        ...rows.map((user) => {
            const crm = user.crm ?? {};
            return [
                user.full_name,
                user.email,
                user.phone_number,
                user.zip_code,
                user.city,
                user.insurance ? 'oui' : 'non',
                user.site ? 'oui' : 'non',
                crm.last_contact_date ?? '',
                crm.last_contact_method ?? '',
                crm.nb_call ?? 0,
                crm.nb_sale ?? 0,
                crm.nb_meeting ?? 0,
            ].map(escape).join(';');
        }),
    ];

    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function exportCurrentListCsv() {
    const rows = users.value?.data ?? [];
    exportUsersToCsv(rows, `crm-export-${new Date().toISOString().slice(0, 10)}.csv`);
}

watch(selectedCrm, async (newValue) => {
    page.value = 1;
    pageCookie.value = 1;
    selectedCrmCookie.value = newValue;
    await fetchCrmUsers();
});
</script>
