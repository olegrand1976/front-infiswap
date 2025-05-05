<template>
    <SidebarProvider class="bg-green-300">
        <Sidebar class="bg-white">
            <LayoutsAppSidebar />
        </Sidebar>
        <SidebarInset
            :class="cn('w-full w-96', {
                'bg-gray-100': isAdmin,
                'bg-white': !isAdmin,
            })"
        >
            <header class="flex h-20 shrink-0 items-center px-6 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20 bg-white shadow-md">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1 lg:ml-4 xl:-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
                </div>
                <div class="ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger class="flex items-center space-x-2">
                            <div>
                                <p class="font-medium">
                                    {{ user.full_name }}
                                </p>
                                <p
                                    :class="cn('text-xs -mt-1 text-end font-bold', {
                                        'text-success': isAdmin,
                                        'text-primary': !isAdmin,
                                    })"
                                >
                                    {{ getRole(user.account_type) }}
                                </p>
                            </div>
                            <template v-if="user.profil_url != null">
                                <Avatar>
                                    <AvatarImage :src="useRuntimeConfig().public.API_URL + '/storage/' + hasChangedAvatar" />
                                    <AvatarFallback>{{ user.firstname.slice(1, 1).toUpperCase() + user.lastname.slice(1, 1).toUpperCase() }}</AvatarFallback>
                                </Avatar>
                            </template>
                            <template v-else>
                                <UserCircleIcon
                                    class="w-12 text-black/40"
                                />
                            </template>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                            <template v-if="roles.length>1">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    v-for="(role, index) in roles.filter((role) => role!==user.account_type)"
                                    :key="index"
                                    @click="switchRole(role)"
                                >
                                    Passer en {{ getRole(role) }}
                                </DropdownMenuItem>
                            </template>
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
                class="flex flex-1 flex-col gap-4 m-6"
            >
                <NuxtPage />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<script lang="ts" setup>
import { UserCircleIcon } from '@heroicons/vue/24/solid';
import { useRuntimeConfig } from '#app';
import type { AccountType, User } from '~/lib/types';
import { cn } from '@/lib/utils';
import { getRole } from '~/lib/utils';

const { isAdmin, hasChangedAvatar } = useAuth();
const roles = ref<AccountType[]>();
const user = useState<User>('user');

const { logout, getRoles, switchRole } = useAuth();

onMounted(async () => {
    roles.value = await getRoles();
});
</script>
