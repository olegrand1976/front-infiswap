<template>
    <footer class="bg-muted">
        <div class="flex flex-col items-center justify-center pt-8 lg:container md:flex-row md:justify-between md:space-x-4 md:items-start md:py-12 md:px-8">
            <div class="flex justify-center">
                <LayoutsLogo class="h-16 lg:h-20" />
            </div>

            <div class="flex flex-col items-center justify-center w-full md:w-auto lg:w-auto md:mt-0 md:items-center md:flex-row md:space-x-8 lg:space-x-20 md:shadow-none">
                <div class="hidden md:block md:-mt-6">
                    <h3 class="font-semibold md:text-sm">
                        CONTACT
                    </h3>
                    <div class="flex flex-col mt-4 space-y-4">
                        <p class="flex flex-row items-center space-x-2 text-sm">
                            <Phone class="w-4 h-4 text-primary" />
                            <span class="md:text-xs lg:text-sm">0478.02.33.77</span>
                        </p>
                        <p class="flex flex-row items-center space-x-2 text-sm">
                            <MapPin class="w-4 h-4 text-primary" />
                            <span class="md:text-xs lg:text-sm">Rue de la Résistance, 92/A 7131 WAUDREZ</span>
                        </p>
                        <p class="flex flex-row items-center space-x-2 text-sm">
                            <Mail class="w-4 h-4 text-primary" />
                            <span class="md:text-xs lg:text-sm">info@infiswap.be</span>
                        </p>
                        <p class="flex flex-row items-center space-x-2 text-sm">
                            <Globe class="w-4 h-4 text-primary" />
                            <span class="md:text-xs lg:text-sm">www.infiswap.be</span>
                        </p>
                    </div>
                </div>

                <div class="flex flex-col py-8 space-y-4 w-96 md:py-0">
                    <h3 class="font-semibold text-center md:text-start lg:text-base md:text-sm text-primary">
                        S'inscrire à la newsletter
                    </h3>
                    <p class="hidden text-sm md:block md:text-xs lg:text-sm">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                        Vous pouvez vous désabonner à tout moment. Pour en savoir plus sur notre politique
                        de protection des données cliquez ici.
                    </p>
                    <p class="mx-auto text-sm text-center md:hidden w-80 md:text-xs lg:text-sm">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                    </p>

                    <form
                        class="flex flex-row items-center justify-between mx-auto rounded-full md:mx-0 bg-primary h-9"
                        @submit.prevent="subscribeNewsletter"
                    >
                        <div class="flex flex-row items-center justify-start">
                            <Mail class="w-4 h-4 text-white ms-3" />
                            <Input
                                v-model="email"
                                variant="transparent"
                                placeholder="Email"
                                class="text-sm text-white w-44 md:w-52 lg:w-full border-0 placeholder:text-white/70"
                            />
                        </div>
                        <Button
                            :disabled="isLoading"
                            variant="secondary"
                            class="h-8 text-primary"
                            type="submit"
                        >
                            {{ isLoading ? "Envoi..." : "Enregistrer" }}
                        </Button>
                    </form>
                    <div class="flex flex-row justify-center pt-4 space-x-4 md:justify-start md:pt-0">
                        <NuxtLink to="https://web.facebook.com/profile.php?viewas=100000686899395&id=61572833867576">
                            <LayoutsAppImage
                                src="icons/facebook.png"
                                title="Facebook"
                                class="w-5"
                            />
                        </NuxtLink>
                        <NuxtLink to="https://www.instagram.com/infiswapsoins/">
                            <LayoutsAppImage
                                src="icons/instagram.png"
                                title="Instagram"
                                class="w-5"
                            />
                        </NuxtLink>
                        <NuxtLink to="https://www.linkedin.com/company/infiswap-vos-soins-sans-interruption/?viewAsMember=true">
                            <LayoutsAppImage
                                src="icons/linkedin.png"
                                title="Linkedin"
                                class="w-5"
                            />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-8 py-4 text-white bg-primary md:px-0">
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

        <div class="container w-full py-4 text-center">
            <NuxtLink
                to="https://www.ll-it-sc.be"
                target="_blank"
                class="text-center text-[0.6em] md:text-xs"
            >
                @2025 LL-IT Software & Computer - Tous droits réservés
            </NuxtLink>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { Globe, Mail, MapPin, Phone } from 'lucide-vue-next';
import { useNewsletter } from '@/composables/useNewsletter';

const { email, isLoading, subscribeNewsletter } = useNewsletter();
</script>

<style scoped>
.shadow-upper {
    box-shadow: -2px -3px -3px rgba(0, 0, 0, 0.25);
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
