<template>
    <div class="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-5">
        <section class="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Inbox class="w-5 h-5" />
                        <h2 class="font-semibold tracking-wide">
                            Historique des e-mails
                        </h2>
                    </div>
                    <span class="text-xs bg-white/20 rounded-md px-2 py-1">{{ mail?.length || 0 }} messages</span>
                </div>
            </div>

            <div class="p-3 lg:p-4 space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div
                    v-if="!mail?.length"
                    class="rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-gray-500"
                >
                    Aucun e-mail envoyé pour le moment.
                </div>

                <button
                    title="Nouveau message"
                    class="w-full hidden lg:flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/90 text-white font-medium py-2.5 shadow-sm transition"
                    @click="showNewMailModal = true"
                >
                    <MailPlus class="w-4 h-4" />
                    Nouveau message
                </button>

                <article
                    v-for="mailItem in mail"
                    :key="mailItem.id"
                    class="rounded-md border p-4 cursor-pointer transition-all duration-150"
                    :class="selectedMail?.id === mailItem.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'"
                    @click="selectMail(mailItem)"
                >
                    <p
                        class="text-xs text-gray-500 truncate"
                        :title="'À : ' + parseRecipients(mailItem.recipients).map(r => r.email).join(', ')"
                    >
                        À :
                        <span
                            v-for="(recipient, idx) in parseRecipients(mailItem.recipients)"
                            :key="idx"
                            class="font-medium text-gray-700"
                        >
                            {{ recipient.email }}<span v-if="Number(idx) < parseRecipients(mailItem.recipients).length - 1">, </span>
                        </span>
                    </p>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900 line-clamp-1">
                        {{ mailItem.object }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                        {{ mailItem.content }}
                    </p>
                    <div class="mt-3 text-[11px] text-gray-400">
                        {{ formatDate(mailItem.created_at) }}
                    </div>
                </article>
            </div>
        </section>

        <section class="hidden lg:flex flex-col bg-white overflow-hidden">
            <div class="bg-gray-50 border-b px-6 py-4">
                <h2 class="font-semibold text-gray-900">
                    Détail du message
                </h2>
            </div>

            <div
                v-if="selectedMail"
                class="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-10rem)]"
            >
                <div class="grid gap-2">
                    <p class="text-xs uppercase tracking-wide text-gray-500">
                        Destinataires
                    </p>
                    <p class="text-sm text-gray-700">
                        {{ parseRecipients(selectedMail.recipients).map(r => r.email).join(', ') }}
                    </p>
                </div>

                <div class="grid gap-2">
                    <p class="text-xs uppercase tracking-wide text-gray-500">
                        Objet
                    </p>
                    <p class="text-lg font-semibold text-gray-900">
                        {{ selectedMail.object }}
                    </p>
                </div>

                <div class="grid gap-2">
                    <p class="text-xs uppercase tracking-wide text-gray-500">
                        Contenu
                    </p>
                    <div class="rounded-md border border-gray-100 bg-gray-50 p-4 text-gray-800 leading-relaxed whitespace-pre-line">
                        {{ selectedMail.content }}
                    </div>
                </div>

                <div
                    v-if="parseAttachments(selectedMail.attachement).length"
                    class="space-y-3"
                >
                    <p class="text-xs uppercase tracking-wide text-gray-500">
                        Pièces jointes
                    </p>
                    <div class="border border-gray-100 rounded-md divide-y overflow-hidden">
                        <div
                            v-for="(file, idx) in parseAttachments(selectedMail.attachement)"
                            :key="idx"
                            class="flex items-center p-3 hover:bg-gray-50"
                        >
                            <FileText class="w-5 h-5 text-gray-400 mr-3" />
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    {{ file.split('/').pop() }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    fichier
                                </p>
                            </div>
                            <a
                                :href="file"
                                target="_blank"
                                class="ml-2 inline-flex p-2 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                                title="Télécharger"
                            >
                                <Download class="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div class="text-xs text-gray-400">
                    Envoyé le {{ formatDate(selectedMail.created_at) }}
                </div>
            </div>

            <div
                v-else
                class="h-full grid place-items-center p-6 text-center text-gray-500"
            >
                <div>
                    <Inbox class="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>Sélectionnez un e-mail pour afficher son contenu.</p>
                </div>
            </div>
        </section>
    </div>

    <button
        title="Nouveau message"
        class="fixed bottom-6 right-10 z-40 h-12 w-12 rounded-md bg-primary text-white shadow-lg grid place-items-center"
        @click="showNewMailModal = !showNewMailModal"
    >
        <MailPlus class="w-5 h-5" />
    </button>

    <div
        v-if="showNewMailModal"
        class="fixed z-50 bottom-6 shadow-lg right-10 z-40 lg:right-10 w-[calc(100vw-2rem)] sm:w-[30rem] max-h-[78vh] overflow-y-auto"
    >
        <div class="bg-white p-6 rounded-md border border-gray-200 w-full shadow-2xl">
            <button
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
                @click="showNewMailModal = false"
            >
                <X class="h-5 w-5" />
            </button>
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <SendHorizontal class="w-5 h-5 text-primary" />
                Nouveau message
            </h3>

            <form @submit.prevent="submit">
                <div class="mb-4">
                    <label class="block text-sm">
                        A :
                    </label>
                    <UserAutocomplete v-model:recipients="newMail.recipients" />
                </div>

                <div class="mb-4">
                    <label class="block text-sm">
                        Objet :
                    </label>
                    <Input
                        v-model="newMail.object"
                        class="mt-1 rounded-md"
                    />
                </div>

                <div class="mb-4">
                    <label class="block text-sm">
                        Contenu :
                    </label>
                    <Textarea
                        v-model="newMail.content"
                        class="text-base w-full h-full resize-none rounded-md p-4 text-black placeholder:text-black/80 bg-transparent outline-none"
                    />
                </div>

                <div class="mb-4">
                    <input
                        ref="fileInput"
                        type="file"
                        multiple
                        class="hidden"
                        @change="handleFileSelection"
                    >
                    <button
                        type="button"
                        class="flex items-center gap-2 text-primary hover:text-primary/80 transition"
                        @click="fileInput?.click()"
                    >
                        <Paperclip class="w-5 h-5" />
                        <span>Joindre des fichiers</span>
                    </button>
                </div>

                <div
                    v-if="selectedFiles.length"
                    class="mb-4 flex flex-wrap gap-2"
                >
                    <div
                        v-for="(file, index) in selectedFiles"
                        :key="file.name + index"
                        class="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm"
                    >
                        📎 <span class="mx-1 truncate max-w-[200px]">{{ file.name }}</span>
                        <button
                            type="button"
                            class="text-red-500 hover:text-red-700"
                            @click="removeFile(index)"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div class="flex justify-end space-x-2">
                    <Button
                        type="button"
                        class="px-4 py-2 rounded-md border bg-white text-gray-600 hover:bg-gray-100"
                        @click="showNewMailModal = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        :in-progress="inProgress"
                    >
                        Envoyer
                    </Button>
                </div>
            </form>
        </div>
    </div>

    <div
        v-if="showMailDetailModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center lg:hidden"
    >
        <div class="bg-white p-6 rounded-md w-full max-w-xl relative mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <button
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
                @click="showMailDetailModal = false"
            >
                <X class="h-5 w-5" />
            </button>
            <h3 class="text-lg font-semibold mb-4">
                Détail du message
            </h3>

            <div
                v-if="selectedMail"
                class="space-y-4"
            >
                <div>
                    <span class="font-semibold text-gray-700">Destinataires :</span>
                    <span class="ml-2 text-gray-600">
                        {{ parseRecipients(selectedMail.recipients).map(r => r.email).join(', ') }}
                    </span>
                </div>

                <div class="py-2 border-b border-gray-200">
                    <span class="font-semibold text-gray-700">Objet :</span>
                    <span class="ml-2 font-medium text-gray-900">{{ selectedMail.object }}</span>
                </div>

                <div class="mt-2">
                    <span class="font-semibold text-gray-700">Contenu :</span>
                    <div class="mt-2 p-2 text-gray-800 leading-relaxed whitespace-pre-line">
                        {{ selectedMail.content }}
                    </div>
                </div>

                <div v-if="parseAttachments(selectedMail.attachement).length">
                    <span class="font-semibold text-gray-700">Pièces jointes :</span>

                    <div class="mt-4 border rounded-md divide-y">
                        <div
                            v-for="(file, idx) in parseAttachments(selectedMail.attachement)"
                            :key="idx"
                            class="flex items-center p-3 hover:bg-gray-50"
                        >
                            <FileText class="mr-3 h-5 w-5 text-gray-500" />

                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    {{ file.split('/').pop() }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    fichier
                                </p>
                            </div>

                            <a
                                :href="file"
                                target="_blank"
                                class="ml-2 p-2 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                                title="Télécharger"
                            >
                                <Download class="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div class="text-sm text-gray-400">
                    <span class="font-semibold">Date :</span> {{ formatDate(selectedMail.created_at) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Download, FileText, Inbox, MailPlus, Paperclip, SendHorizontal, X } from 'lucide-vue-next';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { useMail } from '@/composables/useMail';

const { mail, getMailSend, sendMail } = useMail();
await getMailSend();

const selectedMail = ref(null);
const { $toast } = useNuxtApp();

const showNewMailModal = ref(false);
const showMailDetailModal = ref(false);

function parseRecipients(recipients: string) {
    try {
        return JSON.parse(recipients);
    }
    catch {
        return [];
    }
}

function parseAttachments(attachement: string): string[] {
    const config = useRuntimeConfig();
    const baseUrl = config.public.API_URL;

    try {
        const files = JSON.parse(attachement);
        return files.map((filename: string) => `${baseUrl}/storage/${filename}`);
    }
    catch {
        return [];
    }
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const newMail = ref({
    object: '',
    recipients: '',
    content: '',
    file: null as File | null,
    files: null,
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

function handleFileSelection(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        selectedFiles.value = [...selectedFiles.value, ...Array.from(target.files)];
        newMail.value.files = selectedFiles.value;
        target.value = '';
    }
}

function removeFile(index: number) {
    selectedFiles.value.splice(index, 1);
    newMail.value.files = selectedFiles.value;
}

function selectMail(mailItem: any) {
    selectedMail.value = mailItem;
    if (window.innerWidth < 1024) {
        showMailDetailModal.value = true;
    }
}

const { submit, inProgress } = useSubmit(
    async function sendMailFront() {
        const formData = new FormData();
        formData.append('object', newMail.value.object);
        formData.append('content', newMail.value.content);

        if (Array.isArray(newMail.value.recipients)) {
            newMail.value.recipients.forEach((recipient, index) => {
                formData.append(`recipients[${index}][email]`, recipient.email);
                formData.append(`recipients[${index}][name]`, recipient.name ?? '');
                formData.append(`recipients[${index}][user_id]`, recipient.user_id ?? '');
            });
        }

        selectedFiles.value.forEach((file, index) => {
            formData.append(`attachement[${index}]`, file);
        });

        try {
            await sendMail(formData);

            await getMailSend();

            selectedMail.value = mail.value[mail.value.length - 1];

            showNewMailModal.value = false;

            newMail.value = {
                object: '',
                recipients: '',
                content: '',
                file: null,
                files: null,
            };
            selectedFiles.value = [];

            $toast({
                title: 'Succès !',
                description: 'Votre mail a bien été envoyé',
            });
        }
        catch (err) {
            if (err.data && err.data.errors) {
                const backendErrors = err.data.errors;
                const firstField = Object.keys(backendErrors)[0];
                const firstMessage = backendErrors[firstField][0];

                $toast({
                    description: firstMessage,
                    status: 'error',
                    variant: 'destructive',
                });
            }
        }
    },
);
</script>
