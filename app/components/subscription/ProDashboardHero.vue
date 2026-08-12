<script setup lang="ts">
import { Crown } from 'lucide-vue-next';

const localePath = useLocalePath();
const { trackEvent } = useProductAnalytics();
const { badge, title, subtitle, cta, priceNote, benefits } = usePremiumMarketing();

function onCtaClick() {
    trackEvent('pro_upsell_click', { source: 'nurse_dashboard' });
}
</script>

<template>
    <section
        class="relative overflow-hidden rounded-xl border border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-primary/5 p-4 shadow-sm sm:p-5 dark:border-amber-500/40 dark:from-amber-500/10 dark:via-background dark:to-primary/10"
        :aria-label="badge"
    >
        <div class="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-400/10" />

        <div class="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div class="min-w-0 space-y-2">
                <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-100/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200">
                    <Crown
                        class="size-3.5"
                        aria-hidden="true"
                    />
                    {{ badge }}
                </div>

                <div class="space-y-1">
                    <h2 class="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-foreground">
                        {{ title }}
                    </h2>
                    <p class="max-w-xl text-sm text-gray-600 dark:text-muted-foreground">
                        {{ subtitle }}
                    </p>
                </div>

                <ul class="flex flex-wrap gap-x-3 gap-y-1.5 pt-0.5">
                    <li
                        v-for="benefit in benefits"
                        :key="benefit.title"
                        class="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-muted-foreground"
                    >
                        <component
                            :is="benefit.icon"
                            class="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                            aria-hidden="true"
                        />
                        <span class="font-medium">{{ benefit.title }}</span>
                    </li>
                </ul>
            </div>

            <div class="flex shrink-0 flex-col gap-1.5 sm:items-end">
                <NuxtLink
                    :to="localePath('/dashboard/subscriptions')"
                    class="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                    @click="onCtaClick"
                >
                    {{ cta }}
                </NuxtLink>
                <p class="text-center text-xs text-muted-foreground sm:text-right">
                    {{ priceNote }}
                </p>
            </div>
        </div>
    </section>
</template>
