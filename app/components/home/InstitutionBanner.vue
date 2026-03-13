<template>
    <section class="relative w-full bg-primary overflow-hidden">
        <div class="lg:hidden">
            <div class="px-6 pt-10 pb-6 text-center">
                <h2 class="text-2xl font-light text-white leading-snug tracking-tight">
                    InfiSwap, au service<br>des institutions et des<br>maisons de repos
                </h2>
            </div>

            <div class="flex flex-col items-center gap-3 px-8 pb-8">
                <Button
                    class="bg-white text-primary font-bold px-6 py-6 rounded-full w-full text-sm leading-tight hover:bg-white hover:scale-105 transition-transform duration-300 shadow-md"
                >
                    Trouver rapidement du personnel<br>infirmier qualifié
                </Button>
                <Button
                    class="bg-transparent border-2 border-white text-white font-bold rounded-full px-6 py-6 w-full text-sm leading-tight hover:scale-105 transition-transform duration-300"
                >
                    Une solution rapide pour<br>assurer la continuité des soins
                </Button>
            </div>

            <div
                class="relative w-full"
                style="aspect-ratio: 4/3;"
            >
                <LayoutsAppImage
                    src="/home/nurse_with_elder.png"
                    alt="Infirmier avec personne âgée"
                    class="absolute inset-0 w-full h-full"
                    style="object-fit: cover; object-position: center 20%;"
                />
            </div>
        </div>

        <div class="hidden lg:block">
            <div class="max-w-4xl mx-auto pt-12 pb-6 px-6 text-center">
                <h2 class="text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight">
                    InfiSwap, au service des institutions<br>et des maisons de repos
                </h2>
            </div>

            <div
                class="relative w-full"
                style="aspect-ratio: 16/9; max-height: 750px;"
            >
                <LayoutsAppImage
                    src="/home/nurse_with_elder.png"
                    alt="Infirmier avec personne âgée"
                    class="absolute inset-0 w-full h-full"
                    style="object-fit: cover; object-position: center 0%;"
                />

                <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 pb-16 z-10">
                    <Button
                        class="bg-white text-primary font-bold px-10 py-8 rounded-full min-w-100 hover:bg-white hover:scale-105 transition-transform duration-300"
                    >
                        Trouver rapidement du personnel<br>infirmier qualifié
                    </Button>
                    <Button
                        class="bg-primary border-2 border-white text-white font-bold rounded-full px-10 py-8 min-w-100 hover:scale-105 transition-transform duration-300"
                    >
                        Une solution rapide pour<br>assurer la continuité des soins
                    </Button>
                </div>
            </div>
        </div>
    </section>
</template>
