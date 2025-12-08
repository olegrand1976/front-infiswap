<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex flex-col lg:flex-row lg:gap-8 lg:items-center lg:justify-between w-full">
            <h1 class="flex justify-between items-center sm:block py-3 text-primary sm:bg-gray-100 lg:w-[35%] xl:w-[45%] 2xl:w-[55%] sm:px-9 rounded-lg">
                <span>
                    Chercher <strong>un remplacement</strong>
                </span>

                <div
                    class="sm:hidden items-center space-x-4 cursor-pointer"
                    @click="toggleIcon"
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <component
                                    :is="currentIcon"
                                    class="w-6 text-black hover:text-primary"
                                />
                                <TooltipContent>
                                    <p>{{ groupByProvince ? 'Organiser par défaut' : 'Organiser par région' }}</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </h1>

            <div class="mt-6 lg:mt-0 flex justify-between lg:justify-end gap-x-2 xl:gap-x-8 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="flex gap-3 items-center border-gray-200 font-normal shadow text-black/90 h-10"
                        >
                            <FunnelIcon class="w-5" />
                            <span>
                                Filtrer
                                <span
                                    v-if="activeFiltersCount > 0"
                                    class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full"
                                >
                                    {{ activeFiltersCount }}
                                </span>
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-64">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Type de remplacement
                            </DropdownMenuLabel>
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
                            <DropdownMenuLabel>
                                Rôle
                            </DropdownMenuLabel>
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

                <div
                    class="flex space-x-3 rounded items-center justify-between ps-3 pe-1"
                >
                    <h5 class="text-sm">
                        Pays
                    </h5>
                    <Select v-model="selectedCountry">
                        <SelectTrigger
                            class="bg-white w-28 sm:w-36 overflow-x-hidden my-0.5 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-300 lg:text-sm md:text-xs"
                            position="right"
                        >
                            <SelectValue
                                :placeholder="countries[selectedCountry]"
                                class="text-xs text-black w-[200%] truncate"
                            />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup class="w-32 truncate">
                                <SelectItem
                                    v-for="[code, label] in Object.entries(countries)"
                                    :key="code"
                                    :value="code"
                                >
                                    <div class="flex flex-nowrap gap-2 items-center">
                                        <LayoutsAppImage
                                            v-if="code === 'fr'"
                                            :src="'/icons/fr.png'"
                                            alt="France flag"
                                            class="w-3"
                                        />
                                        <LayoutsAppImage
                                            v-else-if="code === 'be'"
                                            :src="'/icons/belgium.png'"
                                            alt="Belgium flag"
                                        />
                                        <span>{{ label }}</span>
                                    </div>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div
                    v-if="selectedCountry != 'fr'"
                    class="flex space-x-3 rounded items-center justify-between ps-3 pe-1"
                >
                    <h5 class="text-sm">
                        Provinces
                    </h5>
                    <Select>
                        <SelectTrigger
                            class="bg-white w-28 sm:w-36 overflow-x-hidden my-0.5 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-300 lg:text-sm md:text-xs"
                            position="right"
                        >
                            <SelectValue
                                :placeholder="selectedProvincesPlaceholder"
                                class="text-xs text-black w-[200%] truncate"
                            />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup class="w-32 truncate">
                                <div class="flex items-center space-2 mb-2">
                                    <Checkbox
                                        id="tous"
                                        :checked="isAllSelected"
                                        class="mr-2"
                                        @update:checked="toggleAllRegions($event)"
                                    />
                                    <label class="text-xs text-nowrap truncate">Tous</label>
                                </div>
                                <div
                                    v-for="(region, index) in regions"
                                    :key="index"
                                    class="flex items-center space-2 mb-2"
                                >
                                    <Checkbox
                                        :id="region"
                                        :checked="selectedRegions.includes(region)"
                                        :value="region"
                                        class="mr-2"
                                        @update:checked="updateRegionSelection(region, $event)"
                                    />
                                    <label class="text-xs text-nowrap truncate">{{ region }}</label>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div
                    v-else
                    class="flex space-x-3 rounded items-center justify-between ps-3 pe-1"
                >
                    <h5 class="text-sm">
                        Départements
                    </h5>
                    <Select>
                        <SelectTrigger
                            class="bg-white w-28 sm:w-36 overflow-x-hidden my-0.5 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-300 lg:text-sm md:text-xs"
                            position="right"
                        >
                            <SelectValue
                                :placeholder="selectedProvincesPlaceholder"
                                class="text-xs text-black w-[200%] truncate"
                            />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup class="w-32 truncate">
                                <div class="flex items-center space-2 mb-2">
                                    <Checkbox
                                        id="tous"
                                        :checked="isAllSelected"
                                        class="mr-2"
                                        @update:checked="toggleAllRegions($event)"
                                    />
                                    <label class="text-xs text-nowrap truncate">Tous</label>
                                </div>
                                <div
                                    v-for="(region, index) in departments"
                                    :key="index"
                                    class="flex items-center space-2 mb-2"
                                >
                                    <Checkbox
                                        :id="region"
                                        :checked="selectedRegions.includes(region)"
                                        :value="region"
                                        class="mr-2"
                                        @update:checked="updateRegionSelection(region, $event)"
                                    />
                                    <label class="text-xs text-nowrap truncate">{{ region }}</label>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div
                    class="hidden sm:flex items-center space-x-4 cursor-pointer"
                    @click="toggleIcon"
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <component
                                    :is="currentIcon"
                                    class="w-6 hover:text-primary"
                                />
                                <TooltipContent>
                                    <p>{{ groupByProvince ? 'Organiser par défaut' : 'Organiser par région' }}</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>

        <Replacement
            v-model:selected-regions="selectedRegions"
            :filters="selectedFilters"
            :selected-country="selectedCountry"
            :group-by-province="groupByProvince"
            :filtered-provinces="selectedRegions"
        />
    </div>
</template>

<script setup lang="ts">
import { Squares2X2Icon, QueueListIcon, FunnelIcon } from '@heroicons/vue/24/outline';
import { useCookie } from '#app';
import { regions, departments } from '~/lib/utils';
import Replacement from '~/components/Replacement.vue';
import type { User } from '~/lib/types';

const user = useState<User>('user');
const selectedCountry = ref(user.value.profile.country);

const countries = {
    be: 'Belgique',
    fr: 'France',
};

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

const filterCookies = useCookie<{ type: string; role: string }>('selectedFilters', {
    default: () => ({
        type: 'all',
        role: 'all',
    }),
});

const groupByProvince = ref(true);

const activeFiltersCount = computed(() => {
    let count = 0;
    if (selectedFilters.value.type !== 'all') count++;
    if (selectedFilters.value.role !== 'all') count++;
    return count;
});

const currentIcon = computed(() => (groupByProvince.value ? QueueListIcon : Squares2X2Icon));

const toggleIcon = () => {
    groupByProvince.value = !groupByProvince.value;
};

const toggleAllRegions = (checked: boolean) => {
    if (checked) {
        selectedRegions.value = [];
    }
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
    if (isAllSelected.value || selectedRegions.value.length === 0) {
        return 'Tous';
    }
    return selectedRegions.value.map(region => region).join(', ');
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
    middleware: ['auth', 'verified'],
});
</script>
