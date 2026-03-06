<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'vue-sonner';

const props = defineProps<{
	modelValue?: string | File | null;
	defaultFile?: string;
	label?: string;
	disabled?: boolean;
	class?: string;
	imageClass?: string;
	accept?: string;
	maxSize?: number;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isHovering = ref(false);
const error = ref<string | null>(null);

const ACCEPTED_TYPES = props.accept || "image/*";
const MAX_SIZE = props.maxSize || 5 * 1024 * 1024;

watch(() => props.modelValue, (newVal) => {
	error.value = null;
	if (typeof newVal === 'string') {
		previewUrl.value = newVal;
	} else if (newVal instanceof File) {
		if (newVal.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				previewUrl.value = e.target?.result as string;
			};
			reader.readAsDataURL(newVal);
		} else {
			previewUrl.value = null;
		}
	} else {
		previewUrl.value = props.defaultFile || null;
	}
}, { immediate: true });

const triggerFileInput = () => {
	if (props.disabled) return;
	fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (input.files && input.files[0]) {
		const file = input.files[0];
		
		if (file.size > MAX_SIZE) {
			error.value = `Le fichier est trop volumineux (max ${(MAX_SIZE / (1024 * 1024)).toFixed(0)}Mo)`;
			toast.error(error.value);
			return;
		}

		const acceptArray = ACCEPTED_TYPES.split(',').map(t => t.trim());
		const isAccepted = acceptArray.some(type => {
			if (type.endsWith('/*')) {
				return file.type.startsWith(type.replace('/*', '/'));
			}
			return file.type === type || file.name.endsWith(type);
		});

		if (!isAccepted) {
			error.value = "Type de fichier non autorisé";
			toast.error(error.value);
			return;
		}

		error.value = null;
		emit('update:modelValue', file);
		emit('change', file);
	}
};

const removeFile = (event: Event) => {
	event.stopPropagation();
	previewUrl.value = props.defaultFile || null;
	error.value = null;
	emit('update:modelValue', null);
	emit('change', null);
	if (fileInputRef.value) {
		fileInputRef.value.value = '';
	}
};

const isImage = computed(() => {
	if (props.modelValue instanceof File) {
		return props.modelValue.type.startsWith('image/');
	}
	if (typeof props.modelValue === 'string') {
		// Vérifier si c'est une data URL d'image
		if (props.modelValue.startsWith('data:image/')) {
			return true;
		}
		// Vérifier si l'URL contient une extension d'image (même avec des paramètres de requête)
		if (props.modelValue.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)(\?.*)?$/i) !== null) {
			return true;
		}
		// Vérifier si c'est une URL HTTP/HTTPS (on assume que c'est une image si c'est une URL valide)
		// et qu'elle contient des mots-clés d'image dans le chemin
		if ((props.modelValue.startsWith('http://') || props.modelValue.startsWith('https://')) &&
			(props.modelValue.includes('/storage/') || props.modelValue.includes('/images/') || props.modelValue.includes('/logos/'))) {
			return true;
		}
	}
	return false;
});

const fileName = computed(() => {
	if (props.modelValue instanceof File) {
		return props.modelValue.name;
	}
	if (typeof props.modelValue === 'string') {
		return props.modelValue.split('/').pop() || 'Fichier sélectionné';
	}
	return 'Fichier sélectionné';
});
</script>

<template>
	<div 
		:class="cn('relative group flex flex-col items-center justify-center w-full', props.class)"
		@mouseenter="isHovering = true"
		@mouseleave="isHovering = false"
	>
		<input
			ref="fileInputRef"
			type="file"
			:accept="ACCEPTED_TYPES"
			class="hidden"
			:disabled="props.disabled"
			@change="handleFileChange"
		>

		<div
			class="relative w-full h-48 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-all cursor-pointer"
			:class="[
				error ? 'border-destructive bg-destructive/5' : 'border-gray-300 group-hover:border-primary group-hover:bg-gray-50',
				{ 'border-solid border-primary bg-primary/5': props.modelValue && !error, 'opacity-50 cursor-not-allowed': props.disabled }
			]"
			@click="triggerFileInput"
		>
			<template v-if="props.modelValue && !error">
				<div v-if="isImage" class="w-full h-full flex items-center justify-center p-1">
					<img 
						:src="previewUrl" 
						alt="Preview" 
						:class="cn('w-full h-full object-contain bg-transparent transition-transform duration-300', props.imageClass)"
						@error="(e) => { console.error('Erreur de chargement de l\'image:', previewUrl); e.target.style.display = 'none'; }"
						@load="(e) => { e.target.style.display = 'block'; }"
					>
				</div>
				<div v-else class="text-center p-6">
					<Icon name="FileText" class="mx-auto h-16 w-16 text-primary" />
					<p class="text-sm text-gray-600 mt-2 font-medium truncate max-w-[200px]">
						{{ fileName }}
					</p>
				</div>
				
				<div 
					v-if="!props.disabled"
					class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
				>
					<UploadCloud class="w-10 h-10 text-white" />
				</div>
			</template>
			<template v-else>
				<div class="text-center p-6">
					<Icon 
						:name="error ? 'AlertCircle' : 'UploadCloud'" 
						:class="cn('mx-auto h-16 w-16', error ? 'text-destructive' : 'text-gray-300')" 
					/>
					<p :class="cn('text-sm mt-2 font-medium uppercase tracking-wider', error ? 'text-destructive' : 'text-gray-400')">
						{{ error || 'Cliquez pour ajouter un fichier' }}
					</p>
					<p v-if="!error" class="text-xs text-gray-400 mt-1">
						{{ ACCEPTED_TYPES.replace('image/*', 'Images').replace('application/pdf', 'PDF') }} jusqu'à {{ (MAX_SIZE / (1024 * 1024)).toFixed(0) }}Mo
					</p>
				</div>
			</template>
		</div>

		<div v-if="props.modelValue && !props.disabled" class="absolute top-2 right-2">
			<Button
				type="button"
				variant="destructive"
				size="icon"
				class="h-8 w-8 rounded-full shadow-md"
				@click="removeFile"
			>
				<Icon name="X" class="h-4 w-4" />
			</Button>
		</div>

		<label v-if="props.label" class="mt-2 text-sm font-medium text-gray-700">{{ props.label }}</label>
	</div>
</template>
