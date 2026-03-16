<template>
    <div class="relative w-full bg-white flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 pt-10 gap-8">
        <div class="hidden lg:flex w-full lg:w-1/2 justify-center">
            <LayoutsAppImage
                src="/home/two_nurses-girls.png"
                alt="Infirmiers avec tablette"
                class="w-full max-w-lg h-auto block"
            />
        </div>

        <div class="w-full lg:w-1/2 flex flex-col items-start justify-center">
            <h2 class="text-3xl lg:text-5xl font-light text-primary leading-snug mb-8">
                Rejoignez la plateforme<br>et simplifiez la gestion<br>des remplacements<br>infirmiers.
            </h2>
            <Button
                class="bg-primary text-white text-sm font-medium rounded-full px-12 py-5 hover:bg-primary/80 hover:scale-105 transition-transform duration-300"
                href="/register"
            >
                S'inscrire
            </Button>
        </div>
    </div>
</template>
