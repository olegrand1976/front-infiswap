<template>
    <div class="relative w-full py-12 px-6 lg:px-16 bg-white overflow-hidden">
        <div class="absolute top-4 right-8 select-none">
            <LayoutsAppImage
                src="/icons/Unin.png"
                alt="Plus 1"
                class="w-12 h-12"
            />
        </div>
        <div class="absolute top-10 right-20 select-none">
            <LayoutsAppImage
                src="/icons/Unin.png"
                alt="Plus 2"
                class="w-24 h-24"
            />
        </div>

        <h2 class="text-center text-2xl lg:text-4xl font-light text-primary mb-16 leading-snug">
            InfiSwap, une plateforme<br>pensée pour les infirmiers
        </h2>

        <div class="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            <div class="border border-gray-200 bg-white rounded-2xl shadow-md flex flex-col items-center overflow-hidden pb-6 p-3 w-full lg:w-90 lg:min-w-90 lg:max-w-90">
                <div
                    class="hidden lg:flex w-full bg-primary/90 rounded-xl overflow-hidden mb-4 items-center justify-center"
                    style="height: 300px;"
                >
                    <LayoutsAppImage
                        src="/home/nurse_with_phone3.png"
                        alt="Professionnels de terrain"
                        class="block -mb-4"
                    />
                </div>
                <p class="text-center text-primary px-2 mb-4 leading-snug">
                    Une solution parfaite<br>pour les professionnels<br>de terrain
                </p>
                <Button
                    class="bg-primary text-white rounded-lg px-5 py-1.5 hover:bg-primary/90 w-75 hover:scale-105 transition-transform duration-300"
                    href="/dashboard"
                >
                    En savoir plus
                </Button>
            </div>

            <div class="bg-primary/90 rounded-2xl shadow-xl flex flex-col items-center overflow-hidden pb-6 p-4 w-full lg:w-95 lg:min-w-95 lg:max-w-95">
                <div
                    class="hidden lg:block w-full bg-white rounded-xl overflow-hidden mb-5 p-4"
                    style="height: 340px;"
                >
                    <LayoutsAppImage
                        src="/home/nurse_with_phone2.png"
                        alt="Me faire remplacer"
                        class="w-full h-auto block"
                    />
                </div>
                <p class="text-center text-white text-base font-semibold px-4 mb-5 leading-snug">
                    Me faire<br>remplacer
                </p>
                <Button
                    class="bg-white text-primary font-medium rounded-lg px-6 py-2 hover:bg-white lg:mt-10 w-75 hover:scale-105 transition-transform duration-300"
                    href="/dashboard/replacements/create"
                >
                    En savoir plus
                </Button>
            </div>

            <div class="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center overflow-hidden pb-6 p-3 w-full lg:w-90 lg:min-w-90 lg:max-w-90">
                <div
                    class="hidden lg:block w-full bg-primary/90 rounded-xl overflow-hidden mb-4"
                    style="height: 300px;"
                >
                    <LayoutsAppImage
                        src="/home/three_nurses.png"
                        alt="Je cherche un remplacement"
                        class="w-full h-auto block"
                    />
                </div>
                <p class="text-center text-primary px-2 mb-4 leading-snug">
                    Je cherche<br>un remplacement à<br>effectuer
                </p>
                <Button
                    class="bg-primary text-white rounded-lg px-5 py-1.5 hover:bg-primary/90 w-75 hover:scale-105 transition-transform duration-300"
                    href="/dashboard/replacements"
                >
                    En savoir plus
                </Button>
            </div>
        </div>
    </div>
</template>
