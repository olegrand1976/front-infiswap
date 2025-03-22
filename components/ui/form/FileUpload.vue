<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { DocumentIcon } from '@heroicons/vue/24/solid';

const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const errorMessage = ref<string>('');
const fileType = ref<string>('');
const { $toast } = useNuxtApp();
const emit = defineEmits<{
    (event: 'file-selected', file: File): void;
}>();

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0] || null;

    if (!selectedFile) {
        errorMessage.value = 'Aucun fichier sélectionné.';
        return;
    }

    if (
        ![
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(selectedFile.type)
    ) {
        errorMessage.value = 'Format de fichier non pris en charge.';
        $toast({
            variant: 'destructive',
            description: errorMessage.value,
        });

        return;
    }

    file.value = selectedFile;
    errorMessage.value = '';

    if (selectedFile.type.startsWith('image')) {
        previewUrl.value = URL.createObjectURL(selectedFile);
        fileType.value = 'image';
    }
    else if (selectedFile.type === 'application/pdf') {
        previewUrl.value = null;
        fileType.value = 'pdf';
    }
    else if (selectedFile.type.includes('excel')) {
        previewUrl.value = null;
        fileType.value = 'excel';
    }
    else if (selectedFile.type.includes('word')) {
        previewUrl.value = null;
        fileType.value = 'word';
    }
    else {
        previewUrl.value = null;
        fileType.value = '';
    }

    emit('file-selected', selectedFile);
};

const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
};
</script>

<template>
    <div class="w-full flex flex-col items-center relative">
        <Button
            class="absolute z-50 top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2"
            @click="triggerFileInput"
        >
            {{ file ? 'Changer le fichier' : 'Ajouter un fichier' }}
        </Button>

        <input
            id="fileInput"
            type="file"
            class="hidden"
            @change="handleFileChange"
        >

        <!-- Box for file preview -->
        <div class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
            <img
                v-if="fileType === 'image'"
                :src="previewUrl"
                alt="Aperçu"
                class="object-cover w-full h-full"
            >
            <p
                v-else-if="fileType !==null"
                class="text-gray-500 text-center px-2 flex gap-2 lg:gap-4 items-center"
            >
                <DocumentIcon class="size-10 lg:size-16"/>
                <span v-if="file">{{ file.name }}</span>
                <span v-show="errorMessage" class="text-red-500"> {{ errorMessage }} </span>
            </p>
            <p
                v-else
                class="text-gray-500 text-sm text-center px-2"
            >
                Aucun fichier sélectionné
            </p>
        </div>
    </div>
</template>
