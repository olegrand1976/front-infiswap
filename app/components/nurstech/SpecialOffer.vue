<template>
    <div class="container mx-auto px-4 py-6">
        <div class="bg-primary text-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 class="text-center text-3xl md:text-4xl font-extrabold tracking-wide">
                🎁 Offre spéciale
            </h2>

            <div class="space-y-6 text-base md:text-lg leading-relaxed">
                <div class="bg-white/10 rounded-xl p-5 shadow-md">
                    <h3 class="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                        🔹 {{ offers.starters.title }}
                        <span class="font-normal italic text-sm">- {{ offers.starters.subtitle }}!</span>
                    </h3>
                    <ul class="space-y-2 pl-4">
                        <li>
                            - Création du site :
                            <span class="font-semibold">{{ offers.starters.creation }} €</span>
                        </li>
                        <li>
                            - Maintenance :
                            <ul class="pl-6 mt-1 space-y-1">
                                <li>
                                    ** <span class="font-semibold">{{ offers.starters.maintenanceYear1Month }} €</span>
                                    / mois la 1ère année (ou
                                    <span class="font-semibold">{{ offers.starters.maintenanceYear1Year }} €</span> / an)
                                </li>
                                <li>
                                    ** <span class="font-semibold">{{ offers.starters.maintenanceAfterMonth }} €</span>
                                    / mois à partir de la 2ème année (ou
                                    <span class="font-semibold">{{ offers.starters.maintenanceAfterYear }} €</span> / an)
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="bg-white/10 rounded-xl p-5 shadow-md">
                    <h3 class="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                        👉 {{ offers.monthly.title }}
                    </h3>
                    <ul class="space-y-2 pl-4">
                        <li>
                            - <span class="font-semibold">{{ offers.monthly.creationMonth }} €</span>
                            / mois pendant {{ offers.monthly.creationMonths }} mois (création)
                        </li>
                        <li>
                            - <span class="font-semibold">{{ offers.monthly.maintenanceYear1Month }} €</span>
                            / mois (maintenance 1ère année)
                            <ul class="pl-6 mt-1 space-y-1">
                                <li>
                                    ** Soit
                                    <span class="font-semibold">{{ offers.monthly.totalYear1Month }} €</span>
                                    / mois la première année
                                </li>
                                <li>
                                    ** À partir de la 2ème année :
                                    <span class="font-semibold">{{ offers.monthly.afterYear1Month }} €</span>
                                    / mois (maintenance seule)
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="bg-white/10 rounded-xl p-5 shadow-md">
                    <h3 class="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                        🔹 {{ offers.standard.title }}
                        <span class="font-normal italic text-sm">- pour une {{ offers.standard.subtitle }}!</span>
                    </h3>
                    <ul class="space-y-2 pl-4">
                        <li>
                            - Création du site :
                            <span class="font-semibold">{{ offers.standard.creation }} €</span>
                        </li>
                        <li>
                            - Maintenance :
                            <span class="font-semibold">{{ offers.standard.maintenanceMonth }} €</span>
                            / mois (ou
                            <span class="font-semibold">{{ offers.standard.maintenanceYear }} €</span> / an)
                        </li>
                    </ul>
                </div>

                <div class="bg-white/10 rounded-xl p-5 shadow-md">
                    <h3 class="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                        🔹 Option supplémentaire
                    </h3>
                    <p class="pl-4">
                        Nom de domaine spécifique :
                        <span class="font-semibold">{{ offers.domain.setup }} €</span>
                        à la création +
                        <span class="font-semibold">{{ offers.domain.month }} € / mois</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NURSTECH_OFFERS } from '~/utils/nurstechOffers';

const offers = NURSTECH_OFFERS;
</script>
