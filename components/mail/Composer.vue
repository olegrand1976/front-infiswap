<template>
    <div class="flex h-screen bg-gray-100">
        <div class="w-[300px] bg-white border-r p-4 flex flex-col rounded-lg">
            <button
                @click="openModal"
                class="mb-4 bg-primary text-white py-2 rounded hover:bg-primary/90"
            >
                Nouveau message
            </button>

            <h2 class="font-semibold mb-2">
                Mails envoyés
            </h2>
            <ul class="flex-1 overflow-auto space-y-2">
                <li
                    v-for="mail in mails"
                    :key="mail.id"
                    @click="selectMail(mail)"
                    class="cursor-pointer p-2 rounded hover:bg-gray-100"
                    :class="{'bg-blue-100': selectedMail && mail.id === selectedMail.id}"
                >
                    <div class="font-semibold truncate">{{ mail.subject }}</div>
                    <div class="text-xs text-gray-600 truncate">{{ mail.to }}</div>
                </li>
            </ul>
        </div>

        <div class="ml-4 flex-1 bg-white p-6 overflow-auto rounded-lg">
            <template v-if="selectedMail">
                <h2 class="text-xl font-bold mb-4">Lecture du mail</h2>
                <p><strong>À :</strong> {{ selectedMail.to }}</p>
                <p><strong>Objet :</strong> {{ selectedMail.subject }}</p>
                <hr class="my-4" />
                <p class="whitespace-pre-wrap">{{ selectedMail.body }}</p>
            </template>
            <template v-else>
                <p class="text-gray-500 italic">Sélectionnez un mail à lire</p>
            </template>
        </div>

        <transition name="fade">
            <div
                v-if="isModalOpen"
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                <div class="bg-white rounded shadow-lg w-[500px] max-w-full p-6 relative">
                    <button
                        @click="closeModal"
                        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                    <h2 class="text-xl font-bold mb-4">Nouveau message</h2>
                    <form @submit.prevent="sendMail" class="flex flex-col gap-4">
                        <input
                            v-model="newMail.to"
                            placeholder="Destinataire"
                            class="border rounded p-2"
                            required
                            autocomplete="off"
                        />
                        <input
                            v-model="newMail.subject"
                            placeholder="Objet"
                            class="border rounded p-2"
                            required
                            autocomplete="off"
                        />
                        <textarea
                            v-model="newMail.body"
                            placeholder="Corps du message"
                            class="border rounded p-2 resize-none"
                            rows="6"
                            required
                        ></textarea>
                        <div>
                            <label class="block mb-1 font-medium">Pièces jointes</label>
                            <input type="file" multiple />
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button
                                type="button"
                                @click="closeModal"
                                class="py-2 px-4 rounded border hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                class="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
                            >
                                Envoyer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const mails = reactive([
    { id: 1, to: 'alice@example.com', subject: 'Réunion', body: 'Rendez-vous demain à 10h.' },
    { id: 2, to: 'bob@example.com', subject: 'Rapport', body: 'Merci pour le rapport.' },
    { id: 3, to: 'team@example.com', subject: 'Stand-up', body: 'Rappel de la réunion quotidienne.' },
]);

const selectedMail = ref(null);
const isModalOpen = ref(false);

const newMail = reactive({
    from: '',
    to: '',
    subject: '',
    body: '',
});

function selectMail(mail) {
    selectedMail.value = mail;
}

function openModal() {
    isModalOpen.value = true;
    newMail.from = '';
    newMail.to = '';
    newMail.subject = '';
    newMail.body = '';
}

function closeModal() {
    isModalOpen.value = false;
}

function sendMail() {
    if (!newMail.from || !newMail.to || !newMail.subject || !newMail.body) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    const id = Date.now();
    mails.unshift({ id, ...newMail });
    selectedMail.value = mails[0];
    closeModal();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
