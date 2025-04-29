<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="py-3 text-primary bg-gray-100 w-[75%] px-9 rounded-lg">
                Rechercher <strong>
                    un remplacement
                </strong>
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
            :get-data="getReplacements"
            :filter-type="selectedFilter"
        />
    </div>
</template>

<script setup lang="ts">
import Replacement from '~/components/Replacement.vue';
import { useReplacements } from '~/composables/useReplacements';

const { getReplacements } = useReplacements();

const replacementFilters = {
    all: 'Tous',
    classic: 'Classique',
    urgent: 'Urgent',
};

const selectedFilter = ref('all');

useHead({
    title: 'Rechercher un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'subscribed'],
    ssr: false,
});
</script>
