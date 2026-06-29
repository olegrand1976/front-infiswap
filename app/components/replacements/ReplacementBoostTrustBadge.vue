<template>
    <component
        :is="clickable ? 'button' : 'div'"
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50 text-left transition-shadow"
        :class="[
            compact ? 'px-2 py-1' : 'px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm',
            clickable ? 'cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400' : '',
        ]"
        @click="clickable ? emit('click') : undefined"
    >
        <ReplacementBoostStars
            :count="5"
            :size="starSize"
            :title="label"
        />
        <div
            v-if="!starsOnly"
            class="flex flex-col min-w-0"
        >
            <span
                class="font-semibold text-amber-900 leading-tight"
                :class="compact ? 'text-[10px]' : 'text-xs sm:text-sm'"
            >
                {{ label }}
            </span>
            <span
                v-if="subtitle && !compact"
                class="text-[10px] sm:text-xs text-amber-800/75 mt-0.5"
            >
                {{ subtitle }}
            </span>
        </div>
    </component>
</template>

<script setup lang="ts">
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';

const props = withDefaults(defineProps<{
    variant?: 'owner' | 'visitor';
    size?: 'sm' | 'md';
    compact?: boolean;
    starsOnly?: boolean;
    clickable?: boolean;
    boostedUntil?: string | null;
}>(), {
    variant: 'visitor',
    size: 'sm',
    compact: false,
    starsOnly: false,
    clickable: false,
    boostedUntil: null,
});

const emit = defineEmits<{ click: [] }>();

const label = computed(() =>
    props.variant === 'owner' ? 'Remplacement boosté' : '',
);

const subtitle = computed(() => {
    if (props.variant === 'owner' && props.boostedUntil) {
        return `Mise en avant active jusqu'au ${formatDate(props.boostedUntil)}`;
    }
    if (props.variant === 'visitor') {
        return 'Annonce vérifiée et mise en avant';
    }
    if (props.variant === 'owner') {
        return 'Votre annonce bénéficie d\'une visibilité maximale';
    }
    return null;
});

const starSize = computed(() => (props.size === 'md' ? 'md' : 'sm'));

function formatDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
</script>
