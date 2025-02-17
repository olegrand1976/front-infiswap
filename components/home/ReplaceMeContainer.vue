<template>
    <div class="relative flex flex-col xl:space-y-32 lg:space-y-28 md:space-y-24 space-y-16 xl:mt-52 lg:mt-36 mb:pb-24 md:pb-20 pb-16 mt-32 z-40">
        <LayoutsGridCard />

        <div class="container z-20 flex flex-col sm:flex-row justify-center items-center xl:space-x-36 lg:space-x-28 md:space-x-20 sm:space-x-12 sm:space-y-0 space-y-8 mx-auto">
            <div>
                <h3 class="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-3xl text-center sm:text-start text-primary font-bold">
                    Me faire remplacer
                </h3>
                <div class="flex flex-col md:space-y-4 sm:space-y-2 space-y-8 xl:mt-8 lg:mt-4 md:mt-4 mt-8 sm:mt-1">
                    <p class="xl:text-base lg:text-sm lg:w-96 md:text-xs sm:text-[0.75rem] sm:text-start text-center text-sm md:w-80 sm:w-72">
                        <strong>Besoin d'un remplacement ?</strong> Avec InfiSwap, publiez votre annonce en
                        quelques secondes et trouvez rapidement un(e) infirmier(e) disponible près de chez vous. <br>
                        Simplifiez la gestion de vos absences et assurez la continuité des soins en toute sérénité !
                    </p>
                    <p class="xl:text-base lg:text-sm lg:w-96 md:text-xs sm:text-[0.75rem] sm:text-start text-center text-sm md:w-80 sm:w-72">
                        Nos infirmier(e)s sont aussi souvent sur les routes et se déplacent de patients en patients pendant
                        leurs tournées qui sont planifiées de semaine en semaine.
                    </p>
                </div>
                <div>
                    <Button
                        variant="outline"
                        class="rounded-full lg:text-sm text-xs mx-auto"
                        href="/"
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>
            <div>
                <NuxtImg
                    src="/home/Des_infirmiers.jpg"
                    alt="Des infirmiers"
                    class="rounded-3xl xl:w-[35rem] xl:h-[36rem] lg:h-[29rem] lg:w-auto md:h-[20rem] sm:h-[16rem] h-96 object-cover object-center"
                />
            </div>
        </div>

        <div class="absolute sm:bottom-0 bottom-6 right-0">
            <NuxtImg
                src="/Vector_2.png"
                class="xl:h-[51rem] lg:h-[43rem] md:h-[31rem] sm:h-[23rem] h-96 relative z-10"
            />
        </div>
        <div class="hidden sm:block absolute lg:top-6 xl:right-24 lg:right-8 md:top-12 md:right-12 sm:top-20 sm:right-8">
            <NuxtImg
                src="/icons/Unin.png"
                class="relative -z-10 xl:w-auto xl:h-auto lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-12 sm:h-12"
            />
        </div>

        <div class="hidden lg:block absolute xl:top-36 xl:left-8 lg:top-48 lg:left-10 ">
            <NuxtImg
                src="/stetho.png"
                class="relative -z-10 xl:w-48 xl:h-52 lg:w-40 lg:h-44"
            />
        </div>

        <div class="absolute xl:bottom-40 lg:bottom-16 md:bottom-8 sm:bottom-6 sm:top-auto top-48 left-6">
            <NuxtImg
                src="/icons/Unin.png"
                class="relative -z-10 xl:w-16 xl:h-16 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-7 sm:h-7 w-8 h-8"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
