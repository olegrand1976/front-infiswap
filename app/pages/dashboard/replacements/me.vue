<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center justify-between w-full">
            <div class="flex items-center gap-2 text-primary sm:bg-gray-100 sm:w-[65%] lg:w-[75%] px-2 rounded-lg">
                <ArrowLeftIcon
                    class="size-5 cursor-pointer hover:text-primary"
                    title="Retour"
                    @click="goBack"
                />
                <h1 class="py-3 text-lg">
                    Mes <strong>remplacements</strong>
                </h1>
            </div>

            <div class="flex justify-end gap-x-4 sm:gap-x-8 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button
                            variant="outline"
                            class="flex gap-3 items-center shadow h-10 border-gray-200 text-black/90 font-normal"
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
                            <DropdownMenuLabel>Type de remplacement</DropdownMenuLabel>
                            <DropdownMenuRadioGroup v-model="selectedFilters.type">
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
                            <DropdownMenuRadioGroup v-model="selectedFilters.role">
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

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <button
                                class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 shadow hover:bg-gray-50 transition-colors"
                                @click="toggleGroupByProvince"
                            >
                                <component
                                    :is="MapIcon"
                                    class="w-5 text-black/70 hover:text-primary"
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ groupByProvince ? 'Organiser par défaut' : 'Organiser par province' }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <button
                                class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 shadow hover:bg-gray-50 transition-colors"
                                @click="toggleDisplayMode"
                            >
                                <component
                                    :is="displayMode === 'cards' ? QueueListIcon : Squares2X2Icon"
                                    class="w-5 text-black/70 hover:text-primary"
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ displayMode === 'cards' ? 'Vue tableau' : 'Vue cartes' }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>

        <template v-if="groups.length > 0">
            <Tabs
                v-model="selectedType"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="me"
                        class="w-full md:w-48 h-12"
                    >
                        Mes remplacements
                    </TabsTrigger>
                    <TabsTrigger
                        value="groups"
                        class="w-full md:w-48 h-12"
                    >
                        Mon groupe
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Replacement
                v-if="selectedType === 'me'"
                type="me"
                :filters="selectedFilters"
                :group-by-province="groupByProvince"
                :display-mode="displayMode"
            />
            <Replacement
                v-else-if="selectedType === 'groups'"
                type="groups"
                :filters="selectedFilters"
                :group-by-province="groupByProvince"
                :display-mode="displayMode"
            />
        </template>

        <template v-else>
            <Replacement
                type="me"
                :filters="selectedFilters"
                :group-by-province="groupByProvince"
                :display-mode="displayMode"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { Squares2X2Icon, QueueListIcon, FunnelIcon, ArrowLeftIcon, MapIcon } from '@heroicons/vue/24/outline';
import { useCookie } from '#app';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Replacement from '~/components/Replacement.vue';
import { goBack } from '~/lib/utils';

const replacementTypeFilters = {
    all: 'Tous',
    classic: 'Classique',
    urgent: 'Urgent',
};

const replacementRoleFilters = {
    all: 'Tous',
    nurse: 'Infirmier(ère)',
    caregiver: 'Aide soignant(e)',
    midwife: 'Sage-femme',
};

const selectedFilters = ref({
    type: 'all',
    role: 'all',
});

const filterCookies = useCookie<{ type: string; role: string }>('selectedFilters', {
    default: () => ({ type: 'all', role: 'all' }),
});

const displayModeCookie = useCookie<'cards' | 'table'>('displayMode', {
    default: () => 'cards',
});
const displayMode = ref<'cards' | 'table'>(displayModeCookie.value);

const groupByProvince = ref(false);
const { groups, myGroups } = useGroup();

// const currentIcon = computed(() => (groupByProvince.value ? QueueListIcon : Squares2X2Icon));

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

const selectedType = ref('me');

onMounted(() => {
    if (filterCookies.value) {
        selectedFilters.value = filterCookies.value;
    }
});

watch(selectedFilters, (newFilters) => {
    filterCookies.value = newFilters;
});

await myGroups();

useHead({
    title: 'Mes remplacements',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
