<template>
    <div
        class="container font-light grid grid-cols-6 gap-8 justify-between mt-12"
    >
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

        <div class="col-span-6 lg:col-span-2 p-4 lg:p-8 grid place-content-center relative bg-rose-400 shadow-lg rounded-lg overflow-hidden">
            <div class="text-white">
                <p class="mb-4">
                    🚀 InfiSwap ouvre ses portes : rejoignez le mouvement ! 🩺
                </p>
                <p class="mb-4">
                    Notre équipe a peaufiné chaque détail pour vous offrir une plateforme à la hauteur de vos attentes : simple, rapide et pensée pour les infirmier(ère)s de terrain.
                </p>
                <p class="mb-4">
                    💡 Que vous cherchiez un remplacement, un complément d’heures ou une collaboration de long terme, tout commence ici.
                </p>
                <p class="mb-4">
                    👉 Rejoignez-nous dès maintenant et faites partie des premiers utilisateurs d’InfiSwap !
                </p>
                <div class="text-center">
                    <Button
                        href="/register"
                        class="w-36"
                    >
                        Inscription
                    </Button>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-6 lg:mt-0 lg:items-center lg:justify-center col-span-6 lg:col-span-1">
            <a href="/dashboard/replacements/immediate" class="transition-transform transform hover:scale-105">
                <LayoutsAppImage
                    src="/home/help_me.png"
                    class="w-full max-w-xs h-48"
                />
            </a>
        </div>
    </div>
</template>
