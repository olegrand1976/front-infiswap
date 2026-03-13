<template>
    <div class="relative w-full pb-6 lg:py-12 lg:px-16 bg-white overflow-hidden">
        <div class="hidden lg:block absolute top-4 right-8 select-none">
            <LayoutsAppImage
                src="/icons/Unin.png"
                alt=""
                class="w-12 h-12"
            />
        </div>
        <div class="hidden lg:block absolute top-10 right-20 select-none">
            <LayoutsAppImage
                src="/icons/Unin.png"
                alt=""
                class="w-24 h-24"
            />
        </div>

        <h2 class="text-center text-2xl lg:text-4xl font-light text-primary mb-10 leading-snug">
            InfiSwap, une plateforme<br>pensée pour les infirmiers
        </h2>

        <div class="flex flex-col gap-4 lg:hidden">
            <div
                class="relative rounded-2xl overflow-hidden shadow-md border border-gray-100"
                style="height: 180px;"
            >
                <div class="absolute inset-0 bg-primary/90" />
                <LayoutsAppImage
                    src="/home/nurse_with_phone3.png"
                    alt="Professionnels de terrain"
                    class="absolute right-0 bottom-0 h-full w-auto object-contain"
                />
                <div class="absolute inset-0 flex flex-col justify-between p-5">
                    <p class="text-white font-semibold text-lg leading-snug max-w-[55%]">
                        Professionnels<br>de terrain
                    </p>
                    <Button
                        class="bg-white text-primary font-semibold rounded-xl px-5 py-2.5 self-start text-sm hover:scale-105 transition-transform duration-300"
                        href="/dashboard"
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>

            <div
                class="relative rounded-2xl overflow-hidden shadow-xl"
                style="height: 200px;"
            >
                <div class="absolute inset-0 bg-primary" />
                <LayoutsAppImage
                    src="/home/nurse_with_phone2.png"
                    alt="Me faire remplacer"
                    class="absolute right-0 bottom-0 h-full w-auto object-contain"
                />
                <div class="absolute inset-0 flex flex-col justify-between p-5">
                    <p class="text-white font-bold text-xl leading-snug max-w-[55%]">
                        Me faire<br>remplacer
                    </p>
                    <Button
                        class="bg-white text-primary font-bold rounded-xl px-5 py-2.5 self-start text-sm hover:scale-105 transition-transform duration-300"
                        href="/dashboard/replacements/create"
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>

            <div
                class="relative rounded-2xl overflow-hidden shadow-md border border-gray-100"
                style="height: 180px;"
            >
                <div class="absolute inset-0 bg-primary/90" />
                <LayoutsAppImage
                    src="/home/three_nurses.png"
                    alt="Je cherche un remplacement"
                    class="absolute right-0 bottom-0 h-full w-auto object-contain"
                />
                <div class="absolute inset-0 flex flex-col justify-between p-5">
                    <p class="text-white font-semibold text-lg leading-snug max-w-[55%]">
                        Trouver un<br>remplacement
                    </p>
                    <Button
                        class="bg-white text-primary font-semibold rounded-xl px-5 py-2.5 self-start text-sm hover:scale-105 transition-transform duration-300"
                        href="/dashboard/replacements"
                    >
                        En savoir plus
                    </Button>
                </div>
            </div>
        </div>

        <div class="hidden lg:flex items-center justify-center gap-6 lg:gap-8">
            <div class="border border-gray-200 bg-white rounded-2xl shadow-md flex flex-col items-center overflow-hidden pb-6 p-3 w-90 min-w-90 max-w-90">
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

            <div class="bg-primary/90 rounded-2xl shadow-xl flex flex-col items-center overflow-hidden pb-6 p-4 w-95 min-w-95 max-w-95">
                <div
                    class="w-full bg-white rounded-xl overflow-hidden mb-5 p-4"
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

            <div class="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center overflow-hidden pb-6 p-3 w-90 min-w-90 max-w-90">
                <div
                    class="w-full bg-primary/90 rounded-xl overflow-hidden mb-4"
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
