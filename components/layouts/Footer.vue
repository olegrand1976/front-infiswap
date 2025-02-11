<template>
    <footer class="bg-muted">
        <div class="flex lg:container flex-col md:flex-row justify-center md:justify-between md:space-x-4 items-center md:items-start pt-8 md:py-12 md:px-8">
            <div class="flex justify-center">
                <LayoutsLogo class="h-16 lg:h-20" />
                <!-- <LayoutsLogo class="w-[20rem] h-32 sm:w-[22rem] md:w-[25rem] lg:w-[27rem] xl:w-[30rem] 2xl:w-[32rem]" /> -->
            </div>

            <div class="flex flex-col w-full md:w-auto lg:w-auto justify-center items-center md:mt-0 md:items-center md:flex-row md:space-x-8 lg:space-x-20 md:shadow-none">
                <div class="hidden md:block md:-mt-6">
                    <h3 class="font-semibold md:text-sm">
                        CONTACT
                    </h3>
                    <div class="flex flex-col space-y-4 mt-4">
                        <p class="text-sm flex flex-row space-x-2 items-center">
                            <PhoneIcon class="text-primary w-4 h-4" />
                            <span class="md:text-xs lg:text-sm">045789101112</span>
                        </p>
                        <p class="text-sm flex flex-row space-x-2 items-center">
                            <MapPinIcon class="text-primary w-4 h-4" />
                            <span class="md:text-xs lg:text-sm">92 7131 BELGIQUE</span>
                        </p>
                        <p class="text-sm flex flex-row space-x-2 items-center">
                            <Mail class="text-primary w-4 h-4" />
                            <span class="md:text-xs lg:text-sm">INFO@infiswap.com</span>
                        </p>
                        <p class="text-sm flex flex-row space-x-2 items-center">
                            <Globe class="text-primary w-4 h-4" />
                            <span class="md:text-xs lg:text-sm">WWW.infiswap.com</span>
                        </p>
                    </div>
                </div>

                <div class="flex flex-col w-full md:w-96 lg:w-full space-y-4 py-8 md:py-0">
                    <h3 class="text-center md:text-start lg:text-base md:text-sm text-primary font-semibold">
                        SUBSCRIBE
                    </h3>
                    <p class="hidden md:block md:w-96 lg:w-[28rem] text-sm md:text-xs lg:text-sm">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                        Vous pouvez vous désabonner à tout moment. Pour en savoir plus sur notre politique
                        de protection des données cliquez ici.
                    </p>
                    <p class="md:hidden w-80 mx-auto text-center text-sm md:text-xs lg:text-sm">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                    </p>
                    <div class="w-80 mx-auto md:mx-0 md:w-96 lg:w-full bg-primary flex flex-row justify-between items-center h-9 rounded-full">
                        <div class="flex flex-row justify-start items-center">
                            <Mail class="text-white w-4 h-4 ms-3" />
                            <Input
                                variant="transparent"
                                placeholder="Email"
                                class="w-44 md:w-52 lg:w-72 text-white text-sm"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            class="text-primary h-8"
                        >
                            Enregistrer
                        </Button>
                    </div>
                    <div class="flex flex-row justify-center md:justify-start space-x-4 pt-4 md:pt-0">
                        <NuxtLink to="/">
                            <NuxtImg
                                src="/icons/twitter.png"
                                alt="Twitter"
                                title="Twitter"
                                class="w-5 h-5"
                            />
                        </NuxtLink>
                        <NuxtLink to="/">
                            <NuxtImg
                                src="/icons/facebook.png"
                                alt="Facebook"
                                title="Facebook"
                                class="w-5 h-5"
                            />
                        </NuxtLink>
                        <NuxtLink to="/">
                            <NuxtImg
                                src="/icons/instagram.png"
                                alt="Instagram"
                                title="Instagram"
                                class="w-5 h-5"
                            />
                        </NuxtLink>
                        <NuxtLink to="/">
                            <NuxtImg
                                src="/icons/youtube.png"
                                alt="Youtube"
                                title="Youtube"
                                class="w-5 h-5"
                            />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-primary text-white py-4 md:px-0 px-8">
            <p
                class="text-center text-[0.6em] md:text-xs"
            >
                <NuxtLink to="/">Mentions légales</NuxtLink> -
                <NuxtLink to="/">Fonctionnement</NuxtLink> -
                <NuxtLink to="/">Cookies</NuxtLink> -
                <NuxtLink to="/">Politique de Protection des données personnelles & Sécurité</NuxtLink> -
                <NuxtLink to="/">CGU</NuxtLink>
            </p>
        </div>

        <div class="container py-4">
            <p
                class="text-center text-[0.6em] md:text-xs"
            >
                @2025 InfiSwap - Tous droits réservés
            </p>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import {
    PhoneIcon,
    MapPinIcon,
    Mail,
    Globe,
} from 'lucide-vue-next';
</script>

<style scoped>
.shadow-upper {
    box-shadow: -2px -3px -3px rgba(0, 0, 0, 0.25);
}
</style>
