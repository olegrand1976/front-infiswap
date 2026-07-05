<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offre-institution-country-title"
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h2
                id="offre-institution-country-title"
                class="text-xl sm:text-2xl font-extrabold text-slate-900 text-center"
            >
                Choisissez votre pays
            </h2>
            <p class="text-sm text-slate-500 text-center mt-2 mb-6">
                Sélectionnez votre pays pour afficher l'offre institutionnelle adaptée.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    class="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 hover:border-[#46d88e] hover:bg-emerald-50/40 transition-all"
                    @click="emit('select', 'be')"
                >
                    <span
                        class="text-4xl leading-none"
                        aria-hidden="true"
                    >🇧🇪</span>
                    <span class="font-bold text-slate-900">Belgique</span>
                    <span class="text-[11px] text-slate-500 text-center leading-snug">
                        DIY InfiSwap + partenariat Jaumana Soins
                    </span>
                </button>
                <button
                    type="button"
                    class="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 hover:border-[#46d88e] hover:bg-emerald-50/40 transition-all"
                    @click="emit('select', 'fr')"
                >
                    <span
                        class="text-4xl leading-none"
                        aria-hidden="true"
                    >🇫🇷</span>
                    <span class="font-bold text-slate-900">France</span>
                    <span class="text-[11px] text-slate-500 text-center leading-snug">
                        Formule DIY InfiSwap uniquement
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { OffreInstitutionCountry } from '~/lib/offreInstitutionCountry';

const emit = defineEmits<{
    select: [country: OffreInstitutionCountry];
}>();
</script>
