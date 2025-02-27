<template>
    <div>
        <div class="grid grid-cols-3 gap-4">
            <section class="flex flex-col space-y-4">
                <div class="flex flex-col space-y-6 px-6 py-4 rounded bg-gray-100">
                    <div class="flex space-x-3 items-center">
                        <NuxtImg
                            src="/home/infirmier_homme.png"
                            class="w-12 h-12 rounded-full"
                        />
                        <h2 class="text-primary">
                            Information patients
                        </h2>
                    </div>

                    <div class="space-y-2">
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Nom
                            </h4>
                            <p>Richard</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Prénom
                            </h4>
                            <p>Dupond</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Téléphone
                            </h4>
                            <p>9088786786</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Email
                            </h4>
                            <p>Dupond@gmail.com</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Adresse
                            </h4>
                            <p>Rue du prévot, 42 100 La Louvrière</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Rue
                            </h4>
                            <p>123 Baker</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Ville
                            </h4>
                            <p>Liege</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Code postal
                            </h4>
                            <p>8788</p>
                        </div>
                    </div>

                    <div>
                        .
                    </div>
                </div>

                <div>
                    .
                </div>

                <div>
                    .
                </div>
            </section>

            <section>
                .
            </section>

            <section>
                .
            </section>
        </div>
    </div>
</template>

<script>
useHead({
    title: 'Détail du patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
