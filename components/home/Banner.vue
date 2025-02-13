<template>
    <div class="hidden sm:flex space-x-8 container mt-8">
        <div class="w-full shadow p-4 rounded-2xl flex lg:flex-row sm:flex-col lg:justify-start sm:justify-center sm:items-center sm:mx-auto space-x-6">
            <div class="xl:w-[40%] lg:w-[30%] grid gap-2 place-content-center h-full w-1/2">
                <!-- <LayoutsLogo class="lg:w-auto sm:w-36" /> -->
                 <NuxtImg src="/home/mail-image.png"/>
            </div>
            <div class="xl:w-[60%] lg:w-[70%] sm:mx-auto lg:mx-0 sm:flex sm:flex-col sm:justify-center items-center lg:block ">
                <div class="xl:text-base md:text-sm mt-4 sm:text-xs sm:text-center lg:text-start">
                    <p class="font-semibold mb-4">Chers utilisateurs,</p>
                    <p>Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de la deuxième moitié du mois de mars. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.</p>

                    <p>Merci de votre confiance et à très bientôt !</p>
                </div>
                <!-- <Button
                    variant="outline"
                    class="rounded-full mt-6"
                    href="/contact"
                >
                    <span class="sm:text-xs md:text-sm lg:text-base">Contactez-nous</span>
                </Button> -->
            </div>
        </div>

        <div class="w-full relative hidden lg:block">
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
                <!-- Votre plateforme dédiée aux infirmiers libéraux, facilitant les remplacements, la
                gestion des tournées et le suivi des formations. Elle optimise la planification, réduit
                le temps administratif et améliore la coordination, offrant ainsi plus d'efficacité, de
                flexibilité et une meilleure qualité de soins. -->
                <p class="font-semibold mb-4">Chers utilisateurs,</p>
                <p>Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de la deuxième moitié du mois de mars. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.</p>

                <p>Merci de votre confiance et à très bientôt !</p>

            </p>
        </div>
    </div>
</template>
