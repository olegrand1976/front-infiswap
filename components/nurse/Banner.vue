<template>
    <div class="relative w-full h-[650px] overflow-hidden">
        <div class="absolute inset-0 z-0">
            <LayoutsAppImage
                src="home/desktop.png"
                class="w-full h-full object-cover"
            />
        </div>

        <div class="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <LayoutsAppImage
                src="nurse_tech.png"
                class="w-80 h-auto"
            />
        </div>

        <div class="absolute -right-10 top-[4rem] h-[700px] w-[1200px] z-20">
            <LayoutsAppImage
                src="white_triangle.png"
                class="w-full h-full"
            />

            <div class="absolute inset-0 flex items-center justify-center gap-6 px-8 pb-[5rem] z-30 ml-[22rem]">
                <div class="flex flex-col text-right mt-[14rem]">
                    <span class="text-7xl font-medium text-primary leading-[4.5rem]">Pour</span>
                    <span class="text-4xl text-primary">infirmière</span>
                    <span class="text-7xl font-medium text-primary leading-[4.5rem]">Infiswap</span>
                </div>

                <LayoutsAppImage
                    src="home/happy_nurse_in_pink.png"
                    class="w-96 h-auto"
                />
            </div>
        </div>
    </div>
</template>
