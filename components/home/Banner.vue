<template>
    <div class="container font-light grid grid-cols-5 gap-4 justify-between mt-10">
        <div class="col-span-5 lg:col-span-3 grid grid-cols-2 items-center shadow-lg rounded-lg overflow-hidden">
            <div class="relative col-span-3 lg:col-span-2 h-full w-full max-h-72 bg-red-200">
                 <NuxtImg
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                 <NuxtImg
                    src="/home/mail-image.png"
                    class="absolute w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                 />
            </div>
            <div class="p-4 col-span-2 lg:col-span-4 text-start lg:text-start">
                <p class="font-bold mb-4">Chers utilisateurs,</p>
                <p class="mb-4">Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de la deuxième moitié du mois de mars. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.</p>

                <p>Merci de votre confiance et à très bientôt !</p>
            </div>
        </div>

        <div class="col-span-5 lg:col-span-2 grid place-content-center relative bg-rose-400 shadow-lg rounded-lg overflow-hidden p-4">
            <div class="text-white">
                <h2 class="text-center font-semibold mb-4">
                    Inscrivez-vous dès maintenant
                </h2>
                <p>
                    Profitez d'une remise incroyable de 50 % sur votre abonnement dès aujourd'hui.
                    Accédez à toutes nos fonctionnalités premium et bénéficiez d’un service de qualité
                    à moitié prix ! Cette offre est limitée, alors n’attendez plus pour vous inscrire
                    et démarrer votre expérience à prix réduit.
                </p>
                <p class="mt-1 mb-4">Inscrivez-vous maintenant et économisez dès votre première année !</p>
                <div class="text-center">
                    <Button
                        variant="secondary"
                        href="/register-beta"
                        class="lg:mt-3 text-primary w-36 lg:text-sm sm:text-xs md:mt-3"
                    >
                        S'inscrire
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
