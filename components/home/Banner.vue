<template>
    <div
        class="container font-light grid grid-cols-6 gap-8 justify-between lg:mt-12"
    >
        <div class="relative col-span-6 lg:col-span-2 p-4 lg:p-8 grid place-content-center bg-rose-400 shadow-lg rounded-lg overflow-hidden">
            <div
                v-if="!user"
                class="text-white text-center"
            >
                <h2 class="text-lg lg:text-xl font-semibold">🚀 InfiSwap est là ! 🩺</h2>
                <p>Une plateforme simple et rapide pour les infirmier(ère)s.</p>

                <div class="space-y-4 pt-6">
                    <div class="grid grid-cols-1 gap-4">
                        <Button
                            href="/dashboard/replacements/create"
                            class="w-full text-white hover:underline text-sm font-medium shadow-sm hover:shadow"
                        >
                            Me faire remplacer
                        </Button>

                        <p class="text-center">ou</p>

                        <Button
                            href="/dashboard/replacements"
                            class="w-full text-white hover:underline text-sm font-medium shadow-sm hover:shadow"
                        >
                            Je cherche un remplacement
                        </Button>
                    </div>

                    <p class="pt-4">👉 Rejoignez les premiers utilisateurs !</p>

                    <div class="flex justify-center">
                        <NuxtLink
                            href="/register"
                            class="text-white underline underline-offset-2 text-sm font-medium shadow-sm"
                        >
                            Inscription
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="text-white text-center"
            >
                <div class="mb-2 lg:absolute right-4 top-4">
                    <BellAlertIcon class="size-8 mx-auto animate-ring" />
                </div>
                <p>
                    Pour une meilleure gestion de vos remplacements, commencez par encoder votre tournée sur infiswap
                </p>
                <div class="grid grid-cols-1 gap-4">
                    <Button
                        href="/dashboard/replacements/create"
                        class="mt-4 w-full text-white hover:underline text-sm font-medium shadow-sm hover:shadow"
                    >
                        Me faire remplacer
                    </Button>

                    <p>ou</p>

                    <Button
                        href="/dashboard/replacements"
                        class="w-full text-white hover:underline text-sm font-medium shadow-sm hover:shadow"
                    >
                        Je cherche un remplacement
                    </Button>
                </div>
                <p class="mt-4">
                    cela vous permettra de bénéficier de l'ensemble des fonctionnalités de la plateforme.
                </p>
            </div>
        </div>
        <div
            class="col-span-6 lg:col-span-3 grid grid-cols-3 items-center shadow-lg rounded-lg overflow-hidden"
        >
            <div
                class="relative h-60 col-span-3 lg:col-span-1 lg:h-full w-full bg-red-200"
            >
                <LayoutsAppImage
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                <LayoutsAppImage
                    src="/home/mail-image.png"
                    class="absolute w-32 lg:w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div class="p-4 lg:p-8 col-span-3 lg:col-span-2 text-start lg:text-start">
                <p class="font-bold mb-4">
                    🎉 Ça y est, InfiSwap est en ligne ! 🩺
                </p>
                <p class="mb-4">
                    Après plusieurs semaines de travail intense, de tests et de collaboration avec des infirmier(ère)s de terrain, nous avons le plaisir de vous annoncer l’ouverture officielle de notre plateforme.
                </p>
                <p class="mb-4">
                    Notre objectif : vous offrir un outil simple, fluide et pensé pour répondre à vos besoins concrets — que vous cherchiez un remplacement, un complément d’activité ou une solution pour mieux organiser votre tournée.
                </p>
                <p class="mb-4">
                    🚀 Ce n’est que le début : d’autres fonctionnalités arrivent très bientôt pour enrichir encore votre expérience.
                </p>
                <p class="mb-4">
                    🙏 Merci pour votre patience, votre confiance et votre enthousiasme. L’aventure commence maintenant… et on est ravis de la vivre avec vous !
                </p>
            </div>
        </div>
        <div class="flex justify-center mt-6 lg:mt-0 lg:items-center lg:justify-center col-span-6 lg:col-span-1">
            <a
                href="/dashboard/replacements/immediate"
                class="transition-transform transform hover:scale-105"
            >
                <LayoutsAppImage
                    src="/home/help_me.png"
                    class="w-full max-w-xs h-48"
                />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BellAlertIcon } from '@heroicons/vue/24/solid';

const user = useUser();
</script>

<style>
@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(15deg); }
  3% { transform: rotate(-12deg); }
  5% { transform: rotate(10deg); }
  7% { transform: rotate(-8deg); }
  9% { transform: rotate(6deg); }
  11% { transform: rotate(-4deg); }
  13% { transform: rotate(2deg); }
  15% { transform: rotate(0); }
  100% { transform: rotate(0); }
}

.animate-ring {
  animation: ring 1.5s ease-in-out infinite;
  transform-origin: top center;
  display: inline-block;
}
</style>
