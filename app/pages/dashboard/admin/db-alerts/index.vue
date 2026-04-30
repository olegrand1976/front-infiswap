<template>
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-white rounded-lg border p-6 space-y-2">
            <h1 class="text-xl font-semibold">
                Alerte urgente connexion base de donnees
            </h1>
            <p class="text-sm text-gray-600">
                Cette liste est utilisee par le controle automatique toutes les 10 minutes.
                En cas de panne DB, un email urgent (bandeau rouge) est envoye via Mailjet.
            </p>
        </div>

        <div class="bg-white rounded-lg border p-6 space-y-4">
            <div
                v-for="(recipient, index) in formRecipients"
                :key="index"
                class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
            >
                <div class="md:col-span-2">
                    <label class="text-sm font-medium block mb-1">Nom</label>
                    <input
                        v-model="recipient.name"
                        type="text"
                        class="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Nom du destinataire"
                    >
                </div>
                <div class="md:col-span-2">
                    <label class="text-sm font-medium block mb-1">Email</label>
                    <input
                        v-model="recipient.email"
                        type="email"
                        class="w-full rounded border px-3 py-2 text-sm"
                        placeholder="destinataire@domaine.com"
                    >
                </div>
                <button
                    type="button"
                    class="h-10 px-3 rounded border text-sm hover:bg-gray-50"
                    @click="removeRecipient(index)"
                >
                    Supprimer
                </button>
            </div>

            <div class="flex gap-3">
                <button
                    type="button"
                    class="px-4 py-2 rounded border text-sm hover:bg-gray-50"
                    @click="addRecipient"
                >
                    Ajouter un email
                </button>
                <button
                    type="button"
                    class="px-4 py-2 rounded bg-primary text-white text-sm disabled:opacity-60"
                    :disabled="loading"
                    @click="saveRecipients"
                >
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'Alerte DB - Destinataires' });

const { isSuperAdmin, isDeveloper } = useAuth();
const { $toast } = useNuxtApp();
const { recipients, loading, getDatabaseAlertRecipients, updateDatabaseAlertRecipients } = useMonitoring();

if (!isSuperAdmin.value && !isDeveloper.value) {
    await navigateTo('/dashboard/admin', { replace: true });
}

const formRecipients = ref<{ email: string; name: string }[]>([]);

const addRecipient = () => {
    formRecipients.value.push({
        email: '',
        name: '',
    });
};

const removeRecipient = (index: number) => {
    formRecipients.value.splice(index, 1);
};

const saveRecipients = async () => {
    const payload = formRecipients.value
        .map(recipient => ({
            email: recipient.email.trim(),
            name: recipient.name.trim(),
        }))
        .filter(recipient => recipient.email !== '' && recipient.name !== '');

    if (payload.length === 0) {
        $toast({
            title: 'Erreur',
            description: 'Ajoutez au moins un destinataire valide.',
            variant: 'destructive',
        });
        return;
    }

    try {
        await updateDatabaseAlertRecipients(payload);
        formRecipients.value = [...recipients.value];

        $toast({
            title: 'Succes',
            description: 'Destinataires enregistres.',
        });
    } catch (error) {
        $toast({
            title: 'Erreur',
            description: 'Impossible d\'enregistrer la configuration.',
            variant: 'destructive',
        });
    }
};

await getDatabaseAlertRecipients();
formRecipients.value = [...recipients.value];

if (formRecipients.value.length === 0) {
    addRecipient();
}
</script>
