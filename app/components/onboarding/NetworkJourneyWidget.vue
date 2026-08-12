<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight, Lightbulb, Sparkles, X } from 'lucide-vue-next';
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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { filterJourneyTips } from '~/lib/networkJourney';

const TIPS_DISMISSED_KEY = 'journey_tips_dismissed';

const {
    journeyState,
    bootstrapJourney,
    snooze,
    disable,
    navigateToQuest,
    celebrateXpGain,
    syncQuests,
    persistTipsAutoOpenDisabled,
    resetCelebrationBaseline,
} = useNetworkJourney();
const { requestEngagement } = usePostSuccessEngagement();

const user = useUser();
const { getReports } = useReports();

const minimized = ref(false);
const showDisableDialog = ref(false);
const showTipsModal = ref(false);
const currentTipIndex = ref(0);
const dontShowTipsAgain = ref(false);
const celebrating = ref(false);
const celebrationText = ref('');
const wasJourneyComplete = ref(journeyState.value.isComplete);
let celebrationTimer: ReturnType<typeof setTimeout> | null = null;

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
const currentTip = computed(() => allTips.value[currentTipIndex.value] ?? null);
const hasPreviousTip = computed(() => currentTipIndex.value > 0);
const hasNextTip = computed(() => currentTipIndex.value < allTips.value.length - 1);

watch(showNudge, (active) => {
    if (active) {
        minimized.value = false;
    }
});

watch(allTips, (tips) => {
    if (currentTipIndex.value >= tips.length) {
        currentTipIndex.value = Math.max(0, tips.length - 1);
    }
});

watch(showTipsModal, async (open, wasOpen) => {
    if (open) {
        dontShowTipsAgain.value = false;
        return;
    }

    if (!wasOpen || !import.meta.client) {
        return;
    }

    sessionStorage.setItem(TIPS_DISMISSED_KEY, '1');

    if (dontShowTipsAgain.value) {
        await persistTipsAutoOpenDisabled();
    }
});

onMounted(async () => {
    await Promise.all([
        getReports(),
        bootstrapJourney(),
    ]);
    await syncQuests();
    resetCelebrationBaseline();
    maybeOpenTipsOnLogin();
});

watch(
    () => journeyState.value.totalXp,
    () => {
        triggerCelebrationIfNeeded();
    },
);

function maybeOpenTipsOnLogin() {
    if (!import.meta.client || !allTips.value.length) {
        return;
    }

    if (journeyState.value.onboarding.tips_auto_open_disabled) {
        return;
    }

    if (sessionStorage.getItem(TIPS_DISMISSED_KEY)) {
        return;
    }

    openTipsModal();
}

function openTipsModal() {
    currentTipIndex.value = 0;
    showTipsModal.value = true;
}

function toggleTipsModal() {
    showTipsModal.value = !showTipsModal.value;

    if (showTipsModal.value) {
        currentTipIndex.value = 0;
    }
}

function previousTip() {
    if (hasPreviousTip.value) {
        currentTipIndex.value -= 1;
    }
}

function nextTip() {
    if (hasNextTip.value) {
        currentTipIndex.value += 1;
    }
}

function triggerCelebrationIfNeeded() {
    const celebration = celebrateXpGain();

    if (!celebration) {
        return;
    }

    celebrationText.value = `+${celebration.gained} XP — ${celebration.levelTitle}`;
    celebrating.value = true;

    const journeyJustCompleted = !wasJourneyComplete.value && journeyState.value.isComplete;
    wasJourneyComplete.value = journeyState.value.isComplete;

    if (celebrationTimer) {
        clearTimeout(celebrationTimer);
    }

    celebrationTimer = setTimeout(() => {
        celebrating.value = false;
        if (journeyJustCompleted) {
            requestEngagement('onboarding_complete');
        }
        celebrationTimer = null;
    }, 2000);
}

onBeforeUnmount(() => {
    if (celebrationTimer) {
        clearTimeout(celebrationTimer);
    }
});

async function handleQuestClick() {
    if (!nextQuest.value) {
        return;
    }

    showTipsModal.value = false;
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
        class="relative px-3 py-1.5 sm:px-6"
    >
        <div
            v-if="minimized"
            class="flex justify-end"
        >
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-2.5 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-primary/5"
                @click="minimized = false"
            >
                <img
                    :src="journeyState.level.avatarSrc"
                    :alt="journeyState.level.avatarAlt"
                    class="size-5 object-contain"
                >
                <span>Niv. {{ journeyState.level.level }} · {{ journeyState.level.title }}</span>
            </button>
        </div>

        <div
            v-else
            :class="[
                'relative overflow-hidden rounded-lg border px-2.5 py-1.5 shadow-sm transition',
                showNudge
                    ? 'border-amber-300/60 bg-gradient-to-r from-amber-50 via-white to-primary/5'
                    : 'border-primary/15 bg-gradient-to-r from-white via-primary/5 to-emerald-50',
                celebrating ? 'ring-1 ring-emerald-300/70' : '',
            ]"
        >
            <div
                v-if="celebrating"
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_55%)]"
            />

            <div class="relative flex items-center gap-2">
                <div
                    class="relative size-9 shrink-0 transition-transform duration-300"
                    :class="celebrating ? 'scale-105' : ''"
                    :title="journeyState.level.mood"
                >
                    <svg
                        class="size-9 -rotate-90"
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
                        class="pointer-events-none absolute inset-0 m-auto size-5 object-contain"
                    >
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <p class="text-xs font-semibold text-gray-900">
                            Niv. {{ journeyState.level.level }} · {{ journeyState.level.title }}
                        </p>
                        <button
                            v-if="nextQuest"
                            type="button"
                            class="inline-flex max-w-full items-center gap-1 text-left text-xs font-medium text-primary hover:underline"
                            @click="handleQuestClick"
                        >
                            <Sparkles class="size-3 shrink-0" />
                            <span class="truncate">
                                {{ showNudge ? 'Reprendre :' : 'Étape :' }} {{ nextQuest.cta }} →
                            </span>
                        </button>
                    </div>
                    <p
                        v-if="showNudge"
                        class="truncate text-[11px] font-medium text-amber-800"
                    >
                        {{ journeyState.nudge?.message }}
                    </p>
                </div>

                <div class="flex shrink-0 items-center gap-0.5">
                    <span
                        v-if="celebrating"
                        class="mr-1 hidden rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:inline"
                    >
                        {{ celebrationText }}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="h-7 gap-1 px-1.5 text-xs"
                        :class="showTipsModal ? 'text-primary' : 'text-muted-foreground'"
                        :aria-label="'Conseils'"
                        @click="toggleTipsModal"
                    >
                        <Lightbulb class="size-3.5" />
                        <span class="hidden sm:inline">Conseils</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        class="hidden h-7 px-1.5 text-xs text-muted-foreground sm:inline-flex"
                        @click="minimized = true"
                    >
                        Réduire
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="h-7 gap-0.5 px-1.5 text-xs text-muted-foreground"
                                aria-label="Options parcours"
                            >
                                <ChevronDown class="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="snooze()">
                                Plus tard (7 jours)
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="minimized = true">
                                Réduire
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
                        <X class="size-3.5" />
                    </button>
                </div>
            </div>
        </div>

        <Dialog v-model:open="showTipsModal">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Conseils d'utilisation</DialogTitle>
                </DialogHeader>

                <div
                    v-if="currentTip"
                    class="rounded-lg border border-primary/10 bg-primary/5 px-4 py-3"
                >
                    <p class="text-xs font-semibold uppercase tracking-wide text-primary/70">
                        {{ currentTip.category }}
                    </p>
                    <p class="mt-2 text-sm text-gray-800">
                        {{ currentTip.text }}
                    </p>
                </div>

                <p
                    v-else
                    class="text-sm text-muted-foreground"
                >
                    Aucun conseil disponible pour le moment.
                </p>

                <label class="flex cursor-pointer items-start gap-2 rounded-md border border-primary/10 bg-muted/30 px-3 py-2">
                    <Checkbox
                        :checked="dontShowTipsAgain"
                        class="mt-0.5"
                        @update:checked="(checked) => { dontShowTipsAgain = checked === true; }"
                    />
                    <span class="text-sm text-muted-foreground">
                        Ne plus afficher automatiquement à la connexion
                    </span>
                </label>

                <DialogFooter class="flex-col gap-3 sm:flex-row sm:justify-between">
                    <p class="text-xs text-muted-foreground">
                        {{ allTips.length ? currentTipIndex + 1 : 0 }} / {{ allTips.length }}
                    </p>
                    <div class="flex w-full gap-2 sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            class="flex-1 sm:flex-none"
                            :disabled="!hasPreviousTip"
                            @click="previousTip"
                        >
                            <ChevronLeft class="size-4" />
                            Précédent
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            class="flex-1 sm:flex-none"
                            :disabled="!hasNextTip"
                            @click="nextTip"
                        >
                            Suivant
                            <ChevronRight class="size-4" />
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
