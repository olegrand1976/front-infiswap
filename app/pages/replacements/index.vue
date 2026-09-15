<template>
    <div class="container pb-8 relative">
        <div class="text-center my-4">
            <p class="text-muted-foreground font-light text-base md:text-lg">
                {{ t('replacements.search.exploreSubtitle') }}
            </p>
        </div>

        <div class="max-w-2xl mx-auto mb-12">
            <div class="bg-surface rounded-md p-2 shadow-sm border border-border flex flex-col md:flex-row items-center gap-2">
                <div class="w-full flex-1 flex items-center px-3 relative">
                    <Search class="w-4 h-4 text-muted-foreground absolute left-4 pointer-events-none" />
                    <Input
                        v-model="searchKeyword"
                        :placeholder="t('replacements.search.searchPlaceholder')"
                        class="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                    />
                </div>

                <Button
                    class="w-full md:w-auto rounded-md px-8"
                    type="button"
                    @click="handleSearch"
                >
                    <Search class="w-4 h-4" />
                    {{ t('common.search') }}
                </Button>
            </div>
        </div>

        <div class="lg:hidden flex justify-end mb-4">
            <Sheet>
                <SheetTrigger as-child>
                    <Button
                        variant="outline"
                        type="button"
                        class="relative rounded-md gap-2"
                    >
                        <SlidersHorizontal class="w-4 h-4" />
                        {{ t('replacements.filtersTitle') }}
                        <Badge
                            v-if="hasActiveFilters"
                            class="!h-5 !w-5 justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground absolute -top-2 -right-2"
                        >
                            {{ activeFilterCount }}
                        </Badge>
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    class="w-80 max-w-[85vw] overflow-y-auto bg-primary p-5 text-primary-foreground [&>button]:hidden"
                >
                    <SheetHeader class="mb-5 flex-row items-center justify-between border-b border-primary-foreground/20 pb-4">
                        <SheetTitle class="text-primary-foreground">
                            {{ t('replacements.filtersTitle') }}
                        </SheetTitle>
                        <SheetClose as-child>
                            <button
                                type="button"
                                :aria-label="t('common.close')"
                                class="text-primary-foreground/80 hover:text-primary-foreground"
                            >
                                <X class="w-5 h-5" />
                            </button>
                        </SheetClose>
                    </SheetHeader>

                    <ReplacementsFiltersPanel
                        v-model:filters="filters"
                        :days="daysOfWeek"
                        @toggle-day="toggleDay"
                        @reset="resetFilters"
                    />
                </SheetContent>
            </Sheet>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[22%_1fr_22%] gap-8 items-start">
            <aside class="hidden lg:block bg-primary rounded-md p-5">
                <div class="flex items-center justify-between mb-5 pb-4 border-b border-primary-foreground/20">
                    <h2 class="text-base font-bold text-primary-foreground">
                        {{ t('replacements.filtersTitle') }}
                    </h2>
                    <SlidersHorizontal class="w-4 h-4 text-primary-foreground cursor-pointer" />
                </div>

                <ReplacementsFiltersPanel
                    v-model:filters="filters"
                    :days="daysOfWeek"
                    @toggle-day="toggleDay"
                    @reset="resetFilters"
                />
            </aside>

            <main class="space-y-10">
                <div v-if="featuredReplacement || featuredMission">
                    <h3 class="font-secondary text-xl font-extrabold text-foreground flex items-center gap-2 mb-6">
                        <span class="text-primary text-2xl">★</span> {{ t('replacements.search.featuredHeading') }}
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card
                            v-if="featuredReplacement"
                            variant="none"
                            class="bg-surface p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
                        >
                            <div>
                                <div class="flex items-center mb-5">
                                    <span class="text-primary text-[10px] font-black uppercase tracking-widest">{{ t('replacements.typeReplacementLabel') }}</span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <Calendar class="w-5 h-5 text-primary" />
                                    </div>
                                    <div class="space-y-1">
                                        <h4 class="font-primary text-sm font-bold text-foreground tabular-nums">
                                            {{ featuredReplacement.date }}
                                            <span
                                                v-if="featuredReplacement.periods && featuredReplacement.periods.length > 1"
                                                class="text-primary"
                                            >
                                                {{ t('replacements.extraPeriods', { n: featuredReplacement.periods.length - 1 }, featuredReplacement.periods.length - 1) }}
                                            </span>
                                        </h4>
                                        <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                                            <MapPin class="w-3.5 h-3.5 shrink-0" />
                                            <span>{{ featuredReplacement.city }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-4 mt-5 ml-15">
                                    <div
                                        v-for="slot in featuredReplacement.slots"
                                        :key="slot"
                                        class="flex items-center gap-1.5"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <NuxtLink
                                    :to="`/replacements/${featuredReplacement.id}?type=replacement`"
                                    class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                    {{ t('replacements.seeMore') }}
                                </NuxtLink>
                            </div>
                        </Card>

                        <Card
                            v-if="featuredMission"
                            variant="none"
                            class="bg-surface p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
                        >
                            <div>
                                <div class="flex items-center mb-5">
                                    <span class="text-success text-[10px] font-black uppercase tracking-widest">{{ t('replacements.typeMissionLabel') }}</span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-success/10 flex items-center justify-center shrink-0">
                                        <Briefcase class="w-5 h-5 text-success" />
                                    </div>
                                    <div class="space-y-0.5 text-muted-foreground">
                                        <h4 class="text-sm font-bold text-foreground">
                                            {{ featuredMission.institution?.name ?? featuredMission.city }}
                                        </h4>
                                        <p
                                            v-if="featuredMission.institution?.contract"
                                            class="text-xs font-semibold text-primary"
                                        >
                                            {{ featuredMission.institution.contract }}
                                        </p>
                                    </div>
                                </div>

                                <div class="flex gap-4 mt-5 ml-15">
                                    <div
                                        v-for="slot in featuredMission.slots"
                                        :key="slot"
                                        class="flex items-center gap-1.5"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <NuxtLink
                                    :to="`/replacements/${featuredMission.id}?type=mission`"
                                    class="inline-flex items-center gap-1 text-xs font-bold text-success hover:underline"
                                >
                                    {{ t('replacements.seeMore') }}
                                </NuxtLink>
                            </div>
                        </Card>
                    </div>
                </div>

                <div>
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
                        <h3 class="font-secondary text-xl font-extrabold text-foreground">
                            {{ t('replacements.search.resultsHeading') }} <span class="text-primary tabular-nums">({{ totalCount }})</span>
                        </h3>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ t('replacements.search.sortLabel') }}</span>
                            <Select v-model="sortBy">
                                <SelectTrigger class="rounded-md h-8 text-xs font-semibold w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent class="rounded-md">
                                    <SelectItem value="Plus récents">
                                        {{ t('replacements.search.sortRecent') }}
                                    </SelectItem>
                                    <SelectItem value="Plus anciens">
                                        {{ t('replacements.search.sortOldest') }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div
                        v-if="pending"
                        class="grid grid-cols-1 gap-5"
                    >
                        <Card
                            v-for="n in 3"
                            :key="n"
                            variant="none"
                            class="bg-surface border rounded-md p-5 flex flex-col gap-3"
                        >
                            <div class="flex items-start gap-3">
                                <Skeleton class="w-10 h-10 rounded-md shrink-0" />
                                <div class="flex-1 space-y-2">
                                    <Skeleton class="h-4 w-40" />
                                    <Skeleton class="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton class="h-3 w-full" />
                            <Skeleton class="h-3 w-2/3" />
                            <div class="flex gap-3 pt-3 border-t border-border">
                                <Skeleton class="h-4 w-16" />
                                <Skeleton class="h-4 w-16" />
                            </div>
                        </Card>
                    </div>

                    <div
                        v-else
                        class="grid grid-cols-1 gap-5"
                    >
                        <Card
                            v-for="item in listResults"
                            :key="`${item.type}-${item.id}`"
                            variant="none"
                            class="relative bg-surface border rounded-md p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-200"
                        >
                            <Badge
                                v-if="item.isNew"
                                variant="outline"
                                class="!h-auto !w-auto absolute top-0 right-4 -translate-y-1/2 rounded-full bg-accent-green text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md"
                            >
                                {{ t('replacements.newBadge') }}
                            </Badge>

                            <div class="flex items-start gap-3">
                                <div :class="['w-10 h-10 rounded-md flex items-center justify-center shrink-0', item.type === 'replacement' ? 'bg-primary/10' : 'bg-success/10']">
                                    <Calendar
                                        v-if="item.type === 'replacement'"
                                        class="w-4.5 h-4.5 text-primary"
                                    />
                                    <Briefcase
                                        v-else
                                        class="w-4.5 h-4.5 text-success"
                                    />
                                </div>
                                <div>
                                    <h4 class="font-primary text-sm font-bold text-foreground tabular-nums">
                                        {{ item.date }}
                                        <span
                                            v-if="item.periods && item.periods.length > 1"
                                            class="text-primary"
                                        >
                                            {{ t('replacements.extraPeriods', { n: item.periods.length - 1 }, item.periods.length - 1) }}
                                        </span>
                                    </h4>
                                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                                        <MapPin class="w-3 h-3 shrink-0" />
                                        <span>
                                            {{ item.cities.length ? visibleTags(item.cities).shown.join(', ') : t('replacements.search.placeToConfirm') }}
                                            <span
                                                v-if="visibleTags(item.cities).extra > 0"
                                                class="text-primary font-bold"
                                            >
                                                +{{ visibleTags(item.cities).extra }}
                                            </span>
                                            <template v-if="item.country">, {{ item.country }}</template>
                                        </span>
                                    </div>
                                </div>
                                <div
                                    v-if="item.isUrgent"
                                    class="flex flex-col text-destructive items-center gap-0.5 shrink-0 ml-auto"
                                >
                                    <ShieldAlert class="size-10" />
                                    <span class="text-[8px] uppercase font-bold">{{ t('replacements.typeUrgent') }}</span>
                                </div>
                            </div>

                            <div
                                v-if="item.institution"
                                class="flex items-center gap-2 bg-surface-subtle rounded-md px-2.5 py-2"
                            >
                                <span class="w-6 h-6 rounded shrink-0 bg-success/20 text-success flex items-center justify-center text-[10px] font-black">
                                    {{ item.institution.initial }}
                                </span>
                                <div class="leading-tight">
                                    <p class="text-xs font-bold text-foreground">
                                        {{ item.institution.name }}
                                    </p>
                                    <p class="text-[10px] text-muted-foreground">
                                        {{ item.institution.contract }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-start gap-2">
                                <MapPin class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <p class="text-xs font-semibold text-foreground">
                                    {{ visibleTags(item.zipCodes).shown.join(', ') }}
                                    <span
                                        v-if="visibleTags(item.zipCodes).extra > 0"
                                        class="text-primary font-bold"
                                    >
                                        +{{ visibleTags(item.zipCodes).extra }}
                                    </span>
                                </p>
                            </div>

                            <div class="flex items-start gap-2">
                                <Activity class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <p class="text-xs font-semibold text-foreground">
                                    {{ visibleTags(item.careTypes).shown.join(', ') }}
                                    <span
                                        v-if="visibleTags(item.careTypes).extra > 0"
                                        class="text-primary font-bold"
                                    >
                                        +{{ visibleTags(item.careTypes).extra }}
                                    </span>
                                </p>
                            </div>

                            <p
                                v-if="item.description"
                                class="text-xs text-muted-foreground italic line-clamp-2"
                            >
                                {{ item.description }}
                            </p>

                            <div class="flex items-center justify-between gap-3 pt-3 border-t border-border mt-auto">
                                <div class="flex gap-3">
                                    <div
                                        v-for="slot in item.slots"
                                        :key="slot"
                                        class="flex items-center gap-1"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3">
                                    <span
                                        v-if="item.patientsPerDay"
                                        class="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
                                    >
                                        <Users class="w-3.5 h-3.5 text-primary" />
                                        {{ item.patientsPerDay }}/j
                                    </span>
                                    <NuxtLink
                                        :to="`/replacements/${item.id}?type=${item.type}`"
                                        class="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                        :class="item.type === 'replacement' ? 'text-primary' : 'text-success'"
                                    >
                                        {{ t('replacements.seeMore') }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div
                    v-if="lastPage > 1"
                    class="mt-6 flex justify-center"
                >
                    <nav class="flex items-center gap-1">
                        <button
                            class="w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-surface-subtle text-muted-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            type="button"
                            :disabled="currentPage <= 1"
                            @click="goToPage(currentPage - 1)"
                        >
                            <ArrowLeft class="w-3.5 h-3.5" />
                        </button>

                        <template
                            v-for="(page, index) in pageItems"
                            :key="index"
                        >
                            <span
                                v-if="page === 'ellipsis'"
                                class="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
                            >
                                ...
                            </span>
                            <button
                                v-else
                                type="button"
                                :class="[
                                    'w-9 h-9 flex items-center justify-center rounded-md font-bold text-sm transition-colors border',
                                    page === currentPage
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-surface text-foreground border-border hover:bg-surface-subtle hover:border-border/70',
                                ]"
                                @click="goToPage(page)"
                            >
                                {{ page }}
                            </button>
                        </template>

                        <button
                            class="w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-surface-subtle text-muted-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            type="button"
                            :disabled="currentPage >= lastPage"
                            @click="goToPage(currentPage + 1)"
                        >
                            <ArrowRight class="w-3.5 h-3.5" />
                        </button>
                    </nav>
                </div>
            </main>

            <div class="hidden xl:flex flex-col gap-6 self-stretch">
                <div
                    v-if="soonItems.length"
                    class="bg-surface rounded-md border border-border p-5"
                >
                    <h2 class="font-secondary text-sm font-extrabold text-foreground mb-4">
                        {{ t('replacements.search.soonHeading') }}
                    </h2>
                    <div class="divide-y divide-border">
                        <div
                            v-for="soonItem in soonItems"
                            :key="soonItem.title"
                            class="py-3 first:pt-0 last:pb-0 flex flex-col gap-1"
                        >
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Calendar
                                        v-if="soonItem.type === 'replacement'"
                                        class="w-3.5 h-3.5 text-primary shrink-0"
                                    />
                                    <Briefcase
                                        v-else
                                        class="w-3.5 h-3.5 text-success shrink-0"
                                    />
                                    <span class="font-primary text-xs font-bold text-foreground tabular-nums truncate">{{ soonItem.title }}</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    class="!h-auto !w-auto shrink-0 rounded-full text-[10px] font-black px-2 py-0.5"
                                    :class="soonItem.urgency === 'critical' ? 'bg-destructive/12 text-destructive' : soonItem.urgency === 'soon' ? 'bg-warning/20 text-warning' : 'bg-surface-subtle text-muted-foreground'"
                                >
                                    {{ soonItem.countdown }}
                                </Badge>
                            </div>
                            <p class="text-xs text-muted-foreground pl-5">
                                {{ soonItem.meta }}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="!isLoggedIn"
                    class="bg-primary rounded-md p-6 flex flex-col items-center text-center gap-3 sticky top-20"
                >
                    <div class="w-11 h-11 rounded-md bg-primary-foreground/15 flex items-center justify-center text-primary-foreground shrink-0">
                        <UserPlus class="w-5 h-5" />
                    </div>
                    <h3 class="font-secondary text-sm font-extrabold text-primary-foreground leading-snug">
                        {{ t('replacements.freeAccountHeading') }}
                    </h3>
                    <p class="text-primary-foreground/70 text-xs font-light">
                        {{ t('replacements.freeAccountDesc') }}
                    </p>
                    <Button
                        href="/register"
                        class="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
                    >
                        {{ t('replacements.createAccountCta') }}
                    </Button>
                </div>

                <div
                    v-if="showPremiumPromo"
                    class="bg-primary rounded-md p-6 flex flex-col items-center text-center gap-3 sticky top-20"
                >
                    <div class="w-11 h-11 rounded-md bg-primary-foreground/15 flex items-center justify-center text-primary-foreground shrink-0">
                        <Crown class="w-5 h-5" />
                    </div>
                    <span class="text-xs font-bold uppercase tracking-wide text-primary-foreground/80">
                        {{ premiumBadge }}
                    </span>
                    <h3 class="font-secondary text-base font-extrabold text-primary-foreground leading-snug">
                        {{ premiumTitle }}
                    </h3>
                    <p class="text-primary-foreground/70 text-sm font-light">
                        {{ premiumSubtitle }}
                    </p>
                    <NuxtLink
                        :to="localePath('/dashboard/subscriptions')"
                        class="inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-bold text-primary hover:bg-primary-foreground/90"
                        @click="trackEvent('pro_upsell_click', { source: 'public_replacements' })"
                    >
                        {{ premiumCta }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import {
    SlidersHorizontal,
    Calendar,
    MapPin,
    Check,
    Briefcase,
    Search,
    ArrowLeft,
    ArrowRight,
    UserPlus,
    Activity,
    Users,
    ShieldAlert,
    Crown,
    X,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { mapApiRecordToListing } from '~/lib/replacementsApi';

const { t } = useI18n();
const { isLoggedIn } = useAuth();
const { isPremium: isProSubscriber, fetchStatus: fetchProStatus } = useProSubscription();
const { badge: premiumBadge, title: premiumTitle, subtitle: premiumSubtitle, cta: premiumCta } = usePremiumMarketing();
const localePath = useLocalePath();
const { trackEvent } = useProductAnalytics();

if (isLoggedIn.value) {
    fetchProStatus();
}
const { $apifetch } = useNuxtApp();

useHead(() => ({
    title: t('replacements.search.pageTitle'),
    meta: [
        {
            name: 'description',
            content: t('replacements.search.metaDescription'),
        },
    ],
}));

definePageMeta({
    layout: 'replacements',
});

const searchKeyword = ref('');
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const DAY_TO_ENGLISH: Record<string, string> = {
    Lundi: 'monday',
    Mardi: 'tuesday',
    Mercredi: 'wednesday',
    Jeudi: 'thursday',
    Vendredi: 'friday',
};

const DEFAULT_FILTERS = {
    topReplacements: true,
    days: [] as string[],
    province: '',
    showReplacements: true,
    showMissions: true,
    zipCode: '',
    city: '',
};

const filters = reactive({ ...DEFAULT_FILTERS, days: [] as string[] });

const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.topReplacements !== DEFAULT_FILTERS.topReplacements) count++;
    if (filters.days.length > 0) count++;
    if (filters.province !== DEFAULT_FILTERS.province) count++;
    if (!filters.showReplacements || !filters.showMissions) count++;
    if (filters.zipCode.trim() !== '') count++;
    if (filters.city.trim() !== '') count++;
    return count;
});
const hasActiveFilters = computed(() => activeFilterCount.value > 0);

const toggleDay = (day: string, checked: boolean) => {
    if (checked) {
        if (!filters.days.includes(day)) filters.days.push(day);
        return;
    }
    filters.days = filters.days.filter(d => d !== day);
};

const sortBy = ref('Plus récents');
const currentPage = ref(1);
const perPage = 10;

function buildSearchPayload() {
    const cities = filters.city.trim() ? [filters.city.trim()] : [];
    const zipCodes = filters.zipCode.trim() ? [filters.zipCode.trim()] : [];

    // The single search box doesn't distinguish a zip code from a city name.
    const keyword = searchKeyword.value.trim();
    if (keyword) {
        if (/^\d+$/.test(keyword)) zipCodes.push(keyword);
        else cities.push(keyword);
    }

    return {
        perPage,
        page: currentPage.value,
        provinces: filters.province ? [filters.province] : [],
        cities,
        zipCodes,
        days: filters.days.map(day => DAY_TO_ENGLISH[day]).filter(Boolean),
        filters: { status: 'open' },
    };
}

interface SearchMergedResponse {
    replacements: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any[];
        total: number;
        last_page: number;
    };
}

const { data: searchResponse, pending, refresh: refreshResults } = await useAsyncData<SearchMergedResponse>(
    'replacements-search',
    () => $apifetch('/api/replacements/search/merged', {
        method: 'POST',
        body: buildSearchPayload(),
    }),
);

const listingLabels = computed(() => ({
    placeToConfirm: t('replacements.search.placeToConfirm'),
    morning: t('replacements.table.colMorning'),
    afternoon: t('replacements.afternoonSlot'),
    evening: t('replacements.table.colEvening'),
    fullDay: t('replacements.fullDaySlot'),
}));

// Zip codes / care types can hold anywhere from 1 to 10+ values — only the
// first 3 are shown, the rest collapse into a "+N" chip (see visibleTags).
const mappedResults = computed(() =>
    (searchResponse.value?.replacements?.data ?? []).map(record => mapApiRecordToListing(record, listingLabels.value)),
);

const listResults = computed(() => {
    let items = mappedResults.value;

    if (!filters.showReplacements) items = items.filter(item => item.type !== 'replacement');
    if (!filters.showMissions) items = items.filter(item => item.type !== 'mission');
    if (filters.topReplacements) {
        items = [...items].sort((a, b) => Number(b.isBoosted ?? false) - Number(a.isBoosted ?? false));
    }
    if (sortBy.value === 'Plus anciens') items = [...items].reverse();

    return items;
});

const totalCount = computed(() => searchResponse.value?.replacements?.total ?? 0);
const lastPage = computed(() => Math.max(1, searchResponse.value?.replacements?.last_page ?? 1));

const pageItems = computed(() => {
    const total = lastPage.value;
    const current = currentPage.value;
    const numbers = [...new Set([1, total, current - 1, current, current + 1])]
        .filter(page => page >= 1 && page <= total)
        .sort((a, b) => a - b);

    const items: Array<number | 'ellipsis'> = [];
    numbers.forEach((page, index) => {
        if (index > 0 && page - numbers[index - 1] > 1) items.push('ellipsis');
        items.push(page);
    });

    return items;
});

function goToPage(page: number) {
    if (page < 1 || page > lastPage.value) return;
    currentPage.value = page;
}

const featuredReplacement = computed(() => mappedResults.value.find(item => item.type === 'replacement'));
const featuredMission = computed(() => mappedResults.value.find(item => item.type === 'mission'));

const soonItems = computed(() => {
    const now = Date.now();

    return mappedResults.value
        .filter(item => item.startDateIso && new Date(item.startDateIso).getTime() >= now)
        .sort((a, b) => new Date(a.startDateIso!).getTime() - new Date(b.startDateIso!).getTime())
        .slice(0, 4)
        .map((item) => {
            const days = Math.max(0, Math.ceil((new Date(item.startDateIso!).getTime() - now) / 86_400_000));

            return {
                type: item.type,
                title: `${item.date} → ${item.city}`,
                meta: item.institution
                    ? [item.institution.name, item.careTypes[0]].filter(Boolean).join(' · ')
                    : (item.careTypes[0] ?? item.city),
                countdown: `J-${days}`,
                urgency: days <= 3 ? 'critical' : days <= 10 ? 'soon' : 'calm',
            };
        });
});

const showPremiumPromo = computed(() =>
    isLoggedIn.value && !isProSubscriber.value && soonItems.value.length === 0,
);

watch(showPremiumPromo, (visible) => {
    if (visible) {
        trackEvent('pro_upsell_impression', { source: 'public_replacements' });
    }
});

const visibleTags = (tags: string[], max = 3) => ({
    shown: tags.slice(0, max),
    extra: Math.max(0, tags.length - max),
});

const debouncedRefresh = useDebounceFn(() => {
    currentPage.value = 1;
    refreshResults();
}, 300);

watch(() => [filters.province, filters.city, filters.zipCode, filters.days.join(',')], debouncedRefresh);
watch(currentPage, () => refreshResults());

const handleSearch = () => {
    currentPage.value = 1;
    refreshResults();
};

const resetFilters = () => {
    Object.assign(filters, DEFAULT_FILTERS, { days: [] as string[] });
    searchKeyword.value = '';
    currentPage.value = 1;
    refreshResults();
};
</script>

<style scoped>
.ml-15 {
    margin-left: 3.75rem;
}
@media (max-width: 640px) {
    .ml-15 {
        margin-left: 0;
    }
}
</style>
