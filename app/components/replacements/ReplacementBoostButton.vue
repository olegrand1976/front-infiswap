<template>
    <Button
        type="button"
        :variant="isLight ? 'outline' : 'default'"
        :class="buttonClass"
        :title="titleText"
        :aria-label="titleText"
        @click.stop="emit('boost')"
    >
        <Rocket
            :class="rocketClass"
            :stroke-width="2.5"
        />
        {{ label }}
    </Button>
</template>

<script setup lang="ts">
import { Rocket } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = withDefaults(defineProps<{
    variant?: 'table' | 'card' | 'detail';
    showPrice?: boolean;
}>(), {
    variant: 'table',
    showPrice: false,
});

const emit = defineEmits<{ boost: [] }>();

const { t } = useI18n();

const isLight = computed(() => props.variant === 'detail');

const titleText = computed(() =>
    props.showPrice ? t('replacements.boostButton.titleWithPrice', { price: '2 €' }) : t('replacements.boostThisReplacement'),
);

const label = computed(() => (props.showPrice ? t('replacements.boostButton.labelWithPrice', { price: '2 €' }) : t('replacements.boostButton.label')));

const buttonClass = computed(() => {
    if (props.variant === 'detail') {
        return 'border-white/90 bg-white text-amber-700 font-semibold shadow-sm hover:bg-amber-50 hover:text-amber-800 hover:border-white';
    }

    if (props.variant === 'card') {
        return 'border-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/40 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700';
    }

    return 'border-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-semibold shadow-md shadow-amber-500/35 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700';
});

const rocketClass = computed(() =>
    props.variant === 'detail' ? 'w-4 h-4 text-amber-600' : 'w-4 h-4 text-white',
);
</script>
