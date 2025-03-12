<template>
    <div>
        <header class="hidden md:block">
            <LayoutsHeader />
        </header>
        <header class="md:hidden">
            <LayoutsHeaderMobile />
        </header>
        <div class="bg-white flex flex-col">
            <div class="mt-16 lg:mt-22 md:bg-tertiary/30 h-40 lg:h-60 flex justify-center items-center relative">
                <h1 class="text-primary text-3xl font-semibold  lg:text-4xl text-center">
                    <slot
                        name="title"
                    />
                </h1>
                <div class="hidden md:block absolute -bottom-12 inset-x-auto">
                    <LayoutsLogo />
                </div>
            </div>
            <main class="flex-1 md:my-14 lg:mt-16">
                <slot />
            </main>
            <footer>
                <LayoutsFooter />
            </footer>
        </div>
    </div>
</template>
