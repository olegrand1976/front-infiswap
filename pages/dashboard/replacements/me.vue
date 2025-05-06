<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="py-3 text-primary bg-gray-100 w-[75%] px-9 rounded-lg">
                Mes <strong>remplacements</strong>
            </h1>

            <Select v-model="selectedFilter">
                <SelectTrigger
                    class="bg-white my-0.5 w-36 rounded-lg shadow flex space-x-1 lg:space-x-2 border border-gray-200 lg:text-sm md:text-xs"
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
        </div>

        <Replacement
            type="me"
            :get-data="getMyReplacements"
            :filter-type="selectedFilter"
        />
    </div>
</template>

<script setup lang="ts">
import { useCookie } from '#app';
import Replacement from '~/components/Replacement.vue';
import { useReplacements } from '~/composables/useReplacements';

const { getMyReplacements } = useReplacements();

const replacementFilters = {
    all: 'Tous',
    classic: 'Classique',
    urgent: 'Urgent',
};

const selectedFilter = ref('all');
const filterCookie = useCookie('selectedFilter');

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
