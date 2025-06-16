<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="py-3 text-primary sm:bg-gray-100 sm:w-[65%] lg:w-[75%] sm:px-9 rounded-lg">
                Mes <strong>remplacements</strong>
            </h1>

            <div class="flex justify-end gap-x-4 sm:gap-x-8 items-center">
                <Select v-model="selectedFilter">
                    <SelectTrigger
                        class="bg-white my-0.5 w-28 sm:w-36 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-200 lg:text-sm md:text-xs"
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

                <div
                    class="flex items-center space-x-4 cursor-pointer"
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
                                    <p>{{ groupByProvince ? 'Organiser par défaut' : 'Organiser par province' }}</p>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>

        <Replacement
            type="me"
            :filter-type="selectedFilter"
            :group-by-province="groupByProvince"
        />
    </div>
</template>

<script setup lang="ts">
import { Squares2X2Icon, QueueListIcon } from '@heroicons/vue/24/outline';
import { useCookie } from '#app';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Replacement from '~/components/Replacement.vue';

const replacementFilters = {
    all: 'Tous',
    classic: 'Classique',
    urgent: 'Urgent',
};

const selectedFilter = ref('all');
const filterCookie = useCookie('selectedFilter');
const groupByProvince = ref(false);

const currentIcon = computed(() => (groupByProvince.value ? QueueListIcon : Squares2X2Icon));

const toggleIcon = () => {
    groupByProvince.value = !groupByProvince.value;
};

onMounted(() => {
    if (filterCookie.value) {
        selectedFilter.value = filterCookie.value;
    }
});

watch(selectedFilter, (newFilter) => {
    filterCookie.value = newFilter;
});

useHead({
    title: 'Mes remplacements',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
