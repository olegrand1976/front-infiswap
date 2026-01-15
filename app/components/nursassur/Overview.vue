<template>
    <div class="container my-16 lg:my-32 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <LayoutsAppImage
            src="home/two_women_discussing.png"
            alt="Two women discussing"
            class="rounded-3xl w-full order-2 lg:order-1"
        />

        <div class="text-center lg:text-start order-1 lg:order-2">
            <h3 class="text-2xl text-primary font-semibold">
                🛡 NURSASSUR
            </h3>
            <p class="mt-4">
                Votre assurance professionnelle 100% adaptée à votre métier d'infirmier-ère. Avec NURSASSUR, bénéficiez d'une couverture complète, conçue pour les besoins spécifiques des infirmiers et infirmières libéraux. Gagnez en sérénité et concentrez-vous sur vos patients !
            </p>

            <div class="mt-16 lg:mt-8">
                <h3 class="text-2xl text-primary font-semibold">
                    Pourquoi choisir NURSASSUR ?
                </h3>

                <div class="mt-4 text-start ml-0 md:ml-[12%] lg:ml-0">
                    <p
                        v-for="valuation in valuations"
                        :key="valuation.id"
                        class="mb-2"
                    >
                        ✅ {{ valuation.text }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const valuations = [
    {
        id: 1,
        text: 'Des garanties conçues pour votre activité à domicile',
    },
    {
        id: 2,
        text: 'Une protection juridique en cas de litige',
    },
    {
        id: 3,
        text: 'Une responsabilité civile professionnelle obligatoire et renforcée',
    },
    {
        id: 4,
        text: 'une assurance auto pro si vous vous déplacez chez vos patients',
    },
    {
        id: 5,
        text: 'Un accompagnement personnalisé via Infiswap',
    },
    {
        id: 6,
        text: 'Des tarifs négociés exclusivement pour la communauté Infiswap',
    },
];
</script>
