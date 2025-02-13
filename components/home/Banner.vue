<template>
    <div class="container grid grid-cols-5 gap-4 justify-between mt-10">
        <div class="col-span-3 grid grid-cols-2 items-center shadow-lg rounded-lg overflow-hidden">
            <div class="relative col-span-1 h-full w-full bg-red-200">
                 <NuxtImg
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                 <NuxtImg
                    src="/home/mail-image.png"
                    class="absolute w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                 />
            </div>
            <div class="p-4 font-light">
                <p class="font-bold mb-4">Chers utilisateurs,</p>
                <p class="mb-4">Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de la deuxième moitié du mois de mars. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.</p>

                <p>Merci de votre confiance et à très bientôt !</p>
            </div>
        </div>

        <div class="w-full col-span-2 relative">
            <NuxtImg
                src="/container_register.png"
                class="w-full"
            />
            <div class="absolute ml-2 lg:mr-16 sm:mr-8 2xl:bottom-[15%] xl:bottom-[12%] bottom-[20%] xl:text-sm sm:text-[0.55rem] text-white left-6">
                <h2 class="font-semibold">
                    Inscrivez-vous dès maintenant
                </h2>
                <p class="mt-2">
                    Profitez d'une remise incroyable de 50 % sur votre abonnement dès aujourd'hui.
                    Accédez à toutes nos fonctionnalités premium et bénéficiez d’un service de qualité
                    à moitié prix ! Cette offre est limitée, alors n’attendez plus pour vous inscrire
                    et démarrer votre expérience à prix réduit. Inscrivez-vous maintenant et
                    économisez dès votre première année !
                </p>
                <Button
                    variant="secondary"
                    href="/register-beta"
                    class="lg:mt-3 text-primary w-36 lg:text-sm sm:text-xs md:mt-3"
                >
                    <span class="sm:text-xs md:text-sm">S'inscrire</span>
                </Button>
            </div>
        </div>
    </div>

    <div class="sm:hidden flex flex-col justify-center items-center mt-40 mx-12 mb-24 space-y-10">
        <div>
            <!-- <LayoutsLogo class="w-64" /> -->
            <NuxtImg src="/home/mail-image.png"/>
        </div>
        <div>
            <p class="text-xs text-center">
                <p class="font-semibold mb-4">Chers utilisateurs,</p>
                <p>Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de la deuxième moitié du mois de mars. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.</p>

                <p>Merci de votre confiance et à très bientôt !</p>

            </p>
        </div>
    </div>
</template>
