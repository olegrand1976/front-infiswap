<template>
    <div class="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <DashboardAdminPageHeader
            as="div"
            class="shrink-0"
            title="CRM - Suivi infirmières"
        >
            <template
                v-if="isInstitutionsTab && canImportInstitutions"
                #action
            >
                <Button
                    class="rounded-md"
                    variant="outline"
                    @click="importDialogOpen = true"
                >
                    <Upload class="md:mr-2 size-4" />
                    <span class="hidden md:inline-block">Importer</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent class="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Tabs
                v-model="selectedCrm"
                class="mb-4 shrink-0"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="users"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi des infirmières
                    </TabsTrigger>
                    <TabsTrigger
                        value="institutions"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi des institutions
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
            <CrmActivityKpiCards
                v-if="selectedCrm !== 'exUsers'"
                :kpis="crmKpis"
                :scope="isInstitutionsTab ? 'institutions' : 'users'"
                :loading="kpiLoading"
            />
            <div class="flex shrink-0 gap-3 items-center overflow-x-auto p-4 px-4 pb-3 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par nom"
                    class="w-[250px]"
                    :disabled="isListLoading"
                    @input="onFilterInput"
                />
                <div class="flex items-center gap-1 shrink-0">
                    <InputIcon
                        v-model="option.zip"
                        rounded="md"
                        placeholder="Code postal"
                        class="w-[220px]"
                        type="text"
                        inputmode="text"
                        :disabled="isListLoading"
                        @input="onFilterInput"
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <button
                                    type="button"
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-input text-sm font-semibold text-muted-foreground hover:bg-muted"
                                    aria-label="Aide filtre code postal"
                                >
                                    ?
                                </button>
                            </TooltipTrigger>
                            <TooltipContent class="max-w-xs">
                                <p>Ajoutez * à la fin pour filtrer par début de code postal.</p>
                                <p>Exemple : 5* affiche tous les codes commençant par 5.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
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
                            <SelectItem value="all">
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
                            <SelectItem value="all">
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
                            <SelectItem value="all">
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
                <Select
                    v-if="isInstitutionsTab"
                    v-model="option.registration_source"
                    :disabled="isListLoading"
                    @update:model-value="onFilterSelect"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Source</span>
                        <strong class="ml-4">{{ registrationSourceLabel }}</strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">
                                <span class="ml-2">Tous</span>
                            </SelectItem>
                            <SelectItem value="site">
                                <span class="ml-2">Site</span>
                            </SelectItem>
                            <SelectItem value="file">
                                <span class="ml-2">Fichier</span>
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

            <div class="ml-4 my-2 flex shrink-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                class="mb-6 shrink-0 space-y-3 px-4"
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
                class="relative flex min-h-0 flex-1 flex-col overflow-hidden"
            >
                <div
                    v-if="isListLoading"
                    class="absolute inset-0 z-10 flex items-start justify-center bg-background/70 pt-16"
                    aria-busy="true"
                    aria-label="Mise à jour de la liste CRM"
                >
                    <div class="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm shadow-sm">
                        <Loader2 class="size-4 animate-spin text-primary" />
                        <span>{{ isInstitutionsTab ? 'Chargement des institutions…' : 'Chargement des utilisateurs…' }}</span>
                    </div>
                </div>

                <div
                    v-if="listLoadError"
                    class="mx-4 mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
                >
                    <p class="text-base font-medium text-foreground">
                        {{ isInstitutionsTab ? 'Impossible de charger les institutions' : 'Impossible de charger la liste CRM' }}
                    </p>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Vérifiez votre connexion puis réessayez.
                    </p>
                    <Button
                        class="mt-4 rounded-md"
                        :disabled="isListLoading"
                        @click="retryListLoad"
                    >
                        Réessayer
                    </Button>
                </div>
                <div
                    v-else-if="showEmptyState"
                    class="mx-4 mb-6 rounded-md border border-dashed px-6 py-12 text-center"
                >
                    <p class="text-base font-medium text-foreground">
                        {{ isInstitutionsTab ? 'Aucune institution trouvée' : 'Aucune infirmière trouvée' }}
                    </p>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Ajustez les filtres ou cliquez sur Restaurer pour réinitialiser la recherche.
                    </p>
                </div>
                <template v-else-if="isInstitutionsTab">
                    <CrmInstitutionAdminList
                        v-if="institutions"
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
                        :institutions="institutions"
                        :page="page"
                        :per-page="perPage"
                        @refresh-institutions="refreshInstitutions"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                        @update-institutions="handleInstitutionsListUpdate"
                    />
                </template>
                <template v-else-if="users">
                    <template v-if="selectedCrm === 'users'">
                        <CrmAdminList
                            class="flex min-h-0 flex-1 flex-col overflow-hidden"
                            :users="users"
                            :page="page"
                            :per-page="perPage"
                            @refresh-users="refreshUsers"
                            @handle-per-page-change="handlePerPageChange"
                            @set-sort="setSort"
                            @update-users="handleUsersListUpdate"
                        />
                    </template>
                <template v-else-if="selectedCrm === 'exUsers'">
                    <CrmUserDeletedList
                        class="flex min-h-0 flex-1 flex-col overflow-hidden"
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

        <Dialog v-model:open="importDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importer des institutions</DialogTitle>
                    <DialogDescription>
                        Fichier Excel (.xlsx) avec les colonnes Nom, Ville, Email, Téléphone, Adresse, Code postal.
                    </DialogDescription>
                </DialogHeader>
                <FileUpload
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    :max-size="10 * 1024 * 1024"
                    @update:model-value="importFile = $event"
                />
                <DialogFooter>
                    <Button
                        variant="outline"
                        class="rounded-md"
                        @click="importDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        class="rounded-md"
                        :disabled="!importFile || importing"
                        @click="handleImport"
                    >
                        {{ importing ? 'Import en cours…' : 'Importer' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <CrmCommercialProfileDialog />
    </div>
</template>

<script setup lang="ts">
import { Download, Loader2, RefreshCw, Upload } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PERPAGE } from '~/lib/constants';
import { useCrm, type CrmActivityKpis } from '@/composables/useCrm';
import CrmActivityKpiCards from '@/components/crm/CrmActivityKpiCards.vue';
import { buildCrmCacheKey, getCrmUiState, hasCrmCacheEntry, saveCrmUiState } from '@/composables/useCrmCache';
import type { CrmInstitution, User } from '~/lib/types';
import FileUpload from '~/components/ui/file-upload/FileUpload.vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInstitutions } from '@/composables/useInstitution';
import { useAuth } from '@/composables/useAuth';

useHead({ title: 'Suivi infirmières' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
    ssr: false,
});

const route = useRoute();

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
const kpiLoading = ref(false);
const crmKpis = ref<CrmActivityKpis | null>(null);
const listLoadError = ref(false);
const { getCrmPlus, getCrmInstitutions, getCrmKpis, users, institutions, trashCount, clearCrmCache, invalidateCrmCacheKey } = useCrm();
const { importInstitutions } = useInstitutions();
const { canImportInstitutions } = useAuth();
const importDialogOpen = ref(false);
const importFile = ref<File | null>(null);
const importing = ref(false);

const perPage = ref(perPageCookie.value);
const page = ref(pageCookie.value);
selectedCrm.value = selectedCrmCookie.value === 'commercial' ? 'users' : selectedCrmCookie.value;
if (selectedCrmCookie.value === 'commercial') {
    selectedCrmCookie.value = 'users';
}

const countryTabs = [
    { label: 'Toutes', value: '' },
    { label: 'Belgique', value: 'be' },
    { label: 'France', value: 'fr' },
];

const CRM_FILTER_ALL = 'all' as const;

const emptyFilter = {
    name: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    country: '' as string,
    insurance: CRM_FILTER_ALL as typeof CRM_FILTER_ALL | 0 | 1,
    site: CRM_FILTER_ALL as typeof CRM_FILTER_ALL | 0 | 1,
    days_without_contact: CRM_FILTER_ALL as typeof CRM_FILTER_ALL | 7 | 30 | 90,
    registration_source: CRM_FILTER_ALL as typeof CRM_FILTER_ALL | 'site' | 'file',
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
        option.value = {
            ...savedUiState.option,
            insurance: savedUiState.option.insurance ?? CRM_FILTER_ALL,
            site: savedUiState.option.site ?? CRM_FILTER_ALL,
            days_without_contact: savedUiState.option.days_without_contact ?? CRM_FILTER_ALL,
            registration_source: savedUiState.option.registration_source ?? CRM_FILTER_ALL,
        };
        sort.by = savedUiState.sort.by;
        sort.order = savedUiState.sort.order;
        if (savedUiState.selectedCrm) {
            const restoredTab = savedUiState.selectedCrm === 'commercial' ? 'users' : savedUiState.selectedCrm;
            selectedCrm.value = restoredTab;
            selectedCrmCookie.value = restoredTab;
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

const registrationSourceLabel = computed(() => {
    switch (option.value.registration_source) {
        case 'site':
            return 'Site';
        case 'file':
            return 'Fichier';
        default:
            return 'tous';
    }
});

const isInstitutionsTab = computed(() => selectedCrm.value === 'institutions');

const isInitialLoad = computed(() => {
    if (isInstitutionsTab.value) {
        return institutions.value === null && isListLoading.value;
    }

    return users.value === null && isListLoading.value;
});

const showEmptyState = computed(() => {
    if (isListLoading.value) {
        return false;
    }

    if (isInstitutionsTab.value) {
        return institutions.value !== null && (institutions.value?.total ?? 0) === 0;
    }

    return users.value !== null && (users.value?.total ?? 0) === 0;
});

let fetchSequence = 0;

function buildCrmQueryParams(overrides: Record<string, unknown> = {}) {
    const params: Record<string, unknown> = {
        ...option.value,
        ...overrides,
    };

    if (isInstitutionsTab.value) {
        params.enrich = 1;
        delete params.deleted;
    }
    else {
        params.deleted = selectedCrm.value === 'exUsers';
        params.enrich = selectedCrm.value === 'exUsers' ? 0 : 1;
    }

    if (sort.by) {
        params.sortKey = sort.by;
        params.sortOrder = sort.order;
    }

    ['insurance', 'site', 'days_without_contact', 'registration_source', 'name', 'zip', 'city', 'country'].forEach((key) => {
        if (params[key] === null || params[key] === '' || params[key] === CRM_FILTER_ALL) {
            delete params[key];
        }
    });

    return params;
}

async function fetchCrmKpis(params: Record<string, unknown>) {
    if (selectedCrm.value === 'exUsers') {
        crmKpis.value = null;
        return;
    }

    kpiLoading.value = true;
    try {
        const scope = isInstitutionsTab.value ? 'institutions' : 'users';
        crmKpis.value = await getCrmKpis(scope, params);
    }
    catch {
        crmKpis.value = null;
    }
    finally {
        kpiLoading.value = false;
    }
}

type FetchCrmOptions = {
    force?: boolean;
};

async function fetchCrmList(
    pageNum = page.value,
    pageSize = perPage.value,
    overrides: Record<string, unknown> = {},
    fetchOptions: FetchCrmOptions = {},
) {
    const { force = false } = fetchOptions;
    const requestId = ++fetchSequence;
    const params = buildCrmQueryParams(overrides);
    const entity = isInstitutionsTab.value ? 'institutions' : 'users';
    const cacheKey = buildCrmCacheKey(pageNum, pageSize, params, entity);
    const willUseCache = !force && hasCrmCacheEntry(cacheKey);

    if (!willUseCache) {
        isListLoading.value = true;
    }

    try {
        if (isInstitutionsTab.value) {
            await getCrmInstitutions(pageNum, pageSize, { ...params, force });
        }
        else {
            await getCrmPlus(pageNum, pageSize, { ...params, force });
        }

        if (requestId === fetchSequence) {
            listLoadError.value = false;
            await fetchCrmKpis(params);
        }
    }
    catch {
        if (requestId === fetchSequence) {
            listLoadError.value = true;
            $toast({
                description: isInstitutionsTab.value
                    ? 'Impossible de charger la liste des institutions. Réessayez.'
                    : 'Impossible de charger la liste CRM. Réessayez.',
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
    await fetchCrmList(page.value, perPage.value, {}, { force: true });
}

const handleImport = async () => {
    if (!importFile.value) return;

    importing.value = true;
    try {
        await importInstitutions(importFile.value);
        importDialogOpen.value = false;
        importFile.value = null;
        clearCrmCache();
        await fetchCrmList(page.value, perPage.value, {}, { force: true });
    }
    catch (error) {
        console.error('Erreur lors de l\'import:', error);
    }
    finally {
        importing.value = false;
    }
};

const setCountryFilter = async (country: string) => {
    if (option.value.country === country || isListLoading.value) return;

    option.value.country = country;
    page.value = 1;
    pageCookie.value = 1;

    await fetchCrmList();
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
    await fetchCrmList(1);
};

const debouncedFilterUsers = debounce(filterUsers, 300);

function onFilterInput() {
    debouncedFilterUsers();
}

function onFilterSelect() {
    if (isListLoading.value) return;

    void filterUsers();
}

async function retryListLoad() {
    await fetchCrmList(page.value, perPage.value, {}, { force: true });
}

onMounted(() => {
    void fetchCrmList();
});

const refreshInstitutions = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await fetchCrmList(newPage);
};

const refreshUsers = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await fetchCrmList(newPage);
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

    invalidateCrmCacheKey(page.value, perPage.value, buildCrmQueryParams(), 'users');
};

function handleInstitutionsListUpdate(updatedInstitutions: NonNullable<typeof institutions.value>) {
    institutions.value = updatedInstitutions;
    invalidateCrmCacheKey(page.value, perPage.value, buildCrmQueryParams(), 'institutions');
}

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    perPageCookie.value = value;
    page.value = 1;
    pageCookie.value = 1;
    await fetchCrmList(1, value);
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
    await fetchCrmList();
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

    page.value = 1;
    pageCookie.value = 1;
    await fetchCrmList(1, perPage.value, {}, { force: true });
};

function handleUsersListUpdate(updatedUsers: NonNullable<typeof users.value>) {
    users.value = updatedUsers;
    invalidateCrmCacheKey(page.value, perPage.value, buildCrmQueryParams(), 'users');
}

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
    if (isInstitutionsTab.value) {
        const rows = institutions.value?.data ?? [];
        exportInstitutionsToCsv(rows, `crm-institutions-export-${new Date().toISOString().slice(0, 10)}.csv`);
        return;
    }

    const rows = users.value?.data ?? [];
    exportUsersToCsv(rows, `crm-export-${new Date().toISOString().slice(0, 10)}.csv`);
}

function exportInstitutionsToCsv(rows: CrmInstitution[], filename: string) {
    if (!rows.length) {
        $toast({ description: 'Aucune donnée à exporter', variant: 'destructive' });
        return;
    }

    const headers = [
        'Institution',
        'Email',
        'Téléphone',
        'Code postal',
        'Ville',
        'NursAssur',
        'NursTech',
        'Abonnement',
        'Dernier contact',
    ];

    const escape = (value: unknown) => {
        const str = value == null ? '' : String(value);
        return `"${str.replace(/"/g, '""')}"`;
    };

    const subscriptionLabel = (row: CrmInstitution) => {
        const subscription = row.subscription;
        if (!subscription?.active && !subscription?.status) return 'Inactif';
        if (subscription.status === 'paid' || subscription.status === 'accomplished') return 'Actif';
        return 'En signature';
    };

    const lines = [
        headers.join(';'),
        ...rows.map((row) => {
            const crm = row.crm ?? {};
            return [
                row.full_name,
                row.email,
                row.phone_number,
                row.zip_code,
                row.city,
                row.insurance ? 'oui' : 'non',
                row.site ? 'oui' : 'non',
                subscriptionLabel(row),
                crm.last_contact_date ?? '',
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

watch(selectedCrm, async (newValue) => {
    page.value = 1;
    pageCookie.value = 1;
    selectedCrmCookie.value = newValue;
    listLoadError.value = false;
    await fetchCrmList(1, perPage.value, {}, { force: true });
});
</script>
