<template>
    <div class="sm:pt-16 lg:container lg:w-full lg:mx-auto lg:px-auto md:mx-0 md:px-0 md:w-auto sm:container relative flex flex-row-reverse justify-between z-20 xl:h-[52.5rem] sm:h-auto sm:mb-auto mb-64">
        <div class="hidden sm:block relative z-20">
            <NuxtImg
                src="/home/img_accueil_1.png"
                alt="Infirmière"
                class="scale-x-[-1] xl:w-[40rem] xl:h-[55rem] lg:w-[27rem] lg:h-[40rem] md:w-[22rem] md:h-[32rem] sm:w-[17rem] sm:h-[26rem] relative z-20 lg:-mt-16 lg:ms-auto lg:-mr-12 md:-mt-12 md:ms-8"
            />
            <div class="hidden absolute z-0 xl:top-52 xl:-right-16 lg:top-36 lg:-right-40 md:right-auto sm:-right-24 sm:top-32 top-[88rem]">
                <NuxtImg
                    src="/Vector_2.png"
                    class="relative xl:w-[41rem] xl:h-[36.5rem] lg:w-[36rem] lg:h-[25.75rem] md:w-[30rem] md:h-[20rem] sm:w-[20rem] sm:h-[17rem] z-10"
                />
            </div>
        </div>

        <div class="sm:hidden absolute -bottom-[15.5rem] left-0">
            <NuxtImg
                src="/Vector_1.png"
                class="relative w-[55vw] z-10"
            />
        </div>

        <div class="relative mt-52 sm:mt-auto sm:absolute flex flex-col justify-center sm:justify-start md:space-y-8 sm:space-y-4 space-y-10 xl:left-24 xl:top-20 xl:right-auto lg:right-[27rem] lg:top-16 lg:ms-auto md:top-32 md:ms-[45vw] sm:ms-[40%] sm:top-32">
            <div>
                <LayoutsLogo class="xl:w-[42rem] lg:w-[28rem] md:w-80 sm:w-64 w-[14.5rem] mx-auto md:mx-auto" />
            </div>
            <p class="xl:w-[28rem] lg:w-[28rem] md:w-[24rem] xl:text-base lg:text-sm sm:w-[19rem] text-xs text-center mx-8 sm:mx-auto">
                    <p>Infiswap, la solution dédiée aux infirmiers libéraux pour gérer efficacement les remplacements.</p>
                    <p class="m-4">Trouvez rapidement un remplaçant fiable, simplifiez la planification et assurez la continuité des soins.</p>
            </p>
            <Button
                variant="outline"
                class="rounded-full lg:text-sm text-xs mx-auto"
                href="/"
            >
                Inscrivez-vous
            </Button>
        </div>
    </div>
</template>
