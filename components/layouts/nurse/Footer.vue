<template>
    <footer class="bg-muted">
        <div class="flex lg:container flex-col md:flex-row justify-center items-center pt-8 md:py-12 px-4">
            <div class="flex flex-col w-full max-w-2xl justify-center items-center">
                <div class="flex flex-col w-full space-y-4 py-8 md:py-0 text-center">
                    <h3 class="text-primary font-semibold lg:text-base md:text-sm">
                        S'inscrire mialivola
                    </h3>

                    <p class="hidden md:block text-sm md:text-xs lg:text-sm max-w-lg mx-auto">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                        Vous pouvez vous désabonner à tout moment. Pour en savoir plus sur notre politique
                        de protection des données cliquez ici.
                    </p>

                    <p class="md:hidden text-sm md:text-xs lg:text-sm">
                        Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                    </p>

                    <form
                        class="mx-auto bg-primary flex flex-row justify-between items-center h-9 rounded-full w-full max-w-md"
                        @submit.prevent="subscribeNewsletter"
                    >
                        <div class="flex flex-row justify-start items-center">
                            <Mail class="text-white w-4 h-4 ms-3" />
                            <Input
                                v-model="email"
                                variant="transparent"
                                placeholder="Email"
                                class="w-full text-white text-sm"
                            />
                        </div>
                        <Button
                            :disabled="isLoading"
                            variant="secondary"
                            class="text-primary h-8"
                            type="submit"
                        >
                            {{ isLoading ? "Envoi..." : "Enregistrer" }}
                        </Button>
                    </form>
                </div>
            </div>
        </div>

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

        <div class="container py-4 w-full text-center">
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
import {
    Mail,
} from 'lucide-vue-next';
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
