<template>
    <div class="hidden sm:flex space-x-8 container mt-8">
        <div class="lg:w-[60%] sm:w-[50%] bg-white shadow p-8 rounded-2xl flex lg:flex-row sm:flex-col lg:justify-start sm:justify-center sm:items-center sm:mx-auto space-x-6">
            <div class="xl:w-[40%] lg:w-[30%]">
                <LayoutsLogo class="lg:w-auto sm:w-36"/>
            </div>
            <div class="xl:w-[60%] lg:w-[70%] sm:mx-auto lg:mx-0 sm:flex sm:flex-col sm:justify-center lg:block ">
                <p class="xl:text-base md:text-sm sm:text-xs sm:text-center lg:text-start">
                    Votre plateforme dédiée aux infirmiers libéraux, facilitant les remplacements, la
                    gestion des tournées et le suivi des formations. Elle optimise la planification, réduit
                    le temps administratif et améliore la coordination, offrant ainsi plus d'efficacité, de
                    flexibilité et une meilleure qualité de soins.
                </p>
                <Button
                    variant="outline"
                    class="rounded-full mt-6"
                    href="/contact"
                >
                    <span class="sm:text-xs md:text-sm lg:text-base">Contactez-nous</span>
                </Button>
            </div>
        </div>

        <!-- <div class="relative mt-32 sm:mt-auto sm:absolute flex flex-col justify-center sm:justify-start md:space-y-8 sm:space-y-4 space-y-10 xl:left-24 xl:top-20 xl:right-auto lg:right-[2rem] lg:top-16 lg:ms-auto md:top-32 md:mr-[40vw] sm:mr-[40%] sm:top-20">
            <div>
                <LayoutsLogo class="xl:w-[42rem] lg:w-[28rem] md:w-80 sm:w-64 w-[14.5rem] mx-auto md:mx-auto" />
            </div>
            <p class="xl:w-[28rem] lg:w-[28rem] md:w-[24rem] xl:text-base lg:text-sm sm:w-[19rem] text-xs text-center mx-8 sm:mx-auto" /><p>Infiswap, la solution dédiée aux infirmiers libéraux pour gérer efficacement les remplacements.</p>
            <p class="m-4">
                Trouvez rapidement un remplaçant fiable, simplifiez la planification et assurez la continuité des soins.
            </p>
            <Button
                variant="outline"
                class="rounded-full lg:text-sm text-xs mx-auto"
                href="/"
            >
                Inscrivez-vous
            </Button>
        </div> -->
    </div>

    <div class="sm:hidden flex flex-col justify-center items-center mt-40 mx-12 mb-24 space-y-10">
        <div>
            <LayoutsLogo class="w-64"/>
        </div>
        <div>
            <p class="text-xs text-center">
                Votre plateforme dédiée aux infirmiers libéraux, facilitant les remplacements, la
                gestion des tournées et le suivi des formations. Elle optimise la planification, réduit
                le temps administratif et améliore la coordination, offrant ainsi plus d'efficacité, de
                flexibilité et une meilleure qualité de soins.
            </p>
        </div>
    </div>
</template>