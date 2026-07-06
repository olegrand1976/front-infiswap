<script setup lang="ts">
import { ChevronDown, Lightbulb, Sparkles, X } from 'lucide-vue-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { filterJourneyTips } from '~/lib/networkJourney';

const {
    journeyState,
    bootstrapJourney,
    snooze,
    disable,
    navigateToQuest,
    celebrateXpGain,
    syncQuests,
} = useNetworkJourney();

const user = useUser();
const { getReports } = useReports();

const minimized = ref(false);
const showDisableDialog = ref(false);
const showTipsSheet = ref(false);
const celebrating = ref(false);
const celebrationText = ref('');

const ringRadius = 18;
const ringCircumference = 2 * Math.PI * ringRadius;
const ringOffset = computed(() => {
    const progress = journeyState.value.progressInLevel / 100;
    return ringCircumference * (1 - progress);
});

const nextQuest = computed(() => journeyState.value.nextQuest);
const showNudge = computed(() => journeyState.value.nudge?.show ?? false);
const allTips = computed(() => filterJourneyTips(
    user.value,
    journeyState.value.level,
    journeyState.value.nextQuest,
    journeyState.value.onboarding.completed_quests,
));

watch(showNudge, (active) => {
    if (active) {
        minimized.value = false;
    }
});

onMounted(async () => {
    await Promise.all([
        getReports(),
        bootstrapJourney(),
    ]);
    await syncQuests();
    triggerCelebrationIfNeeded();
});

watch(
    () => journeyState.value.totalXp,
    () => {
        triggerCelebrationIfNeeded();
    },
);

function triggerCelebrationIfNeeded() {
    const celebration = celebrateXpGain();

    if (!celebration) {
        return;
    }

    celebrationText.value = `+${celebration.gained} XP — ${celebration.levelTitle}`;
    celebrating.value = true;

    setTimeout(() => {
        celebrating.value = false;
    }, 2000);
}

async function handleQuestClick() {
    if (!nextQuest.value) {
        return;
    }

    await navigateToQuest(nextQuest.value.id);
}

async function confirmDisable() {
    showDisableDialog.value = false;
    await disable();
}
</script>

<template>
    <div
        v-if="journeyState.isVisible"
        class="relative px-3 pb-3 pt-2 sm:px-6"
    >
        <div
            v-if="minimized"
            class="flex justify-end"
        >
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary/5"
                @click="minimized = false"
            >
                <img
                    :src="journeyState.level.avatarSrc"
                    :alt="journeyState.level.avatarAlt"
                    class="size-6 object-contain"
                >
                <span>Niv. {{ journeyState.level.level }} · {{ journeyState.level.title }}</span>
            </button>
        </div>

        <div
            v-else
            :class="[
                'relative overflow-hidden rounded-2xl border p-4 shadow-sm transition',
                showNudge
                    ? 'border-amber-300/60 bg-gradient-to-r from-amber-50 via-white to-primary/5'
                    : 'border-primary/15 bg-gradient-to-r from-white via-primary/5 to-emerald-50',
                celebrating ? 'ring-2 ring-emerald-300/70' : '',
            ]"
        >
            <div
                v-if="celebrating"
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_55%)]"
            />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex min-w-0 items-center gap-3">
                    <div
                        class="relative shrink-0 transition-transform duration-300"
                        :class="celebrating ? 'scale-105' : ''"
                        :title="journeyState.level.mood"
                    >
                        <svg
                            class="size-16 -rotate-90"
                            viewBox="0 0 44 44"
                            aria-hidden="true"
                        >
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="currentColor"
                                class="text-primary/15"
                                stroke-width="4"
                            />
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="url(#journeyRingGradient)"
                                stroke-width="4"
                                stroke-linecap="round"
                                :stroke-dasharray="`${ringCircumference}`"
                                :stroke-dashoffset="`${ringOffset}`"
                            />
                            <defs>
                                <linearGradient
                                    id="journeyRingGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stop-color="hsl(var(--primary))"
                                    />
                                    <stop
                                        offset="100%"
                                        stop-color="hsl(142 71% 45%)"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                        <img
                            :src="journeyState.level.avatarSrc"
                            :alt="journeyState.level.avatarAlt"
                            class="pointer-events-none absolute inset-0 m-auto size-9 object-contain"
                        >
                    </div>

                    <div class="min-w-0">
                        <p class="text-xs font-semibold uppercase tracking-wide text-primary/80">
                            Mon réseau InfiSwap
                        </p>
                        <p class="text-sm font-semibold text-gray-900">
                            Niveau {{ journeyState.level.level }} · {{ journeyState.level.title }}
                        </p>
                        <p
                            v-if="showNudge"
                            class="mt-0.5 text-xs font-medium text-amber-800"
                        >
                            {{ journeyState.nudge?.message }}
                        </p>
                        <p
                            v-else
                            class="mt-0.5 text-xs text-muted-foreground"
                        >
                            {{ journeyState.welcomeMessage }}
                        </p>
                        <button
                            v-if="nextQuest"
                            type="button"
                            class="mt-1 inline-flex max-w-full items-center gap-1 text-left text-sm font-medium text-primary hover:underline"
                            @click="handleQuestClick"
                        >
                            <Sparkles class="size-3.5 shrink-0" />
                            <span class="truncate">
                                {{ showNudge ? 'Reprendre :' : 'Prochaine étape :' }} {{ nextQuest.cta }} →
                            </span>
                        </button>
                        <div
                            v-if="journeyState.tip"
                            class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1"
                        >
                            <p class="text-xs text-muted-foreground">
                                <Lightbulb class="mr-1 inline size-3.5 text-amber-500" />
                                Conseil : {{ journeyState.tip.text }}
                            </p>
                            <button
                                type="button"
                                class="text-xs font-medium text-primary hover:underline"
                                @click="showTipsSheet = true"
                            >
                                Voir tous les conseils
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                        v-if="celebrating"
                        class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    >
                        {{ celebrationText }}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 px-2 text-xs text-muted-foreground"
                        @click="minimized = true"
                    >
                        Réduire
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 px-2 text-xs text-muted-foreground"
                        @click="snooze()"
                    >
                        Plus tard
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 gap-1 px-2 text-xs text-muted-foreground"
                            >
                                Désactiver
                                <ChevronDown class="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="snooze()">
                                Masquer 7 jours
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="showDisableDialog = true">
                                Désactiver le parcours
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        type="button"
                        class="rounded p-1 text-muted-foreground hover:bg-black/5 sm:hidden"
                        aria-label="Réduire"
                        @click="minimized = true"
                    >
                        <X class="size-4" />
                    </button>
                </div>
            </div>
        </div>

        <Sheet v-model:open="showTipsSheet">
            <SheetContent class="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Conseils d'utilisation</SheetTitle>
                </SheetHeader>
                <ul class="mt-4 space-y-3">
                    <li
                        v-for="tip in allTips"
                        :key="tip.id"
                        class="rounded-lg border border-primary/10 bg-primary/5 px-3 py-2"
                    >
                        <p class="text-xs font-semibold uppercase tracking-wide text-primary/70">
                            {{ tip.category }}
                        </p>
                        <p class="mt-1 text-sm text-gray-800">
                            {{ tip.text }}
                        </p>
                    </li>
                </ul>
            </SheetContent>
        </Sheet>

        <AlertDialog v-model:open="showDisableDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Désactiver le parcours ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vous pourrez le réactiver quand vous voulez depuis Mon compte → Mon réseau InfiSwap.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction @click="confirmDisable">
                        Désactiver
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
