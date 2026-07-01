<template>
    <div
        v-if="visible"
        class="mx-3 mb-3 rounded-xl overflow-hidden border border-amber-300/40 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/25"
    >
        <div class="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-3 py-2.5 sm:px-4 sm:py-3">
            <span
                class="pointer-events-none absolute inset-0 bg-[length:200%_100%] animate-[boost-shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-amber-400/0 via-white/10 to-amber-400/0"
                aria-hidden="true"
            />

            <div class="relative flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                <div
                    class="flex shrink-0 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/30 shadow-inner"
                    :class="isBoosted ? 'w-10 h-10' : 'w-9 h-9'"
                >
                    <Rocket
                        class="h-4 w-4 text-white drop-shadow-sm"
                        :stroke-width="2.5"
                    />
                </div>

                <div class="min-w-0 flex-1 text-white">
                    <p class="font-bold text-sm sm:text-base leading-tight">
                        {{ title }}
                    </p>
                    <p class="mt-0.5 text-xs text-white/90 leading-snug">
                        {{ subtitle }}
                    </p>
                </div>

                <div
                    v-if="isOwner"
                    class="shrink-0"
                >
                    <ReplacementBoostButton
                        v-if="canBoost && !isBoosted"
                        variant="detail"
                        @boost="emit('boost')"
                    />
                    <Button
                        v-else-if="isBoosted"
                        variant="outline"
                        type="button"
                        :class="actionButtonClass"
                        @click="emit('manage')"
                    >
                        Gérer le boost
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Rocket } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ReplacementBoostButton from '@/components/replacements/ReplacementBoostButton.vue';
import { isReplacementActivelyBoosted } from '~/lib/replacementBoost';
import type { Replacement } from '~/lib/types';

const props = defineProps<{
    replacement: Replacement | null;
    isOwner: boolean;
    canBoost: boolean;
}>();

const emit = defineEmits<{
    boost: [];
    manage: [];
}>();

const actionButtonClass = 'border-white/90 bg-white text-amber-700 font-semibold shadow-sm hover:bg-amber-50 hover:text-amber-800 hover:border-white';

const isBoosted = computed(() =>
    props.replacement ? isReplacementActivelyBoosted(props.replacement) : false,
);

const visible = computed(() => {
    if (!props.replacement) return false;
    if (isBoosted.value) return true;
    return props.isOwner && props.canBoost;
});

const title = computed(() => {
    if (isBoosted.value) {
        return props.isOwner ? 'Remplacement boosté' : 'Annonce mise en avant';
    }
    return 'Boostez votre remplacement';
});

const subtitle = computed(() => {
    if (isBoosted.value) {
        if (props.replacement?.boosted_until) {
            return `Mise en avant active jusqu'au ${formatDate(props.replacement.boosted_until)}`;
        }
        return props.isOwner
            ? 'Votre annonce apparaît en tête des recherches.'
            : 'Cette annonce bénéficie d\'une visibilité maximale.';
    }
    return 'Passez en tête de liste et obtenez des réponses plus rapidement.';
});

function formatDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
</script>

<style scoped>
@keyframes boost-shimmer {
    0%, 100% {
        background-position: 200% 0;
    }
    50% {
        background-position: -200% 0;
    }
}
</style>
