<template>
    <div class="min-h-screen bg-white flex flex-col">
        <header class="hidden md:block shrink-0">
            <LayoutsHeader />
        </header>
        <header class="md:hidden shrink-0">
            <LayoutsHeaderMobile />
        </header>

        <main class="flex-1 flex flex-col pb-16 lg:pb-0">
            <slot />
        </main>

        <footer class="shrink-0">
            <LayoutsFooter />
        </footer>

        <LayoutsBottomTabsMenu />
    </div>
</template>
