<template>
    <div class="min-w-0 w-full max-w-full overflow-x-hidden">
        <div class="flex items-center gap-2">
            <button
                type="button"
                class="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                :title="t('common.back')"
                @click="goBack"
            >
                <ArrowLeft class="size-4" />
            </button>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink
                                :to="localePath('/dashboard')"
                                class="flex items-center gap-1.5"
                            >
                                <LayoutGrid class="size-3.5" />
                                {{ t('nav.dashboard') }}
                            </NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{{ t('replacements.searchTitle') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <div class="mt-5">
            <h1 class="font-secondary text-2xl sm:text-3xl font-semibold tracking-tight">
                {{ t('replacements.searchHeading') }} {{ t('replacements.searchHeadingStrong') }}
            </h1>
            <p class="mt-2 text-sm text-muted-foreground">
                {{ t('replacements.searchHelpDesc') }}
            </p>
        </div>

        <Replacement
            v-model:selected-regions="selectedRegions"
            :filters="selectedFilters"
            :selected-country="selectedCountry"
            :group-by-province="groupByProvince"
            :filtered-provinces="selectedRegions"
            :display-mode="displayMode"
            :available-missions="availableMissions"
        >
            <template #filters>
                <div class="flex min-w-0 flex-wrap items-end gap-2">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.filterType') }}</label>
                        <Select v-model="selectedFilters.type">
                            <SelectTrigger
                                class="h-9 w-40 shrink-0 rounded-md border border-input bg-background text-xs"
                                position="right"
                            >
                                <List class="size-4 shrink-0 text-muted-foreground" />
                                <SelectValue :placeholder="replacementTypeFilters[selectedFilters.type]" />
                            </SelectTrigger>
                            <SelectContent class="border-none">
                                <SelectGroup class="w-40">
                                    <SelectItem
                                        v-for="[key, label] in Object.entries(replacementTypeFilters)"
                                        :key="key"
                                        :value="key"
                                    >
                                        {{ label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.filterRole') }}</label>
                        <Select v-model="selectedFilters.role">
                            <SelectTrigger
                                class="h-9 w-44 shrink-0 rounded-md border border-input bg-background text-xs"
                                position="right"
                            >
                                <Users class="size-4 shrink-0 text-muted-foreground" />
                                <SelectValue :placeholder="replacementRoleFilters[selectedFilters.role]" />
                            </SelectTrigger>
                            <SelectContent class="border-none">
                                <SelectGroup class="w-44">
                                    <SelectItem
                                        v-for="[key, label] in Object.entries(replacementRoleFilters)"
                                        :key="key"
                                        :value="key"
                                    >
                                        {{ label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.filterStatus') }}</label>
                        <Select v-model="selectedFilters.status">
                            <SelectTrigger
                                class="h-9 w-36 shrink-0 rounded-md border border-input bg-background text-xs"
                                position="right"
                            >
                                <CircleCheck class="size-4 shrink-0 text-muted-foreground" />
                                <SelectValue :placeholder="replacementStatusFilters[selectedFilters.status]" />
                            </SelectTrigger>
                            <SelectContent class="border-none">
                                <SelectGroup class="w-36">
                                    <SelectItem
                                        v-for="[key, label] in Object.entries(replacementStatusFilters)"
                                        :key="key"
                                        :value="key"
                                    >
                                        {{ label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="hidden sm:block w-px h-9 bg-input" />

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('settings.country') }}</label>
                        <Select v-model="selectedCountry">
                            <SelectTrigger
                                class="h-9 w-44 shrink-0 rounded-md border border-input bg-background text-xs"
                                position="right"
                            >
                                <Globe class="size-4 shrink-0 text-muted-foreground" />
                                <SelectValue
                                    :placeholder="countries[selectedCountry]"
                                    class="text-xs"
                                />
                            </SelectTrigger>
                            <SelectContent class="border-none">
                                <SelectGroup class="w-46">
                                    <SelectItem
                                        v-for="[code, label] in Object.entries(countries)"
                                        :key="code"
                                        :value="code"
                                    >
                                        <div class="flex gap-2 items-center">
                                            <LayoutsAppImage
                                                v-if="code === 'fr'"
                                                :src="'/icons/fr.png'"
                                                alt="France"
                                                class="w-3"
                                            />
                                            <LayoutsAppImage
                                                v-else-if="code === 'be'"
                                                :src="'/icons/belgium.png'"
                                                alt="Belgique"
                                                class="w-3"
                                            />
                                            <span>{{ label }}</span>
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.filterProvinces') }}</label>
                        <Select>
                            <SelectTrigger
                                class="h-9 w-44 shrink-0 rounded-md border border-input bg-background text-xs"
                                position="right"
                            >
                                <MapPin class="size-4 shrink-0 text-muted-foreground" />
                                <SelectValue
                                    :placeholder="selectedProvincesPlaceholder"
                                    class="text-xs truncate"
                                />
                            </SelectTrigger>
                            <SelectContent class="border-none">
                                <SelectGroup class="w-46">
                                    <div class="flex items-center gap-2 mb-2 px-1">
                                        <Checkbox
                                            id="tous"
                                            :checked="isAllSelected"
                                            @update:checked="toggleAllRegions($event)"
                                        />
                                        <label
                                            for="tous"
                                            class="text-xs cursor-pointer"
                                        >{{ t('common.all') }}</label>
                                    </div>
                                    <div
                                        v-for="(region, index) in selectedCountry === 'fr' ? departments : regions"
                                        :key="index"
                                        class="flex items-center gap-2 mb-2 px-1"
                                    >
                                        <Checkbox
                                            :id="region"
                                            :checked="selectedRegions.includes(region)"
                                            :value="region"
                                            @update:checked="updateRegionSelection(region, $event)"
                                        />
                                        <label
                                            :for="region"
                                            class="text-xs truncate cursor-pointer"
                                        >{{ region }}</label>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="ml-auto flex items-center gap-1.5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <button
                                        type="button"
                                        class="flex size-9 items-center justify-center rounded-md border transition-colors"
                                        :class="groupByProvince
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-input bg-background text-muted-foreground hover:border-primary hover:text-primary'"
                                        @click="toggleGroupByProvince"
                                    >
                                        <Map class="size-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{{ groupByProvince ? t('replacements.disableProvinceView') : t('replacements.enableProvinceView') }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <button
                                        type="button"
                                        class="flex size-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                        @click="toggleDisplayMode"
                                    >
                                        <LayoutGrid
                                            v-if="displayMode === 'table'"
                                            class="size-4"
                                        />
                                        <Table
                                            v-else
                                            class="size-4"
                                        />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{{ displayMode === 'cards' ? t('replacements.switchToTableView') : t('replacements.switchToCardView') }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </template>

            <template #banner>
                <div
                    v-if="!user?.institution"
                    class="mt-4 mb-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-slate-700"
                    data-testid="own-replacements-hidden-banner"
                >
                    {{ t('replacements.ownReplacementsHidden') }}
                    <NuxtLink
                        to="/dashboard/replacements/me"
                        class="ml-1 font-semibold text-primary underline underline-offset-2"
                    >
                        {{ t('replacements.viewMyReplacements') }}
                    </NuxtLink>
                </div>
            </template>
        </Replacement>

        <ConfirmProfileCountryModal
            v-if="showCountryModal"
            :pending="countryPending"
            @select="onCountrySelect"
            @dismiss="cancelCountryModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CircleCheck, Globe, LayoutGrid, List, Map, MapPin, Table, Users } from 'lucide-vue-next';
import { useCookie } from '#app';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { regions, departments, goBack } from '~/lib/utils';
import Replacement from '~/components/Replacement.vue';
import ConfirmProfileCountryModal from '~/components/replacements/ConfirmProfileCountryModal.vue';
import type { User } from '~/lib/types';
import { useMissions } from '~/composables/useMission';
import { PERPAGE } from '~/lib/constants';
import { normalizeSelectedFilters } from '~/utils/selectedFilters';
import { resolveProfileCountryCode } from '~/utils/profileCountry';
import { useConfirmProfileCountry } from '~/composables/useConfirmProfileCountry';

const { t } = useI18n();
const localePath = useLocalePath();

const user = useState<User>('user');
const {
    showModal: showCountryModal,
    pending: countryPending,
    ensureProfileCountry,
    onSelect: onCountrySelect,
    cancel: cancelCountryModal,
} = useConfirmProfileCountry();
const { allowedCountryCodes, defaultCountryCode, availableCountries } = useCountry();
const selectedCountry = ref(
    allowedCountryCodes.value.includes(user.value.profile.country as 'be' | 'fr')
        ? user.value.profile.country
        : defaultCountryCode.value,
);

const { getAll: getMissions, missions } = useMissions();
const availableMissions = computed(() => missions.value.data ?? []);

function syncSelectedCountryFromProfile(): void {
    const code = resolveProfileCountryCode(user.value?.profile);
    if (code && allowedCountryCodes.value.includes(code)) {
        selectedCountry.value = code;
        return;
    }
    if (allowedCountryCodes.value.includes(defaultCountryCode.value)) {
        selectedCountry.value = defaultCountryCode.value;
    }
}

onMounted(async () => {
    await ensureProfileCountry();
    syncSelectedCountryFromProfile();
    getMissions(1, PERPAGE, { type: 'nurse' });
});

watch(
    () => [
        user.value?.profile?.country,
        user.value?.profile?.working_at,
        allowedCountryCodes.value.join(','),
    ],
    () => {
        syncSelectedCountryFromProfile();
    },
);

const countries = availableCountries;

const replacementTypeFilters = computed(() => ({
    all: t('common.all'),
    classic: t('replacements.typeClassic'),
    immediate: t('replacements.typeUrgent'),
}));

const replacementRoleFilters = computed(() => ({
    all: t('common.all'),
    nurse: t('replacements.roleNurse'),
    caregiver: t('replacements.roleAide'),
    midwife: t('replacements.roleMidwife'),
}));

const selectedRegions = ref<string[]>([]);
const isAllSelected = computed(() => selectedRegions.value.length === 0);

const selectedFilters = ref({
    type: 'all',
    role: 'all',
    status: 'open',
});

const filterCookies = useCookie<{ type: string; role: string }>('selectedFilters', {
    default: () => ({ type: 'all', role: 'all' }),
});

const displayModeCookie = useCookie<'cards' | 'table'>('displayMode', {
    default: () => 'cards',
});
const displayMode = ref<'cards' | 'table'>(displayModeCookie.value);

const groupByProvince = ref(true);

const toggleDisplayMode = () => {
    displayMode.value = displayMode.value === 'cards' ? 'table' : 'cards';
    displayModeCookie.value = displayMode.value;
};

const toggleGroupByProvince = () => {
    groupByProvince.value = !groupByProvince.value;
};

const toggleAllRegions = (checked: boolean) => {
    if (checked) selectedRegions.value = [];
};

const updateRegionSelection = (region: string, checked: boolean) => {
    if (checked) {
        if (!selectedRegions.value.includes(region)) {
            selectedRegions.value = [...selectedRegions.value, region];
        }
    }
    else {
        selectedRegions.value = selectedRegions.value.filter(r => r !== region);
    }
};

const selectedProvincesPlaceholder = computed(() => {
    if (isAllSelected.value || selectedRegions.value.length === 0) return t('common.all');
    return selectedRegions.value.join(', ');
});

onMounted(() => {
    if (filterCookies.value) {
        const normalized = normalizeSelectedFilters({
            type: filterCookies.value.type ?? 'all',
            role: filterCookies.value.role ?? 'all',
            status: (filterCookies.value as { status?: string }).status ?? 'open',
        });
        selectedFilters.value = {
            type: normalized.type,
            role: normalized.role,
            status: normalized.status ?? 'open',
        };
        if (filterCookies.value.type === 'urgent') {
            filterCookies.value = { type: normalized.type, role: normalized.role };
        }
    }
});

watch(selectedFilters, (newFilters) => {
    filterCookies.value = normalizeSelectedFilters({
        type: newFilters.type,
        role: newFilters.role,
    });
}, { deep: true });

watch(selectedCountry, () => {
    selectedRegions.value = [];
});
const replacementStatusFilters = computed(() => ({
    open: t('replacements.statusOpenFilter'),
    closed: t('replacements.statusClosedFilter'),
    all: t('common.all'),
}));
useHead({
    title: () => t('replacements.searchTitle'),
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
