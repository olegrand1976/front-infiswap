<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Anomalie d'application">
            <template #action>
                <Button
                    class="rounded-md"
                    @click="openRecipientModalCreate"
                >
                    <CirclePlus class="h-5 w-5" />
                    <span class="hidden md:inline-block">Nouveau destinataire</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div class="px-4 pt-4 pb-2 text-sm text-muted-foreground">
                Toute anomalie applicative déclenche un email aux destinataires
                ci‑dessous.
            </div>

            <div class="p-4 flex flex-wrap gap-3 items-center">
                <InputIcon
                    v-model="filterQuery"
                    rounded="md"
                    placeholder="Filtrer par nom ou e‑mail"
                    class="max-w-sm"
                    @input="debouncedFilterSync"
                />
                <Button
                    class="rounded-md"
                    variant="outline"
                    @click="resetFilter"
                >
                    <RefreshCw class="md:mr-2 h-5 w-5" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>
            <DataTable
                v-else
                :data="tableRows"
                :columns="columns"
            />

            <Dialog v-model:open="recipientModalOpen">
                <DialogContent class="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {{
                                isEditMode ? "Modifier le destinataire" : "Nouveau destinataire"
                            }}
                        </DialogTitle>
                        <DialogDescription>
                            {{
                                isEditMode
                                    ? "Mets à jour le nom ou l’e-mail du destinataire des alertes."
                                    : "Ajoute une personne qui recevra les alertes de connexion base de données."
                            }}
                        </DialogDescription>
                    </DialogHeader>

                    <div class="grid gap-4 py-2">
                        <div class="grid gap-2">
                            <Label for="alert-name">Nom</Label>
                            <Input
                                id="alert-name"
                                v-model="newRecipient.name"
                                type="text"
                                autocomplete="name"
                                placeholder="Nom du destinataire"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="alert-email">E‑mail</Label>
                            <Input
                                id="alert-email"
                                v-model="newRecipient.email"
                                type="email"
                                autocomplete="email"
                                placeholder="destinataire@domaine.com"
                            />
                        </div>
                    </div>

                    <DialogFooter class="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            @click="closeRecipientModal"
                        >
                            Annuler
                        </Button>
                        <Button
                            :disabled="loading || submitting"
                            class="rounded-md ml-2"
                            @click="submitRecipient"
                        >
                            {{ isEditMode ? "Enregistrer" : "Ajouter" }}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, CirclePlus, Pencil, RefreshCw, Trash2 } from 'lucide-vue-next';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RollingLoader from '~/components/RollingLoader.vue';
import { getErrorMessage } from '~/lib/utils';

type AlertRecipient = {
    email: string;
    name: string;
};

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'Alerte — Destinataires' });

const { isAdmin, isDeveloper } = useAuth();
const { $toast } = useNuxtApp();
const {
    recipients,
    loading,
    getDatabaseAlertRecipients,
    createDatabaseAlertRecipient,
    updateDatabaseAlertRecipient,
    deleteDatabaseAlertRecipient,
} = useMonitoring();

if (!isAdmin.value && !isDeveloper.value) {
    await navigateTo('/dashboard/admin', { replace: true });
}

const filterQuery = ref('');
const sort = reactive<{ order: 'ASC' | 'DESC'; by: 'name' | 'email' }>({
    order: 'ASC',
    by: 'name',
});

const recipientModalOpen = ref(false);
const editingOriginalEmail = ref<string | null>(null);
const isEditMode = computed(() => editingOriginalEmail.value !== null);

const submitting = ref(false);
const newRecipient = ref<{ name: string; email: string }>({
    name: '',
    email: '',
});

const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const debouncedQuery = ref('');

const debouncedFilterSync = () => {
    if (debounceTimer.value) clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => {
        debouncedQuery.value = filterQuery.value;
    }, 350);
};

const resetFilter = () => {
    filterQuery.value = '';
    debouncedQuery.value = '';
    sort.order = 'ASC';
    sort.by = 'name';
};

const tableRows = computed(() => {
    const q = debouncedQuery.value.trim().toLowerCase();
    let list = [...(recipients.value ?? [])];

    if (q) {
        list = list.filter(
            r =>
                r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
        );
    }

    const mult = sort.order === 'ASC' ? 1 : -1;
    list.sort((a, b) => {
        const va = sort.by === 'name' ? a.name : a.email;
        const vb = sort.by === 'name' ? b.name : b.email;
        return mult * va.localeCompare(vb, 'fr', { sensitivity: 'base' });
    });

    return list;
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = (columnKey: 'name' | 'email') => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'ASC';
    }
};

const openRecipientModalCreate = () => {
    editingOriginalEmail.value = null;
    newRecipient.value = { name: '', email: '' };
    recipientModalOpen.value = true;
};

const openRecipientModalEdit = (recipient: AlertRecipient) => {
    editingOriginalEmail.value = recipient.email;
    newRecipient.value = {
        name: recipient.name,
        email: recipient.email,
    };
    recipientModalOpen.value = true;
};

const closeRecipientModal = () => {
    recipientModalOpen.value = false;
    editingOriginalEmail.value = null;
};

const submitRecipient = async () => {
    const name = newRecipient.value.name.trim();
    const email = newRecipient.value.email.trim();

    if (!name || !email) {
        $toast({
            title: 'Erreur',
            description: 'Renseigne le nom et l’e‑mail.',
            variant: 'destructive',
        });
        return;
    }

    if (!isEditMode.value) {
        const exists = recipients.value.some(
            r => r.email.toLowerCase() === email.toLowerCase(),
        );
        if (exists) {
            $toast({
                title: 'Erreur',
                description: 'Cet e‑mail est déjà dans la liste.',
                variant: 'destructive',
            });
            return;
        }
    }
    else {
        const original = editingOriginalEmail.value!;
        const clashesWithOther = recipients.value.some(
            r =>
                r.email.toLowerCase() === email.toLowerCase()
                && r.email.toLowerCase() !== original.toLowerCase(),
        );
        if (clashesWithOther) {
            $toast({
                title: 'Erreur',
                description: 'Cet e‑mail est déjà utilisé pour un autre destinataire.',
                variant: 'destructive',
            });
            return;
        }
    }

    submitting.value = true;
    try {
        if (isEditMode.value && editingOriginalEmail.value) {
            await updateDatabaseAlertRecipient(editingOriginalEmail.value, {
                name,
                email,
            });
            closeRecipientModal();
            $toast({
                title: 'Succès',
                description: 'Destinataire mis à jour.',
            });
        }
        else {
            await createDatabaseAlertRecipient({ name, email });
            closeRecipientModal();
            $toast({
                title: 'Succès',
                description: 'Destinataire ajouté.',
            });
        }
    }
    catch (error: unknown) {
        $toast({
            title: 'Erreur',
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
    finally {
        submitting.value = false;
    }
};

const handleDelete = async (recipient: AlertRecipient) => {
    if (!confirm(`Retirer ${recipient.email} des destinataires d’alerte ?`)) {
        return;
    }
    try {
        await deleteDatabaseAlertRecipient(recipient.email);
        $toast({
            title: 'Succès',
            description: 'Destinataire retiré.',
        });
    }
    catch {
        $toast({
            title: 'Erreur',
            description: 'Suppression impossible.',
            variant: 'destructive',
        });
    }
};

const columns: ColumnDef<AlertRecipient>[] = [
    {
        accessorKey: 'name',
        header: () =>
            h(
                Button,
                { variant: 'ghost', class: 'px-0', onClick: () => setSort('name') },
                () => ['Nom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            ),
        cell: ({ row }) =>
            h('div', { class: 'font-medium' }, row.getValue('name') || '—'),
    },
    {
        accessorKey: 'email',
        header: () =>
            h(
                Button,
                { variant: 'ghost', class: 'px-0', onClick: () => setSort('email') },
                () => ['E‑mail', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            ),
        cell: ({ row }) =>
            h(
                'div',
                { class: 'text-sm text-muted-foreground' },
                row.getValue('email') || '—',
            ),
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        cell: ({ row }) => {
            const recipient = row.original;
            return h('div', { class: 'flex justify-center items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        class:
              'w-8 h-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50',
                        title: 'Modifier',
                        onClick: () => openRecipientModalEdit(recipient),
                    },
                    () => h(Pencil, { class: 'w-4 h-4' }),
                ),
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        class:
              'w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50',
                        title: 'Retirer',
                        onClick: () => handleDelete(recipient),
                    },
                    () => h(Trash2, { class: 'w-4 h-4' }),
                ),
            ]);
        },
    },
];

onMounted(async () => {
    await getDatabaseAlertRecipients();
});
</script>
