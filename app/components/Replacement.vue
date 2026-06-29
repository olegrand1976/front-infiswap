<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="min-w-0 w-full max-w-full overflow-x-hidden">
        <div class="mt-8 min-w-0 w-full">
            <Form class="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                <div class="min-w-0">
                    <FormField name="days">
                        <FormItem>
                            <FormControl>
                                <div class="flex min-w-0 items-center justify-between gap-3 rounded-full bg-primary ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Jours
                                    </h5>
                                    <Select>
                                        <SelectTrigger
                                            class="my-0.5 min-w-0 flex-1 rounded-full border-none bg-white text-xs"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="selectedDaysPlaceholder"
                                                class="text-xs truncate"
                                            />
                                        </SelectTrigger>
                                        <SelectContent class="border-none">
                                            <SelectGroup class="w-32">
                                                <div
                                                    v-for="(day, index) in days"
                                                    :key="index"
                                                    class="flex items-center mb-2"
                                                >
                                                    <Checkbox
                                                        class="mr-2"
                                                        :checked="formData.selectedDays.includes(day)"
                                                        @update:checked="toggleDay(day)"
                                                    />
                                                    <label class="text-xs">{{ frenchDays[day] }}</label>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="min-w-0 lg:col-span-2">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex min-w-0 items-center justify-between gap-3 rounded-full bg-primary ps-3 pe-1"
                                    title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">CP</span>
                                        <span class="hidden xl:inline-block">Codes postaux</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.postalCodeTags"
                                        class="my-0.5 flex h-auto min-h-9 min-w-0 flex-1 flex-wrap items-center gap-1 rounded-full border-none py-1 text-xs"
                                    >
                                        <TagsInputItem
                                            v-for="item in formData.postalCodeTags"
                                            :key="item"
                                            :value="item"
                                            class="shrink-0"
                                        >
                                            <TagsInputItemText class="text-xs" />
                                            <TagsInputItemDelete @click="removeTag(formData.postalCodeTags, item)" />
                                        </TagsInputItem>
                                        <TagsInputInput
                                            v-model="postalCodeInput"
                                            class="min-w-[4rem] flex-1 text-xs"
                                            :placeholder="props.selectedCountry === 'fr' ? '75000' : '1000'"
                                            @blur="handleBlur"
                                            @keydown.enter="addTagFromInput(postalCodeInput, formData.postalCodeTags, v => { postalCodeInput = ''; return v; })"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="min-w-0 lg:col-span-2">
                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex min-w-0 items-center justify-between gap-3 rounded-full bg-primary ps-3 pe-1"
                                    title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        Ville(s)
                                    </h5>
                                    <TagsInput
                                        v-model="formData.cityTags"
                                        class="my-0.5 flex h-auto min-h-9 min-w-0 flex-1 flex-wrap items-center gap-1 rounded-full border-none py-1 text-xs"
                                    >
                                        <TagsInputItem
                                            v-for="item in formData.cityTags"
                                            :key="item"
                                            :value="item"
                                            class="shrink-0"
                                        >
                                            <TagsInputItemText class="text-xs" />
                                            <TagsInputItemDelete @click="removeTag(formData.cityTags, item)" />
                                        </TagsInputItem>
                                        <TagsInputInput
                                            v-model="cityInput"
                                            class="min-w-[4rem] flex-1 text-xs"
                                            :placeholder="props.selectedCountry === 'fr' ? 'Paris' : 'Bruxelles'"
                                            @blur="handleBlur"
                                            @keydown.enter="addTagFromInput(cityInput, formData.cityTags, v => { cityInput = ''; return v; })"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="flex min-w-0 gap-3 sm:col-span-2 lg:col-span-2">
                    <Button
                        class="bg-primary flex items-center justify-center text-sm h-11 px-4 w-full md:w-auto"
                        @click="reinitializeFilter"
                    >
                        <RefreshCw class="w-6" />
                        <span class="ml-2 block lg:hidden text-xs md:text-sm">Réinitialiser</span>
                    </Button>
                    <Button
                        class="text-sm bg-primary flex items-center justify-center h-11 px-4 w-full md:w-auto 2xl:px-10"
                        @click="submitSearch"
                    >
                        <Search class="w-6" />
                        <span class="ml-2 text-xs md:text-sm">Rechercher</span>
                    </Button>
                </div>
            </Form>
        </div>

        <div class="my-8 min-w-0 w-full max-w-full">
            <div
                v-if="isEmpty"
                class="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50"
            >
                <div class="bg-white rounded-full p-5 shadow-sm mb-5 border border-gray-100">
                    <Search class="w-10 h-10 text-gray-400" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                    Aucun résultat trouvé
                </h3>
                <p class="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                    {{ isAnyFilterActive
                        ? "Désolé, nous n'avons trouvé aucun remplacement correspondant à vos critères de recherche. Essayez d'ajuster vos filtres."
                        : "Il n'y a pas encore de remplacements disponibles dans cette section."
                    }}
                </p>
                <Button
                    v-if="isAnyFilterActive"
                    variant="outline"
                    class="rounded-full px-8 hover:bg-primary hover:text-white transition-all duration-300"
                    @click="reinitializeFilter"
                >
                    Réinitialiser les filtres
                </Button>
            </div>
            <template v-if="showTopSection && topItems.length > 0">
                <div class="mb-12">
                    <h2 class="font-bold text-gray-800 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 group">
                        <div class="flex items-center">
                            <div class="flex gap-1 text-sm items-center px-3 py-1 rounded-r-md font-bold bg-primary/10 text-primary border border-primary/20 border-l-5 border-l-primary shadow-sm transition-all group-hover:bg-primary/20">
                                Top missions &amp; remplacements
                            </div>
                        </div>
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <template
                            v-for="item in topItems"
                            :key="`top-${item.record_type}-${item.id}`"
                        >
                            <MissionCard
                                v-if="item.record_type === 'mission'"
                                :mission="item"
                            />
                            <ReplacementCard
                                v-else
                                :replacement="formatReplacementForCard(item)"
                                :raw-replacement="item"
                                :show-boost-stars="true"
                                @open-edit="openEditDialog"
                                @closed="refreshItems(page)"
                            />
                        </template>
                    </div>
                </div>
            </template>

            <template v-if="isCardMode && props.groupByProvince && Object.keys(groupsByProvince).length > 0">
                <div
                    v-for="(items, province) in groupsByProvince"
                    :key="`province-${province}`"
                    class="mb-8"
                >
                    <h2 class="font-semibold text-black/70 mb-4 flex items-center gap-2">
                        {{ province }}
                        <span class="text-gray-400 font-normal text-sm">({{ items.length }})</span>
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <template
                            v-for="item in items"
                            :key="`card-${item.record_type}-${item.id}`"
                        >
                            <ReplacementCard
                                :replacement="formatReplacementForCard(item)"
                                :raw-replacement="item"
                                @open-edit="openEditDialog"
                                @closed="refreshItems(page)"
                            />
                        </template>
                    </div>
                </div>
            </template>
            <template v-else-if="isCardMode && !props.groupByProvince">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <template v-if="loading || loadingSearch">
                        <ReplacementCardSkeleton
                            v-for="i in 6"
                            :key="`sk-${i}`"
                        />
                    </template>
                    <template v-else>
                        <template
                            v-for="item in replacementItems"
                            :key="`card-flat-${item.record_type}-${item.id}`"
                        >
                            <ReplacementCard
                                :replacement="formatReplacementForCard(item)"
                                :raw-replacement="item"
                                @open-edit="openEditDialog"
                                @closed="refreshItems(page)"
                            />
                        </template>
                    </template>
                </div>
            </template>

            <template v-else-if="!isCardMode && props.groupByProvince && Object.keys(groupsByProvince).length > 0">
                <div
                    v-for="(items, province) in groupsByProvince"
                    :key="`table-province-${province}`"
                    class="mb-8"
                >
                    <h2 class="font-semibold text-black/70 mb-4 flex items-center gap-2">
                        {{ province }}
                        <span class="text-gray-400 font-normal text-sm">({{ items.length }})</span>
                    </h2>

                    <ReplacementTableSkeleton
                        v-if="loading || loadingSearch"
                        :type="props.type"
                        :count="6"
                    />
                    <template v-else>
                        <ReplacementTable
                            :replacements="items"
                            :type="props.type"
                            :user-id="user.id"
                            :group-members="groupMembers"
                            :highlighted-zip-codes="isSubmitted ? formData.postalCodeTags : []"
                            :highlighted-cities="isSubmitted ? formData.cityTags : []"
                            @show-user-info="handleShowInfoUser"
                            @show-periods="handleShowPeriods"
                            @open-edit="openEditDialog"
                            @select-replacement="selectReplacement"
                        />
                    </template>
                </div>
            </template>

            <template v-else-if="!isCardMode && !props.groupByProvince">
                <ReplacementTableSkeleton
                    v-if="loading || loadingSearch"
                    :type="props.type"
                    :count="8"
                />
                <template v-else>
                    <ReplacementTable
                        v-if="replacementItems.length > 0"
                        :replacements="replacementItems"
                        :type="props.type"
                        :user-id="user.id"
                        :group-members="groupMembers"
                        :highlighted-zip-codes="isSubmitted ? formData.postalCodeTags : []"
                        :highlighted-cities="isSubmitted ? formData.cityTags : []"
                        @show-user-info="handleShowInfoUser"
                        @show-periods="handleShowPeriods"
                        @open-edit="openEditDialog"
                        @select-replacement="selectReplacement"
                    />
                </template>
            </template>

            <div class="mt-4">
                <CustomPagination
                    v-if="pagination.total > 5"
                    :default-page="page"
                    :per-page="perPage"
                    :total="pagination.total"
                    @update:page="refreshItems"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </div>

        <Dialog v-model:open="closeReplacementDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Fermer le remplacement</DialogTitle>
                    <DialogDescription class="mt-3 mb-6">
                        Êtes-vous sûr de vouloir fermer ce remplacement ?
                    </DialogDescription>
                </DialogHeader>
                <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="closeReplacementDialog = false"
                    >
                        Non
                    </Button>
                    <Button
                        variant="default"
                        class="px-8"
                        @click="handleCloseReplacement(selectedReplacement)"
                    >
                        Oui
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="periodDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle class="text-base font-semibold text-primary">
                        Période de remplacement
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                    <h5>Date de début</h5>
                    <h5>Date de fin</h5>
                </div>
                <div
                    v-for="period in selectedPeriods"
                    :key="period.id"
                    class="mt-1"
                >
                    <div class="text-sm grid grid-cols-2 items-center">
                        <span>{{ formatDate(period.start_date) }}</span>
                        <span>{{ formatDate(period.end_date) }}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog
            v-if="props.type === ''"
            v-model:open="filterRegionDialog"
        >
            <DialogContent class="max-h-[60vh] overflow-y-scroll pb-8 max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Zone géographique</DialogTitle>
                    <DialogDescription>
                        <template v-if="user.profile.country === 'fr'">
                            Entrez et cochez un ou plusieurs départements pour filtrer les remplacements.
                        </template>
                        <template v-else>
                            Cochez une ou plusieurs provinces pour filtrer les remplacements.
                        </template>
                    </DialogDescription>
                </DialogHeader>
                <template v-if="selectedCountry === 'fr'">
                    <div class="py-4">
                        <InputIcon
                            v-model="searchQuery"
                            placeholder="Entrer un département"
                        />
                        <div class="grid sm:grid-cols-2 gap-4 mt-8">
                            <div
                                v-for="region in filteredDepartments"
                                :key="region"
                                class="flex items-center"
                            >
                                <label
                                    :for="region"
                                    class="grid grid-cols-[10%_90%] items-center w-full text-sm font-medium border border-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white group px-4 py-2 transition-colors"
                                    :class="{ 'bg-primary text-white': selectedRegions.includes(region) }"
                                >
                                    <Checkbox
                                        :id="region"
                                        :checked="selectedRegions.includes(region)"
                                        :value="region"
                                        class="group-hover:border-white"
                                        @update:checked="updateRegionSelection(region, $event)"
                                    />
                                    <span class="ml-1">{{ region }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="grid sm:grid-cols-2 gap-4 py-4">
                        <div
                            v-for="region in regions"
                            :key="region"
                            class="flex items-center"
                        >
                            <label
                                :for="region"
                                class="grid grid-cols-[10%_90%] items-center w-full text-sm font-medium border border-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white group px-4 py-2 transition-colors"
                                :class="{ 'bg-primary text-white': selectedRegions.includes(region) }"
                            >
                                <Checkbox
                                    :id="region"
                                    :checked="selectedRegions.includes(region)"
                                    :value="region"
                                    class="group-hover:border-white"
                                    @update:checked="updateRegionSelection(region, $event)"
                                />
                                <span class="ml-1">{{ region }}</span>
                            </label>
                        </div>
                    </div>
                </template>
                <DialogFooter class="my-6 flex flex-col items-center sm:flex-row gap-4">
                    <Button
                        variant="secondary"
                        class="w-full sm:w-auto"
                        @click="cancelSelection"
                    >
                        Annuler
                    </Button>
                    <Button
                        class="w-full sm:w-auto"
                        @click="validateSelection"
                    >
                        Valider
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showInfoUser">
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                <UsersCard
                    v-if="showInfoUser"
                    :user="selectedUser"
                    :show-full-info="true"
                />
            </DialogContent>
        </Dialog>

        <ProposalLocationModal
            v-model="proposalDialog"
            v-model:newly-added-value="newlyAddedValue"
            title="Suggestions de villes"
            description="Sélectionnez les villes que vous souhaitez utiliser pour votre recherche de remplacements"
            :initial-zip-codes="formData.postalCodeTags"
            :initial-cities="formData.cityTags"
            :is-preference-mode="false"
            @update:initial-zip-codes="updateZipCodesFromModal"
            @update:initial-cities="updateCitiesFromModal"
        />
    </div>
</template>

<script lang="ts" setup>
import { RefreshCw, Search } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import ReplacementCard from '@/components/replacements/ReplacementCard.vue';
import ReplacementCardSkeleton from '@/components/replacements/ReplacementCardSkeleton.vue';
import ReplacementTable from '@/components/replacements/ReplacementTable.vue';
import ReplacementTableSkeleton from '@/components/replacements/ReplacementTableSkeleton.vue';
import MissionCard from '@/components/missions/MissionCard.vue';
import MissionTable from '@/components/replacements/MissionTable.vue';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import { useMergedSearch, type MergedItem, type MergedPagination } from '~/composables/useMergedSearch';
import { regions, departments } from '~/lib/utils';
import { PERPAGE } from '~/lib/constants';
import type { User, Replacement } from '~/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import ProposalLocationModal from '@/components/ProposalLocationModal.vue';
import { useReplacements } from '~/composables/useReplacements';
import {
    isReplacementActivelyBoosted,
    sortByCreatedAtDesc,
    sortRegularReplacements,
    sortReplacementsByBoost,
} from '~/lib/replacementBoost';

const { $toast } = useNuxtApp();

interface ReplacementProps {
    selectedRegions?: string[];
    type?: string;
    filters?: { type: string; role: string ; status: string };
    displayMode?: 'table' | 'cards';
    groupByProvince: boolean;
    filteredProvinces?: string[];
    selectedCountry?: string;
}

const props = withDefaults(defineProps<ReplacementProps>(), {
    selectedRegions: () => [],
    type: '',
    filters: () => ({ type: 'all', role: 'all', status: 'open' }),
    displayMode: 'cards' as const,
    filteredProvinces: () => [],
    selectedCountry: 'be',
});

const isCardMode = computed<boolean>(() => (props.displayMode ?? 'cards') === 'cards');
const user = useState<User>('user');

const pageCookie = useCookie<number>('replacements_page', {
    default: () => 1,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
});

const perPageCookie = useCookie<number>('replacements_per_page', {
    default: () => PERPAGE,
    maxAge: 60 * 60 * 24 * 7,
});

const postalCodeCookie = useCookie<string[]>('replacements_postal_codes', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 7,
});

const cityCookie = useCookie<string[]>('replacements_cities', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 7,
});

const selectedDaysCookie = useCookie<string[]>('replacements_selected_days', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 7,
});

const selectedUser = ref(null);
const showInfoUser = ref(false);
const selectedReplacement = ref<Replacement>(null);
// const page = ref(1);
const route = useRoute();
const router = useRouter();
const perPage = ref(perPageCookie.value);
const page = ref(pageCookie.value);

const pagination = ref({ current_page: 1, per_page: PERPAGE, total: 0, last_page: 1 });
const filterRegionDialog = ref(false);
const isMobileView = ref(false);
const isSubmitted = ref(false);
const closeReplacementDialog = ref(false);
const periodDialog = ref(false);
const selectedPeriods = ref([]);
const postalCodeInput = ref('');
const cityInput = ref('');
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');
const searchQuery = ref('');
const displayedDepartments = ref([]);

const currentItems = ref<MergedItem[]>([]);
const initialItems = ref<MergedItem[]>([]);

const isMission = (item: MergedItem) => item.record_type === 'mission';

const showTopSection = computed(() => props.type === '' || props.type === 'nurse');

const topItems = computed<MergedItem[]>(() => {
    if (!showTopSection.value) return [];

    return sortByCreatedAtDesc(
        currentItems.value.filter(
            item => item.record_type === 'mission' || isReplacementActivelyBoosted(item),
        ),
    );
});

const replacementItems = computed<MergedItem[]>(() => {
    const replacements = currentItems.value.filter(item => item.record_type === 'replacement');

    if (showTopSection.value) {
        return sortRegularReplacements(
            replacements.filter(item => !isReplacementActivelyBoosted(item)),
        );
    }

    return sortReplacementsByBoost(replacements);
});

const groupsByProvince = computed<Record<string, MergedItem[]>>(() => {
    if (!props.groupByProvince) return {};

    const groups: Record<string, MergedItem[]> = {};

    replacementItems.value.forEach((item) => {
        const province = item.province || 'Autres';
        if (!groups[province]) groups[province] = [];
        groups[province].push(item);
    });

    const sorted: Record<string, MergedItem[]> = {};
    Object.keys(groups)
        .sort((a, b) => {
            if (a === 'Autres') return 1;
            if (b === 'Autres') return -1;
            return a.localeCompare(b, 'fr');
        })
        .forEach((key) => { sorted[key] = sortRegularReplacements(groups[key]); });

    return sorted;
});

const isAnyFilterActive = computed(() =>
    formData.postalCodeTags.length > 0
    || formData.cityTags.length > 0
    || formData.selectedDays.length > 0
    || localFilters.type !== 'all'
    || localFilters.role !== 'all'
    || localFilters.status !== 'open', // open = valeur par défaut, donc pas "actif"

);

const isEmpty = computed(() => {
    if (loading.value || loadingSearch.value) return false;
    if (showTopSection.value) {
        return topItems.value.length === 0 && replacementItems.value.length === 0;
    }
    return currentItems.value.length === 0;
});

const { loading, fetchMerged } = useMergedSearch();
const loadingSearch = ref(false);
const { loading: loadingUpdate, updateReplacement, updateAgainReplacement } = useReplacements();
const { careTypes, fetchCareTypes } = useCareTypes();

const localFilters = reactive({
    type: props.filters.type,
    role: props.filters.role,
    status: props.filters.status ?? 'open',
});

// Track whether onMounted fetch has run, to avoid double-fetch from watchers
const mountedFetchDone = ref(false);

let newRegions = [...props.selectedRegions];
let internalUpdate = false;
const emit = defineEmits(['update:selectedRegions', 'update:page']);

const formData = reactive({
    postalCodeTags: [] as string[],
    cityTags: [] as string[],
    selectedDays: [] as string[],
    type: props.type,
    country: props.selectedCountry,
    filters: localFilters,
});

const searchParamsParams = computed(() => {
    return {
        postalCode: toRaw(formData.postalCodeTags),
        cities: toRaw(formData.cityTags),
        selectedDays: toRaw(formData.selectedDays).filter(d => d !== 'all'),
        type: props.type,
        country: props.selectedCountry,
        filters: localFilters,
        provinces: newRegions,
        page: page.value,
        perPage: perPage.value,
        groupByProvince: props.groupByProvince,
    };
});

const fetchData = async (p = 1, pp = PERPAGE, country = props.selectedCountry) => {
    try {
        const result = await fetchMerged({
            postalCode: toRaw(formData.postalCodeTags),
            cities: toRaw(formData.cityTags),
            selectedDays: toRaw(formData.selectedDays).filter(d => d !== 'all'),
            type: props.type,
            country,
            filters: localFilters,
            provinces: newRegions,
            page: p,
            perPage: pp,
            groupByProvince: props.groupByProvince,
        });

        const isPublicNurseView = props.type === '' && !user.value?.institution;
        const filtered = isPublicNurseView
            ? result.items.filter(item => item.user_id !== user.value.id)
            : result.items;

        currentItems.value = filtered;
        initialItems.value = filtered;
        pagination.value = result.pagination;

        pageCookie.value = p;
        perPageCookie.value = pp;
    }
    catch (err) {
        console.error(err);
        currentItems.value = [];
        initialItems.value = [];
        pagination.value = { current_page: 1, per_page: PERPAGE, total: 0, last_page: 1 };
    }
};

const submitSearch = async () => {
    isSubmitted.value = true;

    postalCodeCookie.value = [...formData.postalCodeTags];
    cityCookie.value = [...formData.cityTags];
    selectedDaysCookie.value = [...formData.selectedDays];

    try {
        loadingSearch.value = true;
        await fetchData(page.value, perPage.value);
    }
    finally { loadingSearch.value = false; }
};

const reinitializeFilter = () => {
    formData.postalCodeTags = [];
    formData.cityTags = [];
    formData.selectedDays = [];
    page.value = 1;
    pageCookie.value = 1; // Sauvegarder la page reset
    isSubmitted.value = false;

    // Sauvegarder les filtres vides
    postalCodeCookie.value = [];
    cityCookie.value = [];
    selectedDaysCookie.value = [];

    fetchData(1, perPage.value);
};

const refreshItems = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await router.replace({
        query: {
            ...route.query,
            page: String(newPage),
        },
    });

    emit('update:page', newPage);

    if (isSubmitted.value) {
        await submitSearch();
    }
    else {
        await fetchData(newPage, perPage.value);
    }
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    perPageCookie.value = value;
    page.value = 1;
    pageCookie.value = 1;
    if (isSubmitted.value) await submitSearch();
    else await fetchData(1, value);
};

const formatDate = (isoString: string) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const gridClass = computed(() => {
    const map: Record<string, string> = {
        'groups': 'grid-cols-8',
        'me': 'grid-cols-6',
        '': 'grid-cols-8',
    };

    return map[props.type ?? ''] ?? 'grid-cols-8';
});

const formatReplacementForCard = (r: any) => ({
    id: r.id,
    user_id: r.user_id,
    institution_id: r.institution_id,
    replacement_type: r.replacement_type,
    creator_name: r.institution_id ? null : (r.user?.full_name || r.user?.name),
    stars: r.user?.stars || 0,
    is_favorited: r.user?.is_favorited || false,
    institution: r.institution || r.user?.institution || null,
    periods: r.periods?.map((p: any) => ({ start_date: p.start_date, end_date: p.end_date })) || [],
    cities: typeof r.cities === 'string' ? JSON.parse(r.cities) : r.cities || [],
    zip_codes: typeof r.zip_codes === 'string' ? JSON.parse(r.zip_codes) : r.zip_codes || [],
    care_types: r.care_types || [],
    comment: r.comment || r.description,
    time_slot: (() => {
        const ts = typeof r.timeSlot === 'string' ? JSON.parse(r.timeSlot || '{}') : r.timeSlot || {};
        return {
            morning: ts.morning || (ts.start_at && ts.end_at ? { start_at: ts.start_at, end_at: ts.end_at } : {}),
            evening: ts.evening || {},
        };
    })(),
    patient_count: r.patient_count,
    status: r.status || (r.has_confirmed_substitute ? 'filled' : 'available'),
    type: r.type,
    details: r.details || [],
    has_confirmed_substitute: r.has_confirmed_substitute,
    is_boosted: r.is_boosted,
    boosted_until: r.boosted_until,
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
const frenchDays: Record<string, string> = {
    monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi',
    friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche', all: 'Tous',
};

const selectedDaysPlaceholder = computed(() =>
    !formData.selectedDays.length ? 'Sélectionner' : formData.selectedDays.map(d => frenchDays[d]).join(', '),
);

const _selectDays = (day: string, arr: string[]) => {
    if (day === 'all') {
        if (arr.includes('all')) return [];
        return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
    }
    const withoutAll = arr.filter(d => d !== 'all');
    const idx = withoutAll.indexOf(day);
    return idx === -1 ? [...withoutAll, day] : withoutAll.filter(d => d !== day);
};

const toggleDay = (day: string) => {
    formData.selectedDays = _selectDays(day, formData.selectedDays);
};

const addTagFromInput = (inputValue: string, tagsArray: string[], clearFn: (v: string) => string) => {
    const value = inputValue.trim();
    if (value && !tagsArray.includes(value)) {
        tagsArray.push(value);
        clearFn(value);
    }
};
const removeTag = (tagsArray: string[], tagToRemove: string) => {
    const idx = tagsArray.indexOf(tagToRemove);
    if (idx !== -1) tagsArray.splice(idx, 1);
};
const handleBlur = (event: FocusEvent) => {
    (event.target as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true }),
    );
};

const handleShowInfoUser = (u: any) => {
    selectedUser.value = u;
    showInfoUser.value = true;
};

const handleShowPeriods = (p: any[]) => {
    selectedPeriods.value = p;
    periodDialog.value = true;
};

const selectReplacement = (r: Replacement) => {
    selectedReplacement.value = r;
    closeReplacementDialog.value = true;
};

const handleCloseReplacement = async (r: Replacement) => {
    (r as any).status = 'closed';
    const res = await updateReplacement(r);
    if (res) {
        $toast({ description: res.message });
        closeReplacementDialog.value = false;
        fetchData(page.value, perPage.value);
    }
};

const openEditDialog = (replacement: any) => {
    navigateTo(`/dashboard/replacements/${replacement.id}/edit`);
};

const handleCareTypeClick = (fd: any, id: number) => {
    const idx = fd.careTypes.indexOf(id);
    if (idx === -1) {
        fd.careTypes.push(id);
    }
    else {
        fd.careTypes.splice(idx, 1);
    }
    fd.careTypes = [...fd.careTypes];
};
const getSelectedCareTypesText = (ids: number[]) =>
    careTypes.value.filter(ct => ids.includes(ct.id)).map(ct => ct.name).join(', ');

const updateRegionSelection = (region: string, checked: boolean) => {
    internalUpdate = true;
    if (checked) {
        if (!newRegions.includes(region)) newRegions.push(region);
    }
    else { newRegions = newRegions.filter(r => r !== region); }
    emit('update:selectedRegions', newRegions);
};
const validateSelection = async () => {
    filterRegionDialog.value = false;
    await fetchData(page.value, perPage.value);
    emit('update:selectedRegions', props.selectedRegions);
};
const cancelSelection = () => {
    emit('update:selectedRegions', []);
    filterRegionDialog.value = false;
};

const updateZipCodesFromModal = (zips: string[]) => {
    formData.postalCodeTags = [...zips];
    postalCodeCookie.value = [...zips];
    submitSearch();
};

const updateCitiesFromModal = (cities: string[]) => {
    formData.cityTags = [...cities];
    cityCookie.value = [...cities];
    submitSearch();
};

const { fetchGroupMembers } = useGroup();
const groupMembers = ref([]);
const filteredDepartments = computed(() =>
    searchQuery.value ? departments.filter(d => d.toLowerCase().includes(searchQuery.value.toLowerCase())) : displayedDepartments.value,
);
const getRandomItems = (arr: any[], n: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

const { data: asyncData } = await useAsyncData(
    `merged-search-${props.type}-${page.value}`,
    () => fetchMerged(searchParamsParams.value),
);

if (asyncData.value) {
    const isPublicNurseView = props.type === '' && !user.value?.institution;
    const filtered = isPublicNurseView
        ? asyncData.value.items.filter(item => item.user_id !== user.value.id)
        : asyncData.value.items;

    currentItems.value = filtered;
    initialItems.value = filtered;
    pagination.value = asyncData.value.pagination;
}

onMounted(async () => {
    if (import.meta.client) isMobileView.value = window.innerWidth <= 1024;
    if (user.value.profile.country === 'fr') displayedDepartments.value = getRandomItems(departments, 6);

    if (postalCodeCookie.value.length > 0) {
        formData.postalCodeTags = [...postalCodeCookie.value];
    }
    if (cityCookie.value.length > 0) {
        formData.cityTags = [...cityCookie.value];
    }
    if (selectedDaysCookie.value.length > 0) {
        formData.selectedDays = [...selectedDaysCookie.value];
    }

    await fetchCareTypes();
    mountedFetchDone.value = true;

    if (props.type === 'groups') {
        const groupIds = user.value.group_roles.map((g: any) => g.group_id);
        if (groupIds.length > 0) {
            const result = await fetchGroupMembers(groupIds);
            groupMembers.value = result ?? [];
            const userIds = groupMembers.value.map((u: any) => u.user_id);
            currentItems.value = currentItems.value.filter(item =>
                isMission(item) ? true : userIds.includes(item.user_id),
            );
        }
    }
});

watch(() => props.filters, (nf, old) => {
    if (!nf) return;
    localFilters.type = nf.type;
    localFilters.role = nf.role;
    localFilters.status = nf.status ?? 'open';
    if (!mountedFetchDone.value) return;
    // if (old && nf.type === old.type && nf.role === old.role) return;
    fetchData(page.value, perPage.value);
}, { deep: true });

watch(() => props.selectedCountry, (nc) => {
    if (nc)
        fetchData(page.value, perPage.value, nc);
});

watch(() => props.filteredProvinces, (nv, ov) => {
    if (nv !== ov) {
        newRegions = [...nv as string[]];
        if (internalUpdate) {
            internalUpdate = false;
            return;
        }
        fetchData(page.value, perPage.value);
    }
}, { deep: true });

watch(
    [() => formData.postalCodeTags, () => formData.cityTags, () => formData.selectedDays],
    ([np, nc, nd]) => {
        if (!np.length && !nc.length && !nd.length) {
            currentItems.value = [...initialItems.value];
            isSubmitted.value = false;
            postalCodeCookie.value = [];
            cityCookie.value = [];
            selectedDaysCookie.value = [];
        }
        // else if (isSubmitted.value) {
        submitSearch();
        // }
    },
    { deep: true },
);

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
