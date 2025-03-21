<template>
    <div class="container flex lg:flex-col flex-col-reverse sm:space-y-20 lg:py-20 py-0">
        <div class="flex lg:flex-row flex-col lg:space-x-10 lg:space-y-0 space-y-12 items-center">
            <div>
                <NuxtImg
                    src="/home/formation_pic.jpeg"
                    alt="Formation d'infirmiers"
                    class="w-[39rem] lg:h-[37rem] sm:h-[32rem] h-[23rem] lg:rounded-2xl rounded-3xl object-cover sm:object-center object-right"
                />
            </div>

            <div class="flex flex-col space-y-6 items-center">
                <div class="flex flex-row space-x-6 items-center">
                    <div>
                        <NuxtImg
                            src="/home/metier_infirmier_medicalib.jpeg"
                            alt="Groupe d'infirmiers"
                            class="sm:w-[13rem] sm:h-40 w-52 h-24 rounded-3xl object-cover"
                        />
                    </div>
                    <div>
                        <p class="lg:text-sm text-xs lg:w-72 sm:w-96 w-[14rem]">
                            Un suivi simplifié de vos formations obligatoires ! Avec InfiSwap,
                            suivez vos heures de formation en temps réel, recevez des rappels
                            automatiques et inscrivez-vous facilement en ligne. Assurez votre conformité
                            légale sans effort et développez vos compétences en toute sérénité !
                        </p>
                    </div>
                </div>

                <div class="flex flex-row space-x-6 items-center">
                    <div>
                        <NuxtImg
                            src="/home/infirmier_femme.png"
                            alt="Infirmière"
                            class="sm:w-[13rem] sm:h-40 w-52 h-24 rounded-3xl object-cover"
                        />
                    </div>
                    <div>
                        <p class="lg:text-sm text-xs lg:w-72 sm:w-96 w-[14rem]">
                            Le module "Formation" de notre plateforme de remplacement infirmier a été spécialement
                            conçu pour accompagner les infirmiers affiliés dans la gestion de leur cycle de formation
                            obligatoire, soit 60 heures de formation sur une période de 4 ans (moyenne annuelle de 15 heures).
                        </p>
                    </div>
                </div>

                <div class="flex flex-row space-x-6 items-center">
                    <div>
                        <NuxtImg
                            src="/home/infirmier_homme.png"
                            alt="Groupe d'infirmiers"
                            class="sm:w-[13rem] sm:h-40 w-52 h-24 rounded-3xl object-cover sm:object-center object-top"
                        />
                    </div>
                    <div>
                        <p class="lg:text-sm text-xs lg:w-72 sm:w-96 w-[14rem]">
                            Grâce à ce module, les infirmiers peuvent facilement suivre leurs heures de formation, accéder
                            à des offres adaptées et rester en conformité avec les exigences professionnelles.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative flex flex-col-reverse lg:flex-row justify-between items-center">
            <div class="flex flex-col lg:space-y-4 space-y-3">
                <h3 class="text-center lg:text-start xl:text-4xl lg:text-3xl sm:text-2xl text-primary">
                    Mes <strong>formations</strong>
                </h3>
                <h4 class="text-center lg:text-start font-light lg:mt-4 xl:text-2xl lg:text-xl text-primary sm:w-full w-64 sm:mx-0 mx-auto">
                    Gestion et suivi des formations pour infirmiers
                </h4>
                <p class="text-center lg:text-start xl:text-base lg:text-sm text-xs xl:w-[30rem] lg:w-[27rem] sm:w-[35rem] w-80 mx-auto lg:mx-0 xl:mt-8 lg:mt-6">
                    Le module "Formation" de notre plateforme de remplacement infirmier a été
                    spécialement conçu pour accompagner les infirmiers affiliés dans la gestion
                    de leur cycle de formation obligatoire, soit 60 heures de formation sur une
                    période de 4 ans (moyenne annuelle de 15 heures).
                </p>
                <p class="text-center lg:text-start xl:text-base lg:text-sm text-xs mt-6 xl:w-[30rem] lg:w-[27rem] sm:w-[35rem] w-80 mx-auto lg:mx-0">
                    Grâce à ce module, les infirmiers peuvent facilement suivre leurs heures de
                    formation, accéder à des offres adaptées et rester en conformité avec les exigences
                    de formation
                </p>
                <div class="flex flex-col space-y-4 lg:pt-8 sm:pt-10 pt-6 pb-12 lg:pb-0 lg:px-0 mx-auto lg:mx-0 px-40">
                    <div>
                        <Button
                            href="/"
                            class="w-48"
                        >
                            Fiche de remplacement
                        </Button>
                    </div>
                    <div>
                        <Button
                            href="/"
                            class="w-48"
                        >
                            Liste d'infirmiers
                        </Button>
                    </div>
                </div>
            </div>

            <div class="lg:absolute lg:-right-24 lg:-top-10">
                <NuxtImg
                    src="/home/online_medical.webp"
                    class="xl:w-[48rem] lg:w-[42rem]"
                />
            </div>

            <div class="hidden lg:block absolute -top-28 xl:left-52 lg:left-44">
                <NuxtImg
                    src="stethoscope_2.png"
                    class="xl:w-40 xl:h-44 lg:w-36 lg:h-40"
                />
            </div>
        </div>
    </div>
</template>
