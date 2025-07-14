<template>
    <div class="bg-white flex flex-col font-light">
        <header class="hidden sm:block">
            <LayoutsNurseHeader />
        </header>
        <header class="sm:hidden">
            <LayoutsNurseHeaderMobile />
        </header>
        <main class="flex-1 mt-20 lg:mt-[8rem]">
            <NuxtPage />
        </main>
        <footer>
            <LayoutsNurseFooter />
        </footer>
    </div>
</template>
