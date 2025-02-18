<template>
    <div class="bg-white flex flex-col">
        <header class="hidden sm:block">
            <LayoutsHeader />
        </header>
        <header class="sm:hidden">
            <LayoutsHeaderMobile />
        </header>
        <main class="flex-1 md:mt-20">
            <NuxtPage />
        </main>
        <footer>
            <LayoutsFooter />
        </footer>
    </div>
</template>
