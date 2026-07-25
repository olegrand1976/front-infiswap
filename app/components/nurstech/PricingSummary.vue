<template>
    <div class="rounded-lg border border-primarytech/20 bg-slate-50 p-3 text-sm text-gray-700 space-y-3">
        <p class="font-semibold text-primarytech text-center">
            Formules
        </p>

        <div>
            <p class="font-medium text-gray-900">
                {{ offers.starters.title }}
                <span class="font-normal italic text-xs text-gray-500">— {{ offers.starters.subtitle }}</span>
            </p>
            <ul class="mt-1 space-y-0.5 pl-3 list-disc text-xs">
                <li>Création : <strong>{{ offers.starters.creation }} €</strong></li>
                <li>
                    Maintenance : <strong>{{ offers.starters.maintenanceYear1Month }} €</strong>/mois an 1
                    (ou {{ offers.starters.maintenanceYear1Year }} €/an), puis
                    <strong>{{ offers.starters.maintenanceAfterMonth }} €</strong>/mois
                    (ou {{ offers.starters.maintenanceAfterYear }} €/an)
                </li>
            </ul>
        </div>

        <div>
            <p class="font-medium text-gray-900">
                {{ offers.monthly.title }}
            </p>
            <ul class="mt-1 space-y-0.5 pl-3 list-disc text-xs">
                <li>
                    <strong>{{ offers.monthly.creationMonth }} €</strong>/mois × {{ offers.monthly.creationMonths }}
                    + <strong>{{ offers.monthly.maintenanceYear1Month }} €</strong> maintenance
                    → <strong>{{ offers.monthly.totalYear1Month }} €</strong>/mois an 1
                </li>
                <li>Puis <strong>{{ offers.monthly.afterYear1Month }} €</strong>/mois (maintenance)</li>
            </ul>
        </div>

        <div>
            <p class="font-medium text-gray-900">
                {{ offers.standard.title }}
                <span class="font-normal italic text-xs text-gray-500">— {{ offers.standard.subtitle }}</span>
            </p>
            <ul class="mt-1 space-y-0.5 pl-3 list-disc text-xs">
                <li>Création : <strong>{{ offers.standard.creation }} €</strong></li>
                <li>
                    Maintenance : <strong>{{ offers.standard.maintenanceMonth }} €</strong>/mois
                    (ou {{ offers.standard.maintenanceYear }} €/an)
                </li>
            </ul>
        </div>

        <div>
            <p class="font-medium text-gray-900">
                {{ offers.domain.title }}
            </p>
            <p class="mt-1 text-xs pl-3">
                <strong>{{ offers.domain.setup }} €</strong> à la création
                + <strong>{{ offers.domain.month }} €</strong>/mois
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NURSTECH_OFFERS } from '~/utils/nurstechOffers';

const offers = NURSTECH_OFFERS;
</script>
