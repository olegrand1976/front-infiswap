<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Membres"
            :count="members.length"
        >
            <template #action>
                <Button
                    as-child
                    href="/dashboard/institution/members/create"
                    class="rounded-md"
                >
                    <PlusIcon class="w-6 h-6" />
                    <span class="hidden lg:inline-block">Ajouter un membre</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent class="flex flex-col min-h-[500px]">
            <div
                v-if="loading"
                class="flex flex-col gap-6 justify-center items-center flex-1 text-center"
            >
                <div class="relative">
                    <div class="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <div class="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div class="space-y-2">
                    <p class="text-muted-foreground animate-pulse text-xl font-semibold italic">
                        Récupération des membres...
                    </p>
                    <p class="text-xs text-muted-foreground/60 uppercase tracking-widest">
                        Veuillez patienter quelques instants
                    </p>
                </div>
            </div>
            <DataTable
                v-else
                :data="members"
                :columns="columns"
                :loading="loading"
            />
        </DashboardAdminPageContent>

        <Dialog
            :open="isDeleteModalOpen"
            @update:open="isDeleteModalOpen = $event"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Retirer le membre</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir retirer ce membre de l'institution ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        @click="isDeleteModalOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        :in-progress="saving"
                        @click="confirmDelete"
                    >
                        Retirer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { PlusIcon } from '@heroicons/vue/24/outline';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';

const {
    members,
    roles,
    loading,
    saving,
    getMembers,
    getAvailableRoles,
    updateMemberRole,
    removeMember,
} = useInstitutionMembers();

useHead({ title: 'Membres' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

const isDeleteModalOpen = ref(false);
const memberToDelete = ref<any>(null);

onMounted(async () => {
    await Promise.all([
        getMembers(),
        getAvailableRoles(),
    ]);
});

const handleDeleteClick = (member: any) => {
    memberToDelete.value = member;
    isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
    if (memberToDelete.value) {
        try {
            await removeMember(memberToDelete.value.id);
            isDeleteModalOpen.value = false;
            memberToDelete.value = null;
        }
        catch (e) {}
    }
};

const handleRoleChange = async (member: any, newRole: string) => {
    try {
        await updateMemberRole(member.id, newRole);
    }
    catch (e) {}
};

const columns: ColumnDef<any>[] = [
    {
        id: 'name',
        accessorFn: row => `${row.firstname} ${row.lastname}`,
        header: 'Nom',
        cell: ({ row }) => h('div', { class: 'font-medium ml-4' }, `${row.original.firstname} ${row.original.lastname}`),
    },
    {
        id: 'email',
        accessorKey: 'email',
        header: 'E-mail',
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.original.email),
    },
    {
        id: 'role',
        header: 'Rôle',
        cell: ({ row }) => {
            const member = row.original;
            const currentRole = member.institution_user_roles?.[0]?.role?.name || '';

            return h('div', { class: 'ml-4' }, [
                h(Select, {
                    'modelValue': currentRole,
                    'onUpdate:modelValue': (val: string) => handleRoleChange(member, val),
                }, () => [
                    h(SelectTrigger, { class: 'w-[180px] rounded-md' }, () => [
                        h(SelectValue, { placeholder: 'Rôle' }),
                    ]),
                    h(SelectContent, () => roles.value.map(role =>
                        h(SelectItem, { value: role.name, key: role.id }, () => role.name === 'administrator' ? 'Administrateur' : 'Gestionnaire'),
                    )),
                ]),
            ]);
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const member = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => navigateTo(`/dashboard/institution/members/${member.id}`),
                },
                {
                    label: 'Retirer',
                    destructive: true,
                    onClick: () => handleDeleteClick(member),
                },
            ];

            return h('div', { class: 'ml-4' }, [
                h(DropdownMenuAction, { actions }),
            ]);
        },
    },
];
</script>
