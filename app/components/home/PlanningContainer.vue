<template>
    <div class="md:mt-12 mt-24 relative overflow-hidden bg-white lg:bg-tertiary/25 lg:py-40">
        <div class="container">
            <div class="grid grid-cols-2 items-center gap-12">
                <div class="mx-auto col-span-2 order-2 lg:order-0 lg:col-span-1 z-20 mt-6 sm:mt-0">
                    <LayoutsAppImage
                        src="/home/infirmier_smile.png"
                        alt="Image de planification sur paperasse"
                        class="rounded-3xl h-64 md:h-112 object-cover"
                    />
                </div>

                <div class="col-span-2 order-1 lg:order-0 lg:col-span-1 flex flex-col md:space-y-12 space-y-6 text-center lg:text-start">
                    <h2 class="text-3xl lg:text-5xl text-primary">
                        Mon <span class="font-bold">planning</span>
                    </h2>
                    <p>
                        Une gestion simplifiée et optimisée ! Avec InfiSwap,<br class="hidden lg:inline">
                        automatisez l'affectation des tournées,<br class="hidden lg:inline">
                        ajustez les plannings en temps réel et assurez une répartition<br class="hidden lg:inline">
                        efficace des soins. Gagnez en productivité, réduisez les imprévus <br class="hidden lg:inline">
                        et offrez un service fluide et organisé à vos infirmiers.
                    </p>
                    <div>
                        <Button
                            variant="outline"
                            class="inline-flex rounded-3xl"
                            href="/contact"
                        >
                            Contactez-nous
                        </Button>
                    </div>
                </div>
            </div>

            <div class="hidden sm:block absolute z-20 top-12 right-28  lg:right-40 transform -translate-x-1/2">
                <LayoutsAppImage
                    src="stethoscope_2.png"
                    class="relative xl:w-52 w-40 lg-block hidden"
                />
            </div>
        </div>

        <LayoutsAppImage
            src="triangle_left.png"
            class="hidden lg:inline-block lg:absolute top-0 w-1/2 h-full"
        />
    <!--
        <div class="sm:hidden absolute z-10 top-12 left-12">
            <LayoutsAppImage
                src="/icons/Unin.png"
                class="relative w-10 h-10"
            />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
</script>
