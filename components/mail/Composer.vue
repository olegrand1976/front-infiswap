<template>
    <div class="min-h-screen flex flex-col lg:flex-row p-1 space-y-4 lg:space-y-0 lg:space-x-4">
        <div class="md:w-1/3 w-full bg-white rounded-lg shadow flex flex-col">
            <div class="flex items-center justify-between bg-primary rounded-t-lg py-3 px-4">
                <h2 class="font-semibold text-white text-center flex-1">
                    Historique des e-mails envoyés
                </h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-8rem)]">
                <div class="fixed top-46 left-0 right-0 z-50 px-4 lg:hidden">
                    <div class="flex justify-center">
                        <button
                            title="Nouveau message"
                            @click="showModal = true"
                            class="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg shadow-md animate-bounce"
                        >
                            Nouveau message
                        </button>
                    </div>
                </div>
                <div
                    v-if="!mail"
                >
                    <div class="text-center text-gray-500 italic mt-8">
                        Vos mails seront affichés ici.
                    </div>
                </div>
                <div
                    v-else
                >
                    <div
                        v-for="mailItem in mail"
                        :key="mailItem.id"
                        class="relative border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer mb-2"
                        @click="selectedMail = mailItem"
                    >
                        <div class="text-sm text-gray-500 mb-1 truncate" :title="'À : ' + parseRecipients(mailItem.recipients).map(r => r.email).join(', ')">
                            À :
                            <span
                                v-for="(recipient, idx) in parseRecipients(mailItem.recipients)"
                                :key="idx"
                                class="font-medium text-gray-700"
                            >
                                {{ recipient.email }}<span v-if="idx < parseRecipients(mailItem.recipients).length - 1">, </span>
                            </span>
                        </div>

                        <div class="text-base font-medium mb-1 mt-1">
                            Objet : {{ mailItem.object }}
                        </div>

                        <div class="text-gray-600 text-sm mb-6 truncate">
                            {{ mailItem.content }}
                        </div>

                        <div class="absolute bottom-2 right-4 text-xs text-gray-400">
                            {{ formatDate(mailItem.created_at) }}
                        </div>
                    </div>
                </div>
                <div class="sticky hidden lg:block bottom-6 pt-4">
                    <div class="flex justify-center mb-2 px-4">
                        <button
                            title="Nouveau message"
                            @click="showModal = true"
                            class="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg shadow-md animate-bounce"
                        >
                            Nouveau message
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="md:w-2/3 w-full bg-white rounded-lg shadow flex flex-col">
            <h2 class="font-semibold bg-primary text-white text-center py-3 rounded-t-lg">
                Détail du message
            </h2>

            <div class="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-8rem)]" v-if="selectedMail">
                <div class="space-y-3">
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
                </div>

                <div v-if="parseAttachments(selectedMail.attachement).length">
                    <span class="font-semibold text-gray-700">Pièces jointes :</span>

                    <div class="mt-4 border rounded-lg divide-y">
                        <div v-for="(file, idx) in parseAttachments(selectedMail.attachement)" :key="idx" class="flex items-center p-3 hover:bg-gray-50">
                            <div class="mr-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    {{ file.split('/').pop() }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    fichier
                                </p>
                            </div>

                            <a :href="file" target="_blank" class="ml-2 p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-800" title="Télécharger">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="text-sm text-gray-400">
                    <span class="font-semibold">Date :</span> {{ formatDate(selectedMail.created_at) }}
                </div>
            </div>

            <div class="p-6 text-gray-500 italic" v-else>
                Cliquez sur un e-mail à gauche pour voir les détails.
            </div>
        </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-xl relative">
            <button
                @click="showModal = false"
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
            >
                <XMarkIcon class="h-5 w-5" />
            </button>
            <h3 class="text-lg font-semibold mb-4">
                Nouveau message
            </h3>

            <form @submit.prevent="submit">
                <label class="block mb-2">
                    Destinataires :
                    <UserAutocomplete v-model:recipients="newMail.recipients" />
                </label>

                <label class="block mb-2">
                    Objet :
                    <InputIcon
                        v-model="newMail.object"
                        class="mt-1"
                    />
                </label>

                <label class="block mb-2">
                    Contenu :
                    <div class="h-40 rounded-3xl border-2 border-gray-300">
                        <Textarea
                            v-model="newMail.content"
                            class="text-base w-full h-full resize-none rounded-xl p-4 text-black placeholder:text-black/80 bg-transparent outline-none"
                        />
                    </div>
                </label>

                <div class="mb-4">
                    <input
                        ref="fileInput"
                        type="file"
                        multiple
                        @change="handleFileSelection"
                        class="hidden"
                    />
                    <button
                        type="button"
                        @click="fileInput?.click()"
                        class="flex items-center gap-2 text-primary hover:underline"
                    >
                        <PaperClipIcon class="w-5 h-5" />
                        <span>Joindre des fichiers</span>
                    </button>
                </div>

                <div v-if="selectedFiles.length" class="mb-4 flex flex-wrap gap-2">
                    <div v-for="(file, index) in selectedFiles" :key="file.name + index" class="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        📎 <span class="mx-1 truncate max-w-[200px]">{{ file.name }}</span>
                        <button
                            type="button"
                            @click="removeFile(index)"
                            class="text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div class="flex justify-end space-x-2">
                    <button type="button" @click="showModal = false" class="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100">
                        Annuler
                    </button>
                    <Button
                        type="submit"
                        class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                        :in-progress="inProgress"
                    >
                        Envoyer
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon, PaperClipIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import { useMail } from '@/composables/useMail';

const { mail, getMailSend, sendMail } = useMail();
await getMailSend();

const selectedMail = ref(null);
const { $toast } = useNuxtApp();

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

const showModal = ref(false);

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

            showModal.value = false;

            newMail.value = {
                object: '',
                recipients: '',
                content: '',
                file: null,
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
