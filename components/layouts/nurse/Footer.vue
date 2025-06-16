<template>
    <footer>
        <div class="bg-primarytech">
            <div class="flex lg:container flex-col md:flex-row justify-center items-center pt-8 md:py-12 px-4">
                <div class="flex flex-col w-full max-w-2xl justify-center items-center">
                    <div class="flex flex-col w-full space-y-4 py-8 md:py-0 text-center">
                        <h3 class="text-white font-semibold lg:text-3xl md:text-lg">
                            S'inscrire à la newsletter
                        </h3>

                        <p class="text-white hidden md:block text-sm md:text-xs lg:text-sm max-w-lg mx-auto">
                            Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                            Vous pouvez vous désabonner à tout moment. Pour en savoir plus sur notre politique
                            de protection des données cliquez ici.
                        </p>

                        <p class="md:hidden text-sm md:text-xs lg:text-sm text-white">
                            Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                        </p>

                        <form
                            class="mx-auto bg-white flex flex-row justify-between items-center h-9 rounded-full w-full max-w-md"
                            @submit.prevent="subscribeNewsletter"
                        >
                            <div class="flex flex-row justify-start items-center">
                                <Mail class="text-primarytech w-4 h-4 ms-3" />
                                <Input
                                    v-model="email"
                                    placeholder="Email"
                                    class="w-full text-primarytech text-sm"
                                />
                            </div>
                            <Button
                                :disabled="isLoading"
                                variant="secondary"
                                class="text-white h-8 bg-primarytech"
                                type="submit"
                            >
                                {{ isLoading ? "Envoi..." : "Enregistrer" }}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative">
            <div class="flex flex-col md:flex-row gap-8 items-start">
                <div class="w-full md:w-1/2 p-6 rounded-lg md:pl-0">
                    <div class="relative hidden lg:block">
                        <LayoutsAppImage
                            src="/home/blue_graph.png"
                            alt="Graphique bleu"
                            class="-mt-2 h-[24rem] w-full"
                        />
                        <LayoutsAppImage
                            src="/home/nurse_with_phone.png"
                            alt="Infirmière avec téléphone"
                            class="absolute -top-16 right-[-14rem] h-[16rem] md:h-[28rem] object-cover w-[80%] z-10"
                        />
                    </div>
                </div>

                <div class="w-full md:w-1/2 mb-4">
                    <div class="container mx-auto px-4 lg:py-8 h-full">
                        <div class="lg:p-6 flex flex-col items-center text-center h-full justify-center">
                            <div class="max-w-md mx-auto">
                                <h2 class="text-3xl text-primary mb-4 font-bold">
                                    Prêt(e) à tout centraliser sur une seule plateforme ?
                                </h2>
                                <p class="text-gray-700 mb-6">
                                    Rejoignez la communauté infiswap <br />
                                    et découvrez une nouvelle manière d'exercer.
                                </p>
                                <div class="flex flex-col items-center gap-4">
                                    <Button
                                        class="bg-primarytech hover:bg-primarytech/90 text-white font-semibold py-2 px-4 rounded-full w-full transition w-[300px]"
                                        href="/register"
                                    >
                                        Inscription
                                    </Button>
                                    <Button
                                        class="font-semibold py-2 px-4 rounded-full w-full transition w-[300px]"
                                        href="/contact"
                                    >
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-primarytech text-white py-4 md:px-0 px-8 lg:-mt-6">
            <p
                class="text-center text-[0.6em] md:text-xs"
            >
                <NuxtLink>Site commercialisé par</NuxtLink>
                <NuxtLink>LL-IT Software & Computer</NuxtLink> :
                <NuxtLink to="https://www.ll-it-sc.be">www.ll-it-sc.be</NuxtLink>
            </p>
        </div>

        <div class="container py-4 w-full text-center text-primarytech">
            <NuxtLink
                to="https://www.ll-it-sc.be"
                target="_blank"
                class="text-center text-[0.6em] md:text-xs"
            >
                @2025 <span class="font-bold">Nursi</span>Tech - Tous droits réservés
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
