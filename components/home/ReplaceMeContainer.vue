<template>
    <div class="relative py-16 flex flex-col">
        <NuxtImg
            src="/triangle_image.png"
            alt="Des infirmiers"
            class="absolute h-full right-0 top-0"
        />
        <div class="container mx-auto z-10 grid grid-cols-2 gap-16 justify-between items-center">
            <div class="space-y-2 md:space-y-4 lg:space-y-8">
                <h3 class="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-3xl text-center sm:text-start text-primary font-bold">
                    Me faire remplacer
                </h3>
                <p>
                    <strong>Besoin d'un remplacement ?</strong> Avec InfiSwap, publiez votre annonce en
                    quelques secondes et trouvez rapidement un(e) infirmier(e) disponible près de chez vous. <br>
                    Simplifiez la gestion de vos absences et assurez la continuité des soins en toute sérénité !
                </p>
                <p>
                    Nos infirmier(e)s sont aussi souvent sur les routes et se déplacent de patients en patients pendant
                    leurs tournées qui sont planifiées de semaine en semaine.
                </p>
                <div>
                    <Button
                        variant="outline"
                        class="rounded-full mt-4 lg:text-sm text-xs mx-auto"
                        href="/"
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>
            <NuxtImg
                src="/home/Des_infirmiers.jpg"
                alt="Des infirmiers"
                class="ml-auto rounded-3xl xl:w-[35rem] xl:h-[36rem] lg:h-[29rem] lg:w-auto md:h-[20rem] sm:h-[16rem] h-96 object-cover object-center"
            />

            <NuxtImg
                src="/icons/Unin.png"
                class="z-0 w-20 absolute transform -translate-y-1/3 bottom-1/4"
            />
            <NuxtImg
                src="/stetho.png"
                class="z-0 w-28 absolute top-28"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
