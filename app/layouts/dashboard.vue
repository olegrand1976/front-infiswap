<template>
    <SidebarProvider class="bg-green-300">
        <Sidebar class="bg-white">
            <LayoutsAppSidebar :key="user.account_type" />
        </Sidebar>
        <SidebarInset
            :class="cn('w-full w-96', {
                'bg-gray-100': isAdmin,
                'bg-white': !isAdmin,
            })"
        >
            <header class="flex h-20 shrink-0 items-center px-6 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20 bg-white shadow-md">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1 lg:ml-4 xl:-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
                </div>

                <div class="ml-auto flex flex-row-reverse items-center space-x-reverse space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger class="flex items-center space-x-2">
                            <div>
                                <p
                                    v-if="user?.type == 'institution'"
                                    class="font-medium"
                                >
                                    {{ user?.institution?.name || 'Institution XXX' }}
                                </p>
                                <p
                                    v-else
                                    class="font-medium"
                                >
                                    {{ user?.full_name || 'xxx XXX' }}
                                </p>
                                <p
                                    :class="cn('text-xs -mt-1 text-end font-bold', {
                                        'text-success': isAdmin,
                                        'text-primary': !isAdmin,
                                    })"
                                >
                                    {{ user?.type == 'standard' ? getRole(user?.account_type) : 'INSTITUTION' }}
                                </p>
                            </div>
                            <template v-if="user?.profil_url != null">
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
                            <template v-if="roles && roles.length > 1">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    v-for="(role, index) in roles.filter((role) => role!==user?.account_type)"
                                    :key="index"
                                    @click="switchRole(role)"
                                >
                                    Passer en {{ getRole(role) }}
                                </DropdownMenuItem>
                            </template>

                            <template v-if="canSwitchView">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="handleSwitchView">
                                    {{ user?.type === 'institution' ? 'Passer en Infirmier(e)' : 'Passer en Institution' }}
                                </DropdownMenuItem>
                            </template>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <NuxtLink to="/dashboard/subscriptions">Abonnement</NuxtLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                v-if="user?.account_type != 'nurse' && user?.account_type != 'caregiver' && user?.account_type != 'midwife'"
                            >
                                <NuxtLink to="/dashboard/settings">Paramètres</NuxtLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                class="hover:bg-primary"
                                @click="logout"
                            >
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        v-if="isAdmin"
                        class="pr-4"
                    >
                        <NuxtLink
                            to="/dashboard/admin/mails"
                            class="inline-block"
                        >
                            <EnvelopeIcon class="w-6 text-primary hover:text-primary/80 transition-colors duration-150" />
                        </NuxtLink>
                    </div>
                    <div class="relative inline-block pr-4">
                        <div class="flex space-x-4 flex-nowrap">
                            <NotificationsNotificationDropdown />
                            <div
                                class="cursor-pointer"
                                title="Signaler un problème"
                                @click="showReportModal = true"
                            >
                                <FaceFrownIcon class="w-6 h-6 text-gray-500" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <div
                                        class="relative cursor-pointer"
                                        @click="handleSeen()"
                                    >
                                        <BellAlertIcon class="w-6 h-6 text-gray-500" />

                                        <span
                                            v-if="showSpan"
                                            class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2
                                                bg-red-500 text-white text-xs font-bold
                                                rounded-full h-4 w-4 flex items-center justify-center
                                                pointer-events-none"
                                        >
                                            1
                                        </span>
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    v-if="showNotifUI"
                                    class="w-56 origin-top-left mr-44"
                                    :style="{
                                        position: 'absolute',
                                        left: '0',
                                        transform: 'translateX(-20px)',
                                    }"
                                >
                                    <DropdownMenuItem
                                        class="text-left pl-4 hover:bg-gray-50"
                                        @click="showDialog = true"
                                    >
                                        Désactiver les notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Dialog v-model:open="showReportModal">
                            <DialogContent class="sm:max-w-md">
                                <DialogHeader class="text-left">
                                    <DialogTitle class="text-left">
                                        Signaler un problème
                                    </DialogTitle>
                                    <DialogDescription class="text-left mt-2">
                                        Souhaitez vous signaler un problème sur cette page :
                                        <span class="font-mono text-xs">{{ currentPath }}</span>
                                    </DialogDescription>

                                    <div class="mt-4">
                                        <Textarea
                                            v-model="reportDescription"
                                            class="w-full border rounded p-2 text-sm focus:outline-primary"
                                            rows="3"
                                            placeholder="Expliquez brièvement le problème rencontré"
                                        />
                                    </div>

                                    <div class="mt-4 flex justify-end gap-2">
                                        <DialogClose as-child>
                                            <Button class="px-4 py-2 text-sm text-gray-700 rounded bg-white border hover:bg-white">
                                                Annuler
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            class="px-4 py-2 text-white text-sm rounded hover:bg-primary/90"
                                            @click="submitReport"
                                        >
                                            Valider
                                        </Button>
                                    </div>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
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
import { UserCircleIcon, EnvelopeIcon, FaceFrownIcon } from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import type { AccountType, User } from '~/lib/types';
import { cn } from '@/lib/utils';
import { getRole } from '~/lib/utils';

const { isAdmin, hasChangedAvatar } = useAuth();

const roles = ref<AccountType[]>([]);
const user = useState<User>('user');

const { $toast } = useNuxtApp();
const { logout, getRoles, switchRole, switchView } = useAuth();
const { reportProblem } = useMail();

const showReportModal = ref(false);
const route = useRoute();
const currentPath = computed(() => route.fullPath.replace(/^\//, ''));
const reportDescription = ref('');

const MEDICAL_ROLES = ['nurse', 'caregiver', 'midwife', 'collaborator'];
const canSwitchView = computed(() =>
    !!user.value?.institution_id
    && user.value?.roles?.some((r: string) => MEDICAL_ROLES.includes(r)),
);

const handleSwitchView = async () => {
    const newType = user.value?.type === 'institution' ? 'standard' : 'institution';
    await switchView(newType);
    await navigateTo(newType === 'institution' ? '/dashboard/institution' : '/dashboard');
};

const submitReport = async () => {
    try {
        const payload = {
            path: currentPath.value,
            description: reportDescription.value.trim() !== '' ? reportDescription.value.trim() : null,
        };
        await reportProblem(payload);
        $toast({
            title: 'Succès',
            description: 'Le problème a été signalé avec succès.',
        });
        showReportModal.value = false;
    }
    catch (error) {
        console.error(error);
        $toast({
            title: 'Erreur',
            description: 'Une erreur est survenue.',
            variant: 'destructive',
        });
    }
};

const { getUnreadCount, startPolling, stopPolling } = useNotifications();

onMounted(async () => {
    roles.value = await getRoles();
    await getUnreadCount();
    startPolling(10000);
});

onUnmounted(() => {
    stopPolling();
});

definePageMeta({
    ssr: false,
});
</script>
