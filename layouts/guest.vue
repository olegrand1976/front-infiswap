<template>
    <div class="bg-white flex flex-col">
        <header>
            <LayoutsHeader />
            <div class="mt-32 sm:mt-0 sm:bg-tertiary/30 sm:h-80 flex justify-center items-center relative">
                <h1 class="text-primary text-3xl lg:text-4xl text-center">
                    <slot
                        name="title"
                    />
                </h1>
                <div class="hidden sm:block absolute -bottom-12 inset-x-auto">
                    <slot name="logo" />
                </div>
            </div>
        </header>
        <main class="flex-1 mb-24">
            <slot />
        </main>
        <footer>
            <LayoutsFooter />
        </footer>
    </div>
</template>
