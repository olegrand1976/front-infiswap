<template>
    <section class="container mx-auto px-4 lg:py-10">
        <div class="flex flex-col md:flex-row items-center bg-primary rounded-[2em] relative overflow-hidden">
            <div class="md:w-1/2 w-full text-white px-12 z-10 py-4 lg:py-0">
                <h2 class="text-4xl lg:text-6xl mb-4">
                    Création <br />
                    de site web <br />
                    professionnel <br />
                    <span class="font-bold">
                        <span
                            class="font-semibold"
                            style="text-decoration: underline; text-underline-offset: 8px; text-decoration-thickness: 4px;"
                        >
                            "clé
                        </span>
                        en main"
                    </span>
                </h2>
                <p class="mb-4">
                    Une <span class="font-bold">présence digitale</span> sur
                    <span class="font-bold">mesure</span>, <br />
                    <span class="font-bold">adaptée</span> à la
                    <span class="font-bold">réalité</span> des
                    <span class="font-bold">soignantes indépendantes.</span>
                </p>
            </div>

            <div class="md:w-1/2 w-full relative z-10">
                <LayoutsAppImage
                    src="/home/monitor_with_laptop.png"
                    alt="Image de communication"
                    class="w-full h-auto object-contain md:pr-4 lg:pr-0"
                />
                <LayoutsAppImage
                    src="/home/two_settings.png"
                    alt="Image décorative"
                    class="hidden lg:block absolute bottom-4 right-4 w-48 animate-spin-slow pointer-events-none"
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
@keyframes spin-slow {
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
}

.animate-spin-slow {
animation: spin-slow 20s linear infinite;
}
</style>
