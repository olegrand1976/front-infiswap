<template>
    <SidebarProvider>
        <Sidebar class="bg-white">
            <LayoutsAppSidebar />
        </Sidebar>
        <SidebarInset>
            <header class="flex h-20 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
                    <Form>
                        <FormField name="search">
                            <FormItem>
                                <FormControl>
                                    <div class="flex w-32 lg:w-96 bg-gray-200 rounded-full items-center justify-between ps-3 pe-1">
                                        <Input
                                            :v-model="search"
                                            placeholder="Rechercher"
                                            class="w-80 text-xs bg-transparent"
                                        />
                                        <Button
                                            type="submit"
                                            class="bg-primary text-white w-7 h-7 rounded-full"
                                        >
                                            <MagnifyingGlassIcon class="h-7 w-7" />
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </Form>
                </div>
                <div class="ml-auto mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage
                                    src="https://github.com/unovue.png"
                                    alt="Infiswap-user-profile"
                                />
                                <AvatarFallback>IS</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="mr-6">
                            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Abonnement</DropdownMenuItem>
                            <DropdownMenuItem>Parametres</DropdownMenuItem>
                            <DropdownMenuItem>Deconnexion</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
                <NuxtPage />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const search = ref('');
</script>
