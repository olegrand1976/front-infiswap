<script setup lang="ts">
const props = withDefaults(defineProps<{
    value: number;
    duration?: number;
    suffix?: string;
    ariaLabel?: string;
}>(), {
    duration: 1800,
    suffix: '',
    ariaLabel: '',
});

const displayValue = ref(0);
const rootRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);

const formattedValue = computed(() => {
    const formatted = new Intl.NumberFormat('fr-BE').format(displayValue.value);
    return props.suffix ? `${formatted}${props.suffix}` : formatted;
});

const prefersReducedMotion = () =>
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateTo(target: number) {
    if (prefersReducedMotion()) {
        displayValue.value = target;
        return;
    }

    const start = performance.now();
    const from = displayValue.value;

    function step(now: number) {
        const progress = Math.min((now - start) / props.duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        displayValue.value = Math.round(from + (target - from) * eased);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function startAnimation() {
    if (hasAnimated.value) {
        return;
    }

    hasAnimated.value = true;
    animateTo(props.value);
}

watch(() => props.value, (next) => {
    if (hasAnimated.value) {
        animateTo(next);
    }
});

onMounted(() => {
    if (!rootRef.value || typeof IntersectionObserver === 'undefined') {
        startAnimation();
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                startAnimation();
                observer.disconnect();
            }
        },
        { threshold: 0.25 },
    );

    observer.observe(rootRef.value);

    onUnmounted(() => observer.disconnect());
});
</script>

<template>
    <span
        ref="rootRef"
        class="tabular-nums"
        :aria-label="ariaLabel || formattedValue"
    >
        {{ formattedValue }}
    </span>
</template>
