<template>
    <SidebarProvider>
        <Sidebar class="bg-white">
            <LayoutsAppSidebar />
        </Sidebar>
        <SidebarInset class="w-full lg:w-96 bg-gray-100">
            <header class="flex h-20 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20 bg-white shadow-md">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1 lg:ml-4 xl:-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
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
            <div
                :class="cn('flex flex-1 pr-8 flex-col gap-4 pt-0 xl:w-full', {
                    'p-8': isAdmin,
                    'pl-10': !isAdmin,
                })"
            >
                <NuxtPage />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<script lang="ts" setup>
import { cn } from '@/lib/utils';

const { isAdmin } = useAuth();
const { logout } = useAuth();
</script>
