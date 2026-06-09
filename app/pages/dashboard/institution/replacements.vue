<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex flex-col lg:flex-row lg:gap-4 lg:items-center w-full">
            <h1 class="flex justify-between items-center sm:block py-3 text-primary sm:bg-gray-100 lg:w-auto lg:shrink-0 sm:px-6 rounded-lg">
                <div class="flex items-center gap-2 text-base">
                    <ArrowLeft
                        class="size-5 cursor-pointer hover:text-primary shrink-0"
                        title="Retour"
                        @click="goBack"
                    />
                    Chercher <strong>un remplacement</strong>
                </div>
            </h1>

            <div class="mt-4 lg:mt-0 flex flex-wrap lg:flex-nowrap justify-start items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="flex gap-2 items-center border-gray-200 font-normal shadow text-black/90 h-9 text-xs px-3"
                        >
                            <Filter class="w-4 h-4 shrink-0" />
                            <span>
                                Filtrer
                                <span
                                    v-if="activeFiltersCount > 0"
                                    class="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full"
                                >
                                    {{ activeFiltersCount }}
                                </span>
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-64">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Type de remplacement</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                :model-value="selectedFilters.type"
                                @update:model-value="selectedFilters.type = $event"
                            >
                                <DropdownMenuRadioItem
                                    v-for="(label, key) in replacementTypeFilters"
                                    :key="key"
                                    :value="key"
                                >
                                    {{ label }}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Rôle</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                :model-value="selectedFilters.role"
                                @update:model-value="selectedFilters.role = $event"
                            >
                                <DropdownMenuRadioItem
                                    v-for="(label, key) in replacementRoleFilters"
                                    :key="key"
                                    :value="key"
                                >
                                    {{ label }}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Select v-model="selectedCountry">
                    <SelectTrigger
                        class="bg-white h-9 w-46 text-xs rounded-lg shadow border border-gray-200"
                        position="right"
                    >
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

                <Select>
                    <SelectTrigger
                        class="bg-white h-9 w-46 text-xs rounded-lg shadow border border-gray-200"
                        position="right"
                    >
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
                                >Tous</label>
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

                <div class="hidden sm:block w-px h-6 bg-gray-200" />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <button
                                class="flex items-center justify-center w-9 h-9 rounded-lg border shadow transition-colors"
                                :class="groupByProvince
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'"
                                @click="toggleGroupByProvince"
                            >
                                <Map
                                    class="w-4 h-4 transition-colors"
                                    :class="groupByProvince ? 'text-primary' : 'text-black/60'"
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ groupByProvince ? 'Désactiver la vue par province' : 'Vue par province' }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <button
                                class="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-50 transition-colors text-xs font-medium text-black/70"
                                @click="toggleDisplayMode"
                            >
                                <LayoutGrid
                                    v-if="displayMode === 'table'"
                                    class="w-5 h-5 shrink-0"
                                />
                                <Table
                                    v-else
                                    class="w-5 h-5 shrink-0"
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ displayMode === 'cards' ? 'Passer en vue tableau' : 'Passer en vue cartes' }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <Replacement
            v-model:selected-regions="selectedRegions"
            :filters="selectedFilters"
            :selected-country="selectedCountry"
            :group-by-province="groupByProvince"
            :filtered-provinces="selectedRegions"
            :display-mode="displayMode"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Filter, LayoutGrid, Map, Table } from 'lucide-vue-next';
import { useCookie } from '#app';
import { regions, departments, goBack } from '~/lib/utils';
import Replacement from '~/components/Replacement.vue';
import type { User } from '~/lib/types';

const user = useState<User>('user');
const { allowedCountryCodes, defaultCountryCode, availableCountries } = useCountry();
const selectedCountry = ref(
    allowedCountryCodes.value.includes(user.value.profile.country as 'be' | 'fr')
        ? user.value.profile.country
        : defaultCountryCode.value,
);

const countries = availableCountries;

const replacementTypeFilters = {
    all: 'Tous',
    classic: 'Classique',
    immediate: 'Urgent',
};

const replacementRoleFilters = {
    all: 'Tous',
    nurse: 'Infirmier(ère)',
    caregiver: 'Aide soignant(e)',
    midwife: 'Sage-femme',
};

const selectedRegions = ref<string[]>([]);
const isAllSelected = computed(() => selectedRegions.value.length === 0);

const selectedFilters = ref({
    type: 'all',
    role: 'all',
});

const filterCookies = useCookie<{ type: string; role: string }>('institutionSelectedFilters', {
    default: () => ({ type: 'all', role: 'all' }),
});

const displayModeCookie = useCookie<'cards' | 'table'>('institutionDisplayMode', {
    default: () => 'cards',
});
const displayMode = ref<'cards' | 'table'>(displayModeCookie.value);

const groupByProvince = ref(true);

const activeFiltersCount = computed(() => {
    let count = 0;
    if (selectedFilters.value.type !== 'all') count++;
    if (selectedFilters.value.role !== 'all') count++;
    return count;
});

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
    if (isAllSelected.value || selectedRegions.value.length === 0) return 'Tous';
    return selectedRegions.value.join(', ');
});

onMounted(() => {
    if (filterCookies.value) {
        selectedFilters.value = filterCookies.value;
    }
});

watch(selectedFilters, (newFilters) => {
    filterCookies.value = newFilters;
}, { deep: true });

watch(selectedCountry, () => {
    selectedRegions.value = [];
});

useHead({
    title: 'Chercher un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});
</script>
