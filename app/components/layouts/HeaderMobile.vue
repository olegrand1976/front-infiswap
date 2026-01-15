<template>
    <div class="relative flex flex-col">
        <div class="absolute inset-0 z-0">
            <LayoutsAppImage
                src="Mask_group.png"
                class="w-full h-48"
            />
        </div>
        <div class="flex z-20 pt-2 relative space-x-3 justify-end items-center px-4">
            <div>
                <LayoutsDropdownLang />
            </div>
            <div>
                <LayoutsSheetMenu />
            </div>
        </div>
        <div class="mt-5 z-20 relative flex justify-center">
            <LayoutsLogo class="w-[15rem]" />
        </div>
    </div>
</template>
