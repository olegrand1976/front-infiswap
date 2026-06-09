<template>
    <div class="flex flex-col p-6 sm:p-8 lg:p-10 text-white bg-primary">
        <div class="mb-4 lg:mb-6">
            <div class="flex items-center gap-3 mb-3 lg:mb-4">
                <div class="p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                    <Building2 class="size-6 sm:size-7 text-white" />
                </div>
                <div>
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Infiswap Institutional
                    </h1>
                    <p class="text-xs sm:text-sm font-medium text-white/50 uppercase tracking-widest">
                        Reprenez le contrôle sur vos coûts RH
                    </p>
                </div>
            </div>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
                Infiswap transforme la gestion de vos prestataires et talents. Là où les agences d'intérim traditionnelles prélèvent des commissions opaques sur chaque heure travaillée,
                <span class="font-bold text-white/90 underline decoration-primary decoration-2 underline-offset-4">Infiswap propose une infrastructure Flat Fee (tarif fixe)</span> qui redonne de la marge à votre entreprise.
            </p>
        </div>

        <div class="grid gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div class="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-start gap-3 sm:gap-4">
                    <span class="text-2xl shrink-0">⚡</span>
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-yellow-400">
                            Visibilité Maximale : Le "Fast-Track" de vos recrutements
                        </h3>
                        <p class="text-white/80 text-sm mb-3">
                            Ne laissez plus vos offres se noyer dans la masse. Le compte Institutionnel agit comme un accélérateur de visibilité.
                        </p>
                        <div class="space-y-2 sm:space-y-3 text-white/70 text-xs sm:text-sm border-l-2 border-yellow-400/30 pl-4">
                            <p>
                                <span class="text-white font-medium">Algorithme de remontée :</span> Vos besoins en compétences sont propulsés en haut des listes de recherche.
                            </p>
                            <p>
                                <span class="text-white font-medium">Priorité d'affichage :</span> Un positionnement stratégique qui garantit que les meilleurs profils voient vos missions en premier, réduisant ainsi drastiquement votre délai de recrutement (Time-to-Hire).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-start gap-3 sm:gap-4">
                    <span class="text-2xl shrink-0">🖥️</span>
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-blue-400">
                            Dashboard Institutionnel : Le centre de pilotage
                        </h3>
                        <p class="text-white/80 text-sm mb-3">
                            Oubliez les échanges de mails interminables et les factures papier. Nous mettons à votre disposition une interface conçue comme un IDE pour gestionnaire.
                        </p>
                        <div class="space-y-2 sm:space-y-3 text-white/70 text-xs sm:text-sm border-l-2 border-blue-400/30 pl-4">
                            <p>
                                <span class="text-white font-medium">Menu Spécifique :</span> Un accès direct au suivi des contrats, à la conformité (KYC/Compliance) et à l'historique des prestations.
                            </p>
                            <p>
                                <span class="text-white font-medium">Reporting Automatisé :</span> Générez vos états comptables en un clic. C’est propre, c’est structuré, et c’est prêt pour vos outils d'IA (exportation JSON/CSV facilitée pour vos scripts Cursor ou Copilot).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <h3 class="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                <span class="text-xl">💰</span>
                Analyse Comparative : Le "No-Brainer" Financier
            </h3>
            <p class="text-white/60 text-sm mb-4">
                Voici pourquoi passer à Infiswap est une décision logique pour votre trésorerie :
            </p>
            <div class="min-w-[500px] sm:min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                <table class="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                        <tr class="bg-white/10">
                            <th class="p-3 sm:p-4 font-bold border-b border-white/10 whitespace-nowrap">
                                Poste de coût
                            </th>
                            <th class="p-3 sm:p-4 font-bold border-b border-white/10">
                                Agence Classique
                            </th>
                            <th class="p-3 sm:p-4 font-bold border-b border-white/10 text-primary-light">
                                Solution Infiswap
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium">
                                Modèle de prix
                            </td>
                            <td class="p-3 sm:p-4 italic">
                                Commission variable (souvent 15 à 25%)
                            </td>
                            <td class="p-3 sm:p-4 font-bold text-white uppercase sm:tracking-wider">
                                Abonnement Fixe
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium">
                                Coût mensuel
                            </td>
                            <td class="p-3 sm:p-4">
                                Plusieurs milliers d'euros par tête
                            </td>
                            <td class="p-3 sm:p-4 font-extrabold text-white text-base sm:text-lg">
                                150 € / mois
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium whitespace-nowrap">
                                Marge de manœuvre
                            </td>
                            <td class="p-3 sm:p-4">
                                Subie (dépend du salaire du profil)
                            </td>
                            <td class="p-3 sm:p-4 font-semibold text-white">
                                Totale (votre coût est prédictible)
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium">
                                Transparence
                            </td>
                            <td class="p-3 sm:p-4 italic text-white/60">
                                Opacité des marges arrières
                            </td>
                            <td class="p-3 sm:p-4 font-medium text-white">
                                Transparence logicielle totale
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Building2 } from 'lucide-vue-next';
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

.text-primary-light {
    color: #4ade80; /* A soft green for the highlight */
}
</style>
