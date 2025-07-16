<template>
    <div class="container my-20 lg:my-3232">
        <h2 class="text-2xl text-primary font-bold">
            Formulaire
        </h2>

        <section class="mt-8 grid lg:grid-cols-4 bg-white shadow-xl rounded-3xl relative">
            <form class="lg:col-span-3 lg:w-[80%] xl:w-[70%] space-y-6 py-6 px-6 sm:px-12">
                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Nom
                    </label>
                    <input
                        type="text"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Email
                    </label>
                    <input
                        type="email"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Téléphone
                    </label>
                    <input
                        type="text"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Commentaire
                    </label>
                    <textarea
                        rows="5"
                        class="w-full border border-gray-300 rounded text-sm p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div class="flex gap-2 items-center">
                    <Checkbox id="save" />
                    <label
                        for="save"
                        class="text-primary font-medium text-xs xl:text-nowrap"
                    >
                        Enregistrer mon nom, mon e-mail et mon site dans le navigateur pour mon prochain commentaire
                    </label>
                </div>

                <Button class="!mt-12 !mb-4 !rounded-md !w-full">
                    CRÉER MON DEVIS NURSASSUR
                </Button>
            </form>

            <div class="hidden lg:block lg:col-span-1 bg-primary relative h-full rounded-r-3xl" />

            <LayoutsAppImage
                src="home/woman_nurse_plus.png"
                class="hidden lg:block absolute top-1/3 right-12 xl:right-24 w-80 xl:w-96"
            />
        </section>

        <p class="mt-8 font-medium text-xs">
            📩  Recevez une proposition personnalisée <span class="text-primary">en moins de 48h</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
</script>
