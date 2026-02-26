<template>
    <div class="container my-20 lg:my-32 grid lg:grid-cols-2 gap-16 lg:items-end">
        <section>
            <h3 class="text-center font-semibold text-2xl text-primary lg:text-start">
                Pour qui ?
            </h3>

            <div class="mt-6 space-y-3">
                <p
                    v-for="audience in audiences"
                    :key="audience.id"
                    class="p-3 rounded-md bg-gray-100"
                >
                    👉 {{ audience.text }}
                </p>
            </div>
        </section>

        <section class="bg-primary text-white p-8 rounded-lg">
            <h3 class="text-center font-semibold text-2xl lg:text-start">
                Comment ça marche ?
            </h3>

            <div class="mt-6 space-y-2">
                <p>
                    1. Remplissez le formulaire ci-dessous pour indiquer vos besoins
                </p>
                <p>
                    2. Un conseiller vous contacte sous 48h
                </p>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
const audiences = [
    {
        id: 1,
        text: 'Infirmiers-ères libéraux-ales',
    },
    {
        id: 2,
        text: 'En début d\'activité ou déjà installés',
    },
    {
        id: 3,
        text: 'En individuel ou en collaboration',
    },
];
</script>
