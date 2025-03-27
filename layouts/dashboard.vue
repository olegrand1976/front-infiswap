<template>
    <SidebarProvider>
        <Sidebar class="bg-white">
            <LayoutsAppSidebar />
        </Sidebar>
        <SidebarInset class="w-full lg:w-96">
            <header class="flex h-20 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1 lg:ml-4 xl:-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
                    <!-- <Form>
                        <FormField name="search">
                            <FormItem>
                                <FormControl>
                                    <div class="flex lg:w-96 bg-gray-200 rounded-full items-center justify-between ps-3 pe-1">
                                        <Input
                                            :v-model="search"
                                            placeholder="Rechercher"
                                            class="w-44 sm:w-80 text-xs bg-transparent"
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
                    </Form> -->
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
                            <DropdownMenuItem>
                                <NuxtLink to="/dashboard/subscriptions">Abonnement</NuxtLink>
                            </DropdownMenuItem>
                            <!-- <DropdownMenuItem>Parametres</DropdownMenuItem> -->
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                class="hover:bg-primary"
                                @click="logout"
                            >
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div class="flex flex-1 pl-10 pr-8 flex-col gap-4 pt-0 xl:w-full">
                <NuxtPage />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<script lang="ts" setup>
const { logout } = useAuth();
</script>
