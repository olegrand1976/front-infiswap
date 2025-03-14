<template>
    <div class="h-[83vh] mt-2">
        <div class="h-full grid grid-cols-[35%_63%] gap-4">
            <div class="bg-gray-100">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="flex justify-between">
                        <span class="text-lg text-primary font-semibold">
                            Messages
                        </span>
                        <Cog6ToothIcon class="w-6 cursor-pointer" />
                    </h2>
                </div>

                <div class="overflow-y-auto h-[65vh] custom-scrollbar">
                    <div
                        v-for="user in users"
                        :key="user.id"
                        :class="['mx-6 my-3 rounded-lg p-4 cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors',
                                 selectedUser?.id === user.id ? 'bg-white border-r-4 border-l-4 border-primary' : '']"
                        @click="selectUser(user)"
                    >
                        <div class="flex justify-between items-center space-x-4">
                            <div class="flex items-center space-x-3">
                                <div class="relative">
                                    <img
                                        :src="user.avatar"
                                        alt=""
                                        class="w-12 h-12 rounded-full"
                                    >
                                    <div
                                        :class="['absolute top-0 left-0 w-3 h-3 rounded-full border-2 border-white',
                                                 user.online ? 'bg-success' : 'bg-gray-400']"
                                    />
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-medium text-primary">
                                        {{ user.name }}
                                    </h3>
                                    <p class="text-sm font-light text-gray-500 truncate">
                                        {{ user.lastMessage }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex flex-col space-y-2 text-end text-sm text-black/50">
                                <p class="font-semibold">
                                    {{ user.date }}
                                </p>
                                <p>
                                    {{ user.hour }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    class="flex justify-end ml-auto mr-6 items-center"
                    @click="handleOpenChange"
                >
                    <PencilSquareIcon class="w-4" />
                    <span>Nouveau</span>
                </Button>
                <CommandDialog
                    :open="isOpenCommand"
                    @update:open="handleOpenChange"
                >
                    <CommandInput placeholder="Rechercher une personne..." />
                    <CommandList class="p-2">
                        <CommandEmpty>
                            Aucun résultat trouvé
                        </CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <div
                                v-for="suggestedUser in suggestedUsers"
                                :key="suggestedUser.id"
                                class="flex items-center p-2 cursor-pointer space-x-2 w-full hover:bg-gray-100 transition-colors"
                                @click="selectUserInDialog(suggestedUser)"
                            >
                                <CommandItem :value="suggestedUser.name">
                                    <div class="relative">
                                        <template v-if="suggestedUser.avatar">
                                            <NuxtImg
                                                :src="suggestedUser.avatar"
                                                class="w-12 h-12 rounded-full"
                                            />
                                        </template>
                                        <template v-else>
                                            <NuxtImg
                                                src="/icons/user-circle.png"
                                                class="w-12 h-12 rounded-full opacity-60"
                                            />
                                        </template>
                                        <div
                                            :class="['absolute top-0 left-0 w-3 h-3 rounded-full border-2 border-white',
                                                     suggestedUser.online ? 'bg-success' : 'bg-gray-400']"
                                        />
                                    </div>
                                    {{ suggestedUser.name }}
                                </CommandItem>
                            </div>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>

            <div class="bg-gray-100 overflow-hidden flex-1 flex flex-col">
                <div
                    v-if="selectedUser"
                    class="p-4 bg-white shadow flex justify-between items-center"
                >
                    <div class="flex space-x-3 items-center">
                        <template v-if="selectedUser.avatar">
                            <img
                                :src="selectedUser.avatar"
                                class="w-10 h-10 rounded-full"
                            >
                        </template>
                        <template v-else>
                            <UserCircleIcon class="w-10 h-10 text-black/50" />
                        </template>
                        <div>
                            <h2 class="font-medium text-primary">
                                {{ selectedUser.name }}
                            </h2>
                            <template v-if="selectedUser.online">
                                <p class="text-sm font-medium text-success">
                                    En ligne
                                </p>
                            </template>
                            <template v-else>
                                <p class="text-sm text-gray-500">
                                    Non connecté
                                </p>
                            </template>
                        </div>
                    </div>

                    <div>
                        <EllipsisVerticalIcon
                            class="w-8 h-8 cursor-pointer"
                            title="Options"
                        />
                    </div>
                </div>

                <div
                    v-if="selectedUser"
                    ref="messagesContainer"
                    class="flex-1 text-sm overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                    <div
                        v-for="message in userMessages[selectedUser.id]"
                        :key="message.id"
                        :class="['flex items-start space-x-3', message.sender === 'me' ? 'justify-end' : 'justify-start']"
                    >
                        <template v-if="message.sender !== 'me'">
                            <template v-if="selectedUser.avatar">
                                <img
                                    :src="selectedUser.avatar"
                                    class="w-8 h-8 rounded-full"
                                >
                            </template>
                            <template v-else>
                                <UserCircleIcon class="w-8 text-black/50" />
                            </template>
                        </template>
                        <div
                            :class="['max-w-[70%] rounded-lg p-3',
                                     message.sender === 'me'
                                         ? 'bg-blue-500 text-white rounded-br-none'
                                         : 'bg-gray-200 text-gray-900 rounded-bl-none']"
                        >
                            {{ message.text }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="selectedUser"
                    class="p-4 border-t shadow-lg text-sm border-gray-200 bg-white"
                >
                    <div class="flex items-center space-x-4">
                        <Collapsible
                            v-model:open="isOpen"
                            class="relative"
                        >
                            <CollapsibleTrigger>
                                <PlusCircleIcon class="w-6 text-black/40 cursor-pointer" />
                            </CollapsibleTrigger>
                            <CollapsibleContent class="bg-white absolute p-2 rounded-lg -top-24 shadow w-44">
                                <p class="flex space-x-2 items-center cursor-pointer text-black/40 text-xs">
                                    <DocumentPlusIcon class="w-6" />
                                    <span>
                                        Charger un fichier
                                    </span>
                                </p>
                                <p class="flex space-x-2 items-center cursor-pointer text-black/40 text-xs mt-3">
                                    <CameraIcon class="w-6" />
                                    <span>
                                        Prendre une photo
                                    </span>
                                </p>
                            </CollapsibleContent>
                        </Collapsible>

                        <textarea
                            v-model="newMessage"
                            placeholder="Votre message..."
                            class="w-full px-4 pt-2 rounded border border-gray-300 focus:outline-none focus:border-primary"
                            @keyup.enter="sendMessage"
                        />

                        <div class="flex space-x-3">
                            <FaceSmileIcon class="w-6 text-black/40 cursor-pointer" />
                            <PaperAirplaneIcon
                                class="w-6 text-black/40 cursor-pointer hover:text-primary"
                                @click="sendMessage"
                            />
                        </div>
                    </div>
                </div>

                <div
                    v-if="!selectedUser"
                    class="flex-1 flex items-center justify-center"
                >
                    <p class="text-gray-500">
                        Sélectionnez une conversation pour commencer à envoyer des messages
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    EllipsisVerticalIcon,
    UserCircleIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    Cog6ToothIcon,
    CameraIcon,
    DocumentPlusIcon,
} from '@heroicons/vue/24/solid';
import { PlusCircleIcon } from '@heroicons/vue/24/outline';

import { CommandDialog, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

const users = ref([
    {
        id: 1,
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        online: true,
        lastMessage: 'Hey, how are you?',
        date: 'Hier',
        hour: '13:20',
    },
    {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        online: false,
        lastMessage: 'See you tomorrow!',
        date: 'Lun.',
        hour: '04:01',
    },
    {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        online: true,
        lastMessage: 'The meeting is at 3 PM',
        date: '06/03',
        hour: '12:18',
    },
]);

const userMessages = ref({
    1: [
        { id: 1, text: 'Hey there!', sender: 'other' },
        { id: 2, text: 'Hi! How are you?', sender: 'me' },
    ],
    2: [
        { id: 1, text: 'See you tomorrow!', sender: 'other' },
    ],
    3: [
        { id: 1, text: 'The meeting is at 3 PM', sender: 'other' },
        { id: 2, text: 'Sounds good!', sender: 'me' },
    ],
});

const suggestedUsers = ref([
    {
        id: 1,
        name: 'Emily Davis',
        avatar: '',
        online: true,
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        online: true,
    },
    {
        id: 3,
        name: 'Michael Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        online: false,
    },
]);

const selectedUser = ref(null);
const newMessage = ref('');

const selectUser = (user) => {
    selectedUser.value = user;
};

const sendMessage = () => {
    if (!newMessage.value.trim() || !selectedUser.value) return;

    const userId = selectedUser.value.id;
    if (!userMessages.value[userId]) {
        userMessages.value[userId] = [];
    }

    userMessages.value[userId].push({
        id: userMessages.value[userId].length + 1,
        text: newMessage.value,
        sender: 'me',
    });

    newMessage.value = '';
};

const isOpenCommand = ref(false);

const handleOpenChange = () => {
    isOpenCommand.value = !isOpenCommand.value;
};

const isOpen = ref(false);

const selectedUserInDialog = ref(null);

const selectUserInDialog = (user) => {
    selectedUserInDialog.value = user;
    selectUser(user);
    handleOpenChange();
};

const messagesContainer = ref(null);

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

watch(() => userMessages.value[selectedUser.value?.id], () => {
    nextTick(scrollToBottom);
});

watch(selectedUser, () => {
    nextTick(scrollToBottom);
});

useHead({
    title: 'Messagerie',
});

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
});
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 3px solid transparent;
    background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
