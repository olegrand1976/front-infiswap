<template>
    <div class="flex flex-col justify-between h-screen">
        <header class="bg-tertiary/30 h-20 flex justify-start items-center">
            <div class="container">
                <LayoutsLogo class="w-36" />
            </div>
        </header>

        <section class="container">
            <h1 class="text-lg underline text-primary">
                Confirmation - règlement d'utilisation de la plateforme
            </h1>
            <h5 class="text-primary font-semibold mt-6">
                Pour quelle utilisation de la plateforme ?
            </h5>

            <Form class="mt-12 flex flex-col">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 2xl:gap-x-32 items-center">
                    <div class="h-10 flex justify-center px-auto items-center border border-primary text-primary rounded-full">
                        <span>Je cherche des remplacements</span>
                    </div>
                    <div class="h-10 flex justify-center px-auto items-center border border-primary text-primary rounded-full">
                        <span>Je souhaite me faire remplacer</span>
                    </div>
                    <div class="h-10 flex justify-center px-auto items-center border border-primary text-primary rounded-full">
                        <span>Faire les deux</span>
                    </div>
                </div>
                <Button
                    type="submit"
                    class="mt-16 w-full sm:w-96 mx-auto"
                >
                    Envoyer
                </Button>
            </Form>
        </section>

        <footer>
            <div class="bg-primary text-white py-4 md:px-0 px-8">
                <p
                    class="text-center text-[0.6em] md:text-xs"
                >
                    <NuxtLink
                        to="/legal-notice"
                    >Mentions légales</NuxtLink> -
                    <NuxtLink to="/privacy-security">Politique de Protection des données personnelles & Sécurité</NuxtLink> -
                    <NuxtLink to="/terms">CGU</NuxtLink>
                </p>
            </div>

            <div class="container py-4 w-full text-center bg-muted">
                <NuxtLink
                    to="https://www.ll-it-sc.be"
                    target="_blank"
                    class="text-center text-[0.6em] md:text-xs"
                >
                    @2025 LL-IT Software & Computer - Tous droits réservés
                </NuxtLink>
            </div>
        </footer>
    </div>
</template>

<script setup>
useHead({
    title: 'Choix d\'utilisation',
});

definePageMeta({
    layout: 'auth',
});
</script>
