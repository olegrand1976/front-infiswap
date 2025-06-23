<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <h1 class="flex justify-between items-center sm:block py-3 text-primary sm:bg-gray-100 md:w-[45%] lg:w-[45%] xl:w-[55%] 2xl:w-[65%] sm:px-9 rounded-lg">
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

            <div class="mt-6 md:mt-0 flex justify-between md:justify-end gap-x-2 xl:gap-x-8 items-center">
                <Select v-model="selectedFilter">
                    <SelectTrigger
                        class="bg-white my-0.5 w-28 sm:w-36 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-300 lg:text-sm md:text-xs"
                        position="right"
                    >
                        <SelectValue
                            :placeholder="replacementFilters[selectedFilter]"
                            class="w-[200%] truncate placeholder:text-black"
                        />
                    </SelectTrigger>

                    <SelectContent class="border border-none">
                        <SelectGroup class="w-32">
                            <SelectItem
                                v-for="(label, key) in replacementFilters"
                                :key="key"
                                :value="key"
                            >
                                {{ label }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div class="flex space-x-3 rounded items-center justify-between ps-3 pe-1">
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
            :filter-type="selectedFilter"
            :group-by-province="groupByProvince"
            :filtered-provinces="selectedRegions"
        />
    </div>
</template>

<script setup lang="ts">
import { Squares2X2Icon, QueueListIcon } from '@heroicons/vue/24/outline';
import { useCookie } from '#app';
import { regions } from '~/lib/utils';
import Replacement from '~/components/Replacement.vue';

const replacementFilters = {
    all: 'Tous',
    classic: 'Classique',
    urgent: 'Urgent',
};

const selectedRegions = ref<string[]>([]);
const isAllSelected = ref(true);

const selectedFilter = ref('all');
const filterCookie = useCookie('selectedFilter');
const groupByProvince = ref(true);

const currentIcon = computed(() => (groupByProvince.value ? QueueListIcon : Squares2X2Icon));

const toggleIcon = () => {
    groupByProvince.value = !groupByProvince.value;
};

const toggleAllRegions = (checked: boolean) => {
    isAllSelected.value = checked;
    if (checked) {
        selectedRegions.value = [];
    }
};

const updateRegionSelection = (region: string, checked: boolean) => {
    if (checked) {
        isAllSelected.value = false;
        if (!selectedRegions.value.includes(region)) {
            selectedRegions.value = [...selectedRegions.value, region];
        }
    }
    else {
        selectedRegions.value = selectedRegions.value.filter(r => r !== region);
        if (selectedRegions.value.length === 0) {
            isAllSelected.value = true;
        }
    }
};

const selectedProvincesPlaceholder = computed(() => {
    if (isAllSelected.value || selectedRegions.value.length === 0) {
        return 'Tous';
    }
    return selectedRegions.value.map(region => region).join(', ');
});

onMounted(() => {
    if (filterCookie.value) {
        selectedFilter.value = filterCookie.value;
    }
});

watch(selectedFilter, (newFilter) => {
    filterCookie.value = newFilter;
});

useHead({
    title: 'Chercher un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
