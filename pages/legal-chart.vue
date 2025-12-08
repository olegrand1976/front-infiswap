<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p class="container font-bold md:font-light text-3xl">
                Charte de Bonne Conduite
            </p>
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <div class="container my-6 p-4 rounded-xl bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm leading-relaxed shadow-sm text-center">
                Le mail que vous venez de recevoir peut être dans vos <span class="font-semibold">spams</span>.
                Si vous ne le trouvez pas, allez y jeter un coup d'œil.
            </div>
            <div class="container text-center w-full font-light mb-4 lg:mb-6">
                InfiSwap est une plateforme fondée sur la confiance, la collaboration et le respect mutuel entre professionnels de santé.
                En intégrant notre communauté, chaque infirmier s’engage à respecter des principes éthiques essentiels afin de garantir une relation de travail harmonieuse et professionnelle.
            </div>
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 pl-3 list-decimal mt-2">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(String(index))"
                    >
                        {{ privacy.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :id="String(index)"
                        :key="index"
                    >
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ index+ 1 + '. ' }} {{ privacy.title }}
                        </h3>
                        <div
                            class="mt-1 text-gray-600"
                            v-html="privacy.text"
                        />
                    </li>
                </ul>
            </div>
            <div class="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                <Label class="flex items-center justify-center space-x-2 cursor-pointer">
                    <Input
                        v-model="isAccepted"
                        type="checkbox"
                        class="h-5 w-5 text-primary rounded border-gray-300 focus:ring focus:ring-gray-300"
                    />
                    <span class="text-gray-700">
                        Je reconnais avoir pris connaissance de la <span class="font-semibold">charte de bonne conduite</span> et je m'engage à la respecter.
                    </span>
                </Label>
            </div>

            <div class="mt-6 text-center">
                <Button
                    :disabled="!isAccepted"
                    class="px-6 py-2 rounded-lg text-white font-semibold transition duration-300"
                    :class="isAccepted ? 'bg-primary hover:bg-primary' : 'bg-gray-400 cursor-not-allowed'"
                    @click="validateCharte"
                >
                    Valider
                </Button>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
const isAccepted = ref(false);
const { $toast } = useNuxtApp();

const validateCharte = () => {
    if (isAccepted.value) {
        // const userChoice = localStorage.getItem('userChoice');

        $toast({
            title: 'Succès',
        });
        setTimeout(() => {
            navigateTo('/use-choice');
        }, 1000);
    }
};

useHead({
    title: 'Charte de Bonne Conduite',
    meta: [
        {
            name: 'description',
            content:
                'Découvrez la Charte de Bonne Conduite d’InfiSwap : règles de respect, éthique professionnelle, confidentialité et engagement entre infirmiers remplaçants et titulaires. Une ligne de conduite essentielle pour garantir confiance, professionnalisme et qualité des remplacements au sein de la communauté InfiSwap.',
        },
    ],
});

definePageMeta({
    layout: false,
});

const { scrollToSection } = useScroll();

const privacyPolicy = [
    {
        title: 'Respect et courtoisie entre confrères',
        text: `
            <ul class="list-disc  mt-1">
          <p> Faire preuve de professionnalisme, de respect et de courtoisie dans toutes les interactions avec les autres membres de la plateforme.
                 Honorer ses engagements en respectant les horaires, consignes et conditions du remplacement convenu.
                Adopter une attitude loyale et bienveillante envers ses confrères et consœurs, sans tentative de dénigrement ou de concurrence déloyale.
            </p>
            </ul>`,
    },
    {
        title: 'Respect de la relation entre l’infirmier titulaire et ses patients',
        text: `
            <ul class="list-disc  mt-1">
                <p>Assurer une prise en charge respectueuse et conforme aux directives du professionnel remplacé.
                Maintenir une posture éthique en garantissant l’intégrité de la relation entre l’infirmier titulaire et ses patients.
                Ne pas chercher à établir un lien direct avec les patients pour les détourner du professionnel initial.
                </p>
            </ul>
               `,
    },
    {
        title: 'Engagement de loyauté et d’éthique professionnelle',
        text: `
            <ul class="list-disc mt-1">
                <p>Interdiction stricte de solliciter ou de récupérer des patients d’un infirmier titulaire à l’issue d’un remplacement.
                Respecter le cadre défini du remplacement et ne pas proposer ses services de manière individuelle sans l’accord de l’infirmier concerné.
                Signaler toute situation conflictuelle ou irrégularité à l’équipe InfiSwap afin de préserver l’intégrité de la plateforme.</p>
            </ul>`,
    },
    {
        title: 'Confidentialité et professionnalisme',
        text: `
            <ul class="list-disc  mt-1">
                <p>Protéger la confidentialité des informations échangées lors des remplacements.
                Garantir une conduite exemplaire et préserver l’image de la profession infirmière.
                Contribuer activement à un climat de confiance et d’entraide entre les membres de la communauté.
                </p>
            </ul>`,
    },
    {
        title: 'Application et sanctions',
        text: `
            <ul class="list-disc  mt-1">
                <p>Tout comportement allant à l’encontre de cette charte pourra faire l’objet d’un signalement et entraîner des mesures adaptées, pouvant aller jusqu’à l’exclusion définitive de la plateforme.

                    En validant votre inscription sur InfiSwap, vous vous engagez à respecter ces principes essentiels, garants du bon fonctionnement et de la pérennité de notre réseau professionnel.

                    Nous vous remercions pour votre engagement et votre déontologie.

                    L’équipe InfiSwap
                </p>
            </ul>`,
    },
];
</script>

<style scoped>
/* Désactive les interactions si la charte n'est pas acceptée */
.pointer-events-none {
    pointer-events: none;
}
</style>
