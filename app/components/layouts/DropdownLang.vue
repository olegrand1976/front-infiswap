<template>
    <div :class="cn('relative inline-flex items-center rounded-full border border-input bg-background p-0.5', props.class)">
        <span
            class="absolute inset-y-0.5 w-9 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(${activeIndex * 36}px)` }"
        />
        <button
            v-for="language in LANGUAGES"
            :key="language.value"
            type="button"
            class="relative z-10 w-9 rounded-full py-1 text-xs font-bold transition-colors"
            :class="currentLocale === language.value ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="onLocaleChange(language.value)"
        >
            {{ language.label }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import { LANGUAGES } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { isAppLocale, type AppLocale } from '~/utils/appLocale';
import { type HTMLAttributes } from 'vue';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const { locale: currentLocale, applyLocale } = useAppLocale();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

const activeIndex = computed(() => {
    const index = LANGUAGES.findIndex(language => language.value === currentLocale.value);
    return index === -1 ? 0 : index;
});

async function onLocaleChange(value: unknown) {
    if (!isAppLocale(value) || value === currentLocale.value) {
        return;
    }

    const next = value as AppLocale;
    await applyLocale(next);
    await router.push(switchLocalePath(next));
}
</script>
