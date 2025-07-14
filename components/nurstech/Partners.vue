<template>
    <div class="container mx-auto px-4 mb-8">
        <h1 class="text-primary text-3xl mb-8">
            Partenaires
        </h1>

        <div class="flex flex-col md:flex-row gap-8">
            <div class="flex flex-col md:w-1/2">
                <p class="text-lg font-medium mb-4 text-center md:text-left md:pl-10">
                    Banque
                </p>
                <LayoutsAppImage
                    src="home/bank.png"
                    alt="Banque"
                    class="w-full h-auto object-contain"
                />
            </div>

            <div class="flex flex-col md:w-1/2">
                <p class="text-lg font-medium mb-4 text-center md:text-left md:pl-10">
                    Gestionnaire de tournée
                </p>
                <LayoutsAppImage
                    src="home/tour_manager.png"
                    alt="Gestionnaire de tournée"
                    class="w-full h-auto object-contain"
                />
            </div>
        </div>
    </div>
</template>
