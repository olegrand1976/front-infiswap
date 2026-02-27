<template>
    <div class="bg-white flex flex-col font-light">
        <header class="hidden sm:block">
            <LayoutsHeader />
        </header>
        <header class="sm:hidden">
            <LayoutsHeaderMobile />
        </header>
        <main class="flex-1 md:mt-20 pb-16 lg:pb-0">
            <NuxtPage />
        </main>
        <footer>
            <LayoutsFooter />
        </footer>
        <LayoutsBottomTabsMenu />
    </div>
</template>
