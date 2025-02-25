<template>
    <div class="py-20 bg-tertiary/25 bg-white">
        <div class="container">
            <div class="lg:px-32 flex flex-col space-y-8 sm:space-y-24">
                <div class="relative grid grid-cols-2 gap-16">
                    <div class="z-10 col-span-2 md:col-span-1">
                        <NuxtImg
                            src="/home/Group_2217.png"
                            alt="Image d'une femme"
                            class="w-full h-full lg:object-contain lg:rounded-none sm:object-cover sm:rounded-3xl"
                        />
                    </div>

                    <div class="hidden md:flex h-full md:flex-col gap-4 justify-around">
                        <h3 class="xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold">
                            Je cherche <br>un remplacement <br>à effectuer
                        </h3>
                        <div>
                            <p class="">
                                <strong>Vous cherchez un remplacement ?</strong>
                                Avec InfiSwap, accédez en un clic aux annonces disponibles près de chez vous.
                                Trouvez facilement des opportunités adaptées à votre emploi du temps et développez
                                votre réseau tout en optimisant votre activité.
                            </p>
                            <Button
                                href="/"
                                class="mt-4 lg:mt-8 inline-flex lg:text-sm sm:text-xs"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>

                    <div class="sm:hidden bg-white flex flex-col space-y-4 py-4 text-center rounded-3xl absolute -bottom-16 z-20 transform left-1/2 -translate-x-1/2 w-11/12">
                        <div class="absolute right-32 -top-5">
                            <NuxtImg
                                src="/icons/croix.png"
                                class="z-30 w-10 h-10"
                            />
                        </div>
                        <h3 class="font-bold text-primary">
                            Chercher un remplacement
                        </h3>
                        <Button
                            class="mx-auto"
                            href="/"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>

                <!-- <div class="flex relative flex-col sm:container sm:flex-row justify-center items-center xl:space-x-40 lg:space-x-24 md:space-x-20 sm:space-x-16">
                    <div class="hidden sm:flex flex-col space-y-8">
                        <h3 class="xl:text-4xl lg:text-3xl md:text-2xl text-primary font-bold">
                            Gestion de ma tournée
                        </h3>
                        <p class="xl:w-[28rem] lg:w-[26rem] md:w-[22rem] sm:w-64 xl:text-base lg:text-sm sm:text-xs">
                            Optimisez votre tournée en toute simplicité! Avec InfiSwap, planifiez
                            intelligemment vos soins en réduisant les déplacements et en regroupant
                            vos patients par secteur. <br>
                            Gagnez du temps, adaptez votre planning selon vos préférences et concentrez-vous
                            sur l'essentiel: la qualité des soins.
                        </p>
                        <div>
                            <Button
                                href="/"
                                class="inline-flex lg:text-sm sm:text-xs"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>

                    <div class="sm:w-auto w-full z-10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.9860057087326!2d4.262952197233401!3d50.81289797013747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c6f75b8a8a8d%3A0x8f8a1b1436ea2521!2sH%C3%B4pital%20Erasme%20-%20Cliniques%20universitaires%20de%20Bruxelles!5e0!3m2!1sfr!2smg!4v1737985810191!5m2!1sfr!2smg"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="w-full h-72 xl:w-[33rem] xl:h-96 lg:w-[27rem] lg:h-72 md:w-72 md:h-64 sm:w-64 sm:h-52 rounded-3xl"
                        >
                            .
                        </iframe>
                    </div>

                    <div class="sm:hidden bg-white flex flex-col space-y-4 py-4 px-10 rounded-3xl absolute -bottom-16 z-20">
                        <div class="absolute right-28 -top-5">
                            <NuxtImg
                                src="/icons/croix.png"
                                class="z-30 w-10 h-10"
                            />
                        </div>
                        <h3 class="font-bold text-primary">
                            Gestion de ma tournée
                        </h3>
                        <Button class="mx-auto">
                            En savoir plus
                        </Button>
                    </div>
                </div> -->

                <!-- <div class="flex relative flex-col sm:container sm:flex-row justify-center items-center xl:space-x-40 lg:space-x-24 md:space-x-20 sm:space-x-16">
                    <div class="z-10 w-full">
                        <NuxtImg
                            src="/home/cc62cd9.png"
                            alt="Image d'un homme âgé avec une infirmière"
                            class="h-80 w-full xl:w-[33rem] xl:h-[22rem] lg:w-[26rem] lg:h-80 md:w-[22rem] md:h-[14.5rem] rounded-3xl object-cover object-top"
                        />
                    </div>

                    <div class="hidden sm:flex flex-col space-y-8">
                        <h3 class="xl:text-4xl lg:text-3xl  md:text-2xl xl:w-96 md:w-80 text-primary font-bold">
                            Vos remplacements en toute simplicité
                        </h3>
                        <p class="xl:w-[28rem] md:w-80 xl:text-base lg:text-sm sm:text-xs">
                            Avec InfiSwap, trouvez et gérez vos remplacements facilement. Plus de
                            visibilité sur les annonces, une recherche optimisée par localisation et
                            une mise en relation rapide entre infirmiers. <br>
                            Gagnez du temps, développez votre réseau et exercez en toute sérénité !
                        </p>
                        <div>
                            <Button
                                href="/"
                                class="inline-flex lg:text-sm sm:text-xs"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>

                    <div class="sm:hidden bg-white flex flex-col space-y-4 py-4 px-10 rounded-3xl absolute -bottom-16 z-20">
                        <div class="absolute right-32 -top-5">
                            <NuxtImg
                                src="/icons/croix.png"
                                class="z-30 w-10 h-10"
                            />
                        </div>
                        <h3 class="font-bold text-primary text-center w-52">
                            Vos remplacements en toute simplicité
                        </h3>
                        <Button class="mx-auto">
                            En savoir plus
                        </Button>
                    </div>
                </div> -->

                <!-- <div class="flex relative flex-col sm:container sm:flex-row justify-center items-center xl:space-x-40 lg:space-x-24 md:space-x-20 sm:space-x-16">
                    <div class="hidden sm:flex flex-col space-y-8">
                        <h3 class="xl:text-4xl lg:text-3xl md:text-2xl text-primary font-bold">
                            Créez facilement vos tournées
                        </h3>
                        <div class="xl:w-[28rem] lg:w-[26rem] xl:text-base lg:text-sm sm:text-xs -mt-2">
                            <h4 class="font-semibold">
                                Pour l'infirmière libérale
                            </h4>
                            <span class="">
                                Avec InfiSwap, gagnez du temps en planifiant vos tournées en quelques clics.
                                Optimisez vos déplacements grâce à un itinéraire intelligent, regroupez vos
                                patients efficacement et adaptez votre emploi du temps selon vos préférences.
                                Moins de gestion, plus de temps pour vos patients !
                            </span>
                        </div>
                        <div class="xl:w-[28rem] lg:w-[26rem] xl:text-base lg:text-sm sm:text-xs -mt-2">
                            <h4 class="font-semibold">
                                Pour le bureau d'infirmiers
                            </h4>
                            <span>
                                Centralisez et optimisez la gestion des plannings infirmiers avec InfiSwap.
                                Automatisez l'affectation des tournées, adaptez les soins aux disponibilités
                                et suivez en temps réel l'organisation des équipes. <br>
                                Une coordination simplifiée pour une gestion plus efficace et un service de
                                soin optimal.
                            </span>
                        </div>
                        <div>
                            <Button
                                href="/"
                                class="inline-flex md:text-sm sm:text-xs"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>

                    <div class="w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.9860057087326!2d4.262952197233401!3d50.81289797013747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c6f75b8a8a8d%3A0x8f8a1b1436ea2521!2sH%C3%B4pital%20Erasme%20-%20Cliniques%20universitaires%20de%20Bruxelles!5e0!3m2!1sfr!2smg!4v1737985810191!5m2!1sfr!2smg"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="w-full h-72 xl:w-[33rem] xl:h-96 lg:w-[27rem] lg:h-96 md:w-80 md:h-80 sm:w-[16.5rem] sm:h-72 rounded-3xl"
                        >
                            .
                        </iframe>
                    </div>

                    <div class="sm:hidden bg-white flex flex-col space-y-4 py-4 px-10 rounded-3xl absolute -bottom-16 z-20">
                        <div class="absolute right-36 -top-5">
                            <NuxtImg
                                src="/icons/croix.png"
                                class="z-30 w-10 h-10"
                            />
                        </div>
                        <h3 class="font-bold text-primary">
                            Créez facilement vos tournées
                        </h3>
                        <Button class="mx-auto">
                            En savoir plus
                        </Button>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
