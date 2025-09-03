<template>
    <footer>
        <div
            v-if="props.theme == 'assur'"
            class="w-full text-center py-6 px-4 font-medium text-lg -mt-10"
            :class="txtClass"
        >
            <p>
                N.E. 0899.850.984 Barbara Murgo, Intermédiaire d’assurances agissant pour Quality Insurance & Crédit SRL – Agent d'assurance exclusif lié P&V ASSURANCES
            </p>
        </div>
        <div :class="bgClass">
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
                                <EnvelopeIcon
                                    class="w-4 h-4 ms-3"
                                    :class="txtClass"
                                />
                                <Input
                                    v-model="email"
                                    placeholder="Email"
                                    class="w-full text-sm"
                                    :class="txtClass"
                                />
                            </div>
                            <Button
                                :disabled="isLoading"
                                variant="secondary"
                                class="text-white h-8"
                                :class="bgClass"
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
            <div class="flex flex-col lg:flex-row lg:gap-8 items-start">
                <div class="w-full lg:w-[45vw] xl:w-1/2 lg:p-6 rounded-lg md:pl-0">
                    <div class="relative hidden lg:block">
                        <LayoutsAppImage
                            src="/home/blue_graph.png"
                            alt="Graphique bleu"
                            class="-mt-2 h-[24rem] w-full object-cover"
                        />
                        <LayoutsAppImage
                            src="/home/nurse_with_phone.png"
                            alt="Infirmière avec téléphone"
                            class="absolute -top-16 right-[-14rem] h-[16rem] lg:h-[28rem] object-cover max-w-[80%] z-10"
                        />
                    </div>
                </div>

                <div class="w-full pl-0 lg:w-1/2 lg:pl-40 xl:pl-0 mb-4">
                    <div class="container mx-auto px-4 py-8 h-full">
                        <div class="lg:p-6 flex flex-col items-center text-center h-full justify-center">
                            <div class="max-w-md mx-auto">
                                <h2 class="text-3xl text-primary mb-4 font-semibold">
                                    Prêt(e) à tout centraliser sur une seule plateforme ?
                                </h2>
                                <p class="text-gray-700 mb-6">
                                    Rejoignez la communauté infiswap <br>
                                    et découvrez une nouvelle manière d'exercer.
                                </p>
                                <div class="flex flex-col items-center gap-4">
                                    <Button
                                        v-if="props.theme == 'assur'"
                                        class="bg-primaryassur hover:bg-primaryassur/90 text-white font-semibold py-2 px-4 rounded-full w-full transition"
                                        href="/register"
                                    >
                                        Inscription
                                    </Button>
                                    <Button
                                        v-else
                                        class=" bg-primarytech hover:bg-primarytech/90  text-white font-semibold py-2 px-4 rounded-full w-full transition"
                                        href="/register"
                                    >
                                        Inscription
                                    </Button>
                                    <Button
                                        class="font-semibold py-2 px-4 rounded-full w-full transition"
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

        <div
            class="text-white py-4 md:px-0 px-8 lg:-mt-6"
            :class="bgClass"
        >
            <p
                class="text-center text-[0.6em] md:text-xs"
            >
                <NuxtLink>Site commercialisé par </NuxtLink>
                <NuxtLink>LL-IT Software & Computer</NuxtLink> :
                <NuxtLink to="https://www.ll-it-sc.be">www.ll-it-sc.be</NuxtLink>
            </p>
        </div>

        <div
            class="container py-4 w-full text-center"
            :class="txtClass"
        >
            <NuxtLink
                v-if="props.theme != 'assur'"
                to="https://www.ll-it-sc.be"
                target="_blank"
                class="text-center text-[0.6em] md:text-xs"
            >
                @2025 <span class="font-bold">Nurs</span>Tech - Tous droits réservés
            </NuxtLink>
            <NuxtLink
                v-else
                to="https://www.ll-it-sc.be"
                target="_blank"
                class="text-center text-[0.6em] md:text-xs"
            >
                @2025 <span class="font-bold">Nurs</span>Assur - Tous droits réservés
            </NuxtLink>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import {
    EnvelopeIcon,
} from '@heroicons/vue/24/outline';
import { useNewsletter } from '@/composables/useNewsletter';

const { email, isLoading, subscribeNewsletter } = useNewsletter();

const props = defineProps<{
    theme: string;
}>();

const txtClass = computed(() =>
    props.theme === 'assur' ? 'text-primaryassur' : 'text-primarytech',
);

const bgClass = computed(() =>
    props.theme === 'assur' ? 'bg-primaryassur' : 'bg-primarytech',
);
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
