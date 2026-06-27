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
                        Le réseau n°1 du remplacement infirmier en Belgique
                    </p>
                </div>
            </div>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
                <span class="font-semibold text-white/90">Pour les maisons de repos, hôpitaux, bureaux de tarification, grands groupes infirmiers et centres d'intérim</span> —
                InfiSwap connecte votre établissement à un réseau actif d'infirmiers indépendants pour couvrir vos absences et vos besoins en renforts.
                Publiez vos missions, trouvez des profils et proposez des remplacements sans dépendre d'une agence classique à commission sur chaque heure.
            </p>
        </div>

        <div class="grid gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div class="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-start gap-3 sm:gap-4">
                    <span class="text-2xl shrink-0">👥</span>
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-yellow-400">
                            Trouvez les bons profils, plus vite
                        </h3>
                        <p class="text-white/80 text-sm mb-3">
                            Accédez au plus grand réseau d'entraide infirmière en Belgique et mobilisez les soignants qui correspondent à vos besoins.
                        </p>
                        <div class="space-y-2 sm:space-y-3 text-white/70 text-xs sm:text-sm border-l-2 border-yellow-400/30 pl-4">
                            <p>
                                <span class="text-white font-medium">Missions :</span> publiez vos postes à pourvoir et recevez les candidatures directement sur la plateforme.
                            </p>
                            <p>
                                <span class="text-white font-medium">Remplacements :</span> parcourez les demandes du réseau et proposez vos infirmiers, ou répondez aux besoins urgents de vos sites.
                            </p>
                            <p>
                                <span class="text-white font-medium">Binômes & favoris :</span> identifiez des infirmiers près de vos établissements et constituez des listes de confiance pour les contacter en priorité.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-start gap-3 sm:gap-4">
                    <span class="text-2xl shrink-0">📋</span>
                    <div>
                        <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-blue-400">
                            Pilotez tout depuis un seul espace
                        </h3>
                        <p class="text-white/80 text-sm mb-3">
                            Fini les mails éparpillés et les relances manuelles : votre tableau de bord institution regroupe l'essentiel du suivi opérationnel.
                        </p>
                        <div class="space-y-2 sm:space-y-3 text-white/70 text-xs sm:text-sm border-l-2 border-blue-400/30 pl-4">
                            <p>
                                <span class="text-white font-medium">Vue d'ensemble :</span> missions en cours, postes à pourvoir et feuilles de temps à valider en un coup d'œil.
                            </p>
                            <p>
                                <span class="text-white font-medium">Organisation :</span> gérez vos services, suivez les candidatures, validez les prestations et centralisez vos factures.
                            </p>
                            <p>
                                <span class="text-white font-medium">Équipe :</span> invitez vos collègues (RH, planning, direction) et partagez les accès selon leurs responsabilités.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <h3 class="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                <span class="text-xl">💰</span>
                Un tarif fixe, sans commission sur les heures
            </h3>
            <p class="text-white/60 text-sm mb-4">
                Avec InfiSwap Institutional, vous payez un abonnement prévisible — pas une marge cachée sur chaque heure travaillée :
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
                                Commission variable sur chaque heure
                            </td>
                            <td class="p-3 sm:p-4 font-bold text-white">
                                Abonnement fixe
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium">
                                Coût mensuel
                            </td>
                            <td class="p-3 sm:p-4">
                                Coût élevé et variable selon les profils
                            </td>
                            <td class="p-3 sm:p-4 font-extrabold text-white text-base sm:text-lg">
                                150 € / mois
                                <span class="block text-xs font-normal text-white/60 mt-0.5">ou 1 500 € / an</span>
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium whitespace-nowrap">
                                Marge de manœuvre
                            </td>
                            <td class="p-3 sm:p-4">
                                Dépend du profil et des heures
                            </td>
                            <td class="p-3 sm:p-4 font-semibold text-white">
                                Prévisible, sans surprise
                            </td>
                        </tr>
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-3 sm:p-4 text-white/60 font-medium">
                                Transparence
                            </td>
                            <td class="p-3 sm:p-4 italic text-white/60">
                                Marges peu lisibles
                            </td>
                            <td class="p-3 sm:p-4 font-medium text-white">
                                Tarif clair, suivi centralisé
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
