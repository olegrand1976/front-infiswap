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
                        <BreadcrumbPage>{{ t('replacements.myTitle') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <h1 class="mt-4 font-secondary text-xl sm:text-2xl font-semibold">
            {{ t('replacements.myTitle') }}
        </h1>

        <Tabs
            v-if="groups.length > 0"
            v-model="selectedType"
            class="mt-4 mb-4"
        >
            <TabsList class="w-full">
                <TabsTrigger
                    value="me"
                    class="w-full md:w-48 h-12"
                >
                    {{ t('replacements.myTitle') }}
                </TabsTrigger>
                <TabsTrigger
                    value="groups"
                    class="w-full md:w-48 h-12"
                >
                    {{ t('replacements.myGroup') }}
                </TabsTrigger>
            </TabsList>
        </Tabs>

        <Replacement
            :type="selectedType === 'groups' ? 'groups' : 'me'"
            :filters="selectedFilters"
            :group-by-province="groupByProvince"
            :display-mode="displayMode"
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
import { ArrowLeft, CircleCheck, LayoutGrid, List, Map, Table, Users } from 'lucide-vue-next';
import { useCookie } from '#app';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Replacement from '~/components/Replacement.vue';
import ConfirmProfileCountryModal from '~/components/replacements/ConfirmProfileCountryModal.vue';
import { goBack } from '~/lib/utils';
import { normalizeSelectedFilters } from '~/utils/selectedFilters';
import { useConfirmProfileCountry } from '~/composables/useConfirmProfileCountry';

const { t } = useI18n();
const localePath = useLocalePath();

const {
    showModal: showCountryModal,
    pending: countryPending,
    ensureProfileCountry,
    onSelect: onCountrySelect,
    cancel: cancelCountryModal,
} = useConfirmProfileCountry();

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

const replacementStatusFilters = computed(() => ({
    open: t('replacements.statusOpenFilter'),
    closed: t('replacements.statusClosedFilter'),
    all: t('common.all'),
}));

const selectedFilters = ref({
    type: 'all',
    role: 'all',
    status: 'open',
});

const filterCookies = useCookie<{ type: string; role: string; status: string }>('selectedFilters', {
    default: () => ({ type: 'all', role: 'all', status: 'open' }),
});

const displayModeCookie = useCookie<'cards' | 'table'>('displayMode', {
    default: () => 'cards',
});
const displayMode = ref<'cards' | 'table'>(displayModeCookie.value);

const groupByProvince = ref(false);
const { groups, myGroups } = useGroup();

const toggleDisplayMode = () => {
    displayMode.value = displayMode.value === 'cards' ? 'table' : 'cards';
    displayModeCookie.value = displayMode.value;
};

const toggleGroupByProvince = () => {
    groupByProvince.value = !groupByProvince.value;
};

const selectedType = ref('me');

onMounted(async () => {
    await ensureProfileCountry();
    if (filterCookies.value) {
        const normalized = normalizeSelectedFilters({
            type: filterCookies.value.type ?? 'all',
            role: filterCookies.value.role ?? 'all',
            status: filterCookies.value.status ?? 'open',
        });
        selectedFilters.value = normalized;
        if (filterCookies.value.type === 'urgent') {
            filterCookies.value = { ...normalized };
        }
    }
});

watch(selectedFilters, (newFilters) => {
    filterCookies.value = normalizeSelectedFilters(newFilters);
}, { deep: true });

try {
    await myGroups();
}
catch (e) {
    // groups may be empty or API unavailable — not a blocking error
    console.warn('[me.vue] myGroups failed:', e);
}

useHead({
    title: () => t('replacements.myTitle'),
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
