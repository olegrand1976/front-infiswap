<template>
    <div class="container font-light grid grid-cols-5 gap-8 justify-between mt-12">
        <div class="col-span-5 lg:col-span-3 grid grid-cols-2 items-center shadow-lg rounded-lg overflow-hidden">
            <div class="relative h-60 col-span-2 lg:col-span-1 lg:h-full w-full bg-red-200">
                <NuxtImg
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                <NuxtImg
                    src="/home/mail-image.png"
                    class="absolute w-32 lg:w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div class="p-4 col-span-2 lg:col-span-1 text-start lg:text-start">
                <p class="font-bold mb-4">
                    Chers utilisateur,
                </p>
                <p class="mb-4">
                    Nous sommes ravis de vous annoncer que notre plateforme ouvrira ses portes à partir de <strong class="text-primary font-semibold">la deuxième moitié du mois de mars</strong>. Nous travaillons d'arrache-pied pour vous offrir une expérience optimale et innovante. Restez connectés pour découvrir nos prochaines annonces et mises à jour.
                </p>

                <p>Merci de votre confiance et à très bientôt !</p>

                <Button
                    class="font-semibold text-sm my-4"
                    href="/register-beta"
                >
                    Pré-inscription
                </Button>
            </div>
        </div>

        <div class="col-span-5 lg:col-span-2 grid place-content-center relative bg-rose-400 shadow-lg rounded-lg overflow-hidden p-4">
            <div class="text-white">
                <p>
                    Soyez averti dès le lancement de la plateforme aux alentours du 15/03 ! N’attendez plus pour vous inscrire !
                </p>
            </div>
        </div>
    </div>
</template>
