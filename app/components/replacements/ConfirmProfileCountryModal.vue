<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-profile-country-title"
        data-testid="confirm-profile-country-modal"
        @keydown.escape.prevent="onDismiss"
    >
        <div
            class="absolute inset-0"
            aria-hidden="true"
            data-testid="confirm-profile-country-backdrop"
            @click="onDismiss"
        />
        <div
            class="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
            tabindex="-1"
            @click.stop
        >
            <h2
                id="confirm-profile-country-title"
                class="text-xl sm:text-2xl font-extrabold text-slate-900 text-center"
            >
                Confirmez votre pays
            </h2>
            <p class="text-sm text-slate-500 text-center mt-2 mb-6">
                Indiquez où vous exercez pour publier et voir les remplacements de votre zone.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    v-for="option in REPLACEMENT_COUNTRIES"
                    :key="option.value"
                    type="button"
                    class="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-60"
                    :data-testid="`confirm-profile-country-${option.value}`"
                    :disabled="pending"
                    @click="emit('select', option.value)"
                >
                    <span class="font-bold text-slate-900">{{ option.label }}</span>
                </button>
            </div>
            <button
                type="button"
                class="mt-6 w-full text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2 disabled:opacity-60"
                data-testid="confirm-profile-country-later"
                :disabled="pending"
                @click="onDismiss"
            >
                Plus tard
            </button>
            <p class="mt-2 text-center text-xs text-slate-400">
                Sans pays, les listes restent vides et la publication est bloquée.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { REPLACEMENT_COUNTRIES } from '~/lib/constants';
import type { ReplacementCountryCode } from '~/lib/replacementCountry';

defineProps<{
    pending?: boolean;
}>();

const emit = defineEmits<{
    select: [country: ReplacementCountryCode];
    dismiss: [];
}>();

function onDismiss(): void {
    emit('dismiss');
}
</script>
