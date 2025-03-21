<template>
    <div class="relative py-16 flex flex-col">
        <LayoutsAppImage
            src="triangle_image.png"
            alt="Des infirmiers"
            class="absolute h-1/2 md:h-full right-0 bottom-0"
        />
        <div class="relative container z-10">
            <div class="lg:px-32 grid grid-cols-2 justify-between items-center mx-auto gap-8 md:gap-16">
                <div class="col-span-2 md:col-span-1 space-y-4 md:space-y-6 text-center md:text-start">
                    <h3 class="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-3xl text-primary">
                        <span>Me faire</span> <span class="font-bold">remplacer</span>
                    </h3>
                    <p>
                        <strong>Besoin d'un remplacement ?</strong><br class="lg:hidden"> Avec InfiSwap, publiez votre annonce en
                        quelques secondes et trouvez rapidement un(e) infirmier(e) disponible près de chez vous. <br>
                        Simplifiez la gestion de vos absences et assurez la continuité des soins en toute sérénité !
                    </p>
                    <p>
                        Nos infirmier(e)s sont aussi souvent sur les routes et se déplacent de patients en patients pendant
                        leurs tournées qui sont planifiées de semaine en semaine.
                    </p>
                    <!-- <div>
                        <Button
                            variant="outline"
                            class="rounded-full mt-4 lg:text-sm text-xs mx-auto"
                            href="/"
                        >
                            En savoir plus
                        </Button>
                    </div> -->
                </div>
                <div class="col-span-2 md:col-span-1">
                    <LayoutsAppImage
                        src="/home/woman_infirmier.png"
                        alt=" femme infirmier"
                        class="ml-auto rounded-3xl h-96 w-full object-cover object-center"
                    />
                </div>
            </div>

            <LayoutsAppImage
                src="stetho.png"
                class="hidden md:inline-block z-0 w-16 lg:w-24 md:absolute -top-5 lg:-top-12 -left-7 lg:left-20"
            />
            <LayoutsAppImage
                src="icons/Unin.png"
                class="hidden md:inline-block z-0 w-14 md:absolute transform -left-5 lg:left-20 bottom-10"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
