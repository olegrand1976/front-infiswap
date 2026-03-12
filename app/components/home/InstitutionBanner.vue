<template>
    <section class="relative w-full bg-primary">
        <div class="max-w-4xl mx-auto pt-12 pb-6 px-6 text-center">
            <h2 class="text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight">
                InfiSwap, au service des institutions<br class="hidden md:block">
                et des maisons de repos
            </h2>
        </div>

        <div class="flex lg:hidden flex-col items-center gap-4 px-6 pb-12 pt-4">
            <Button
                class="bg-white text-primary font-bold px-6 py-4 rounded-full w-full max-w-xs text-sm hover:bg-white hover:scale-105 transition-transform duration-300"
            >
                Trouver rapidement du personnel<br>infirmier qualifié
            </Button>
            <Button
                class="bg-primary border-2 border-white text-white font-bold rounded-full px-6 py-4 w-full max-w-xs text-sm hover:scale-105 transition-transform duration-300"
            >
                Une solution rapide pour<br>assurer la continuité des soins
            </Button>
        </div>

        <div class="hidden lg:block relative w-full h-212 -mt-16">
            <LayoutsAppImage
                src="/home/nurse_with_elder.png"
                alt="Infirmier avec personne âgée"
                class="absolute inset-0 w-full h-full"
                style="object-fit: cover; object-position: center top;"
            />
            <div class="relative z-10 flex flex-col justify-end items-center h-full gap-4 px-6 pb-25">
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
    </section>
</template>
