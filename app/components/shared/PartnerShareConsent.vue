<template>
    <label class="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
        <input
            :checked="modelValue"
            type="checkbox"
            class="mt-0.5 accent-primary shrink-0"
            required
            @change="onChange"
        >
        <span>
            {{ PARTNER_SHARE_CONSENT_LABEL }}
            <span v-if="partnerName">
                Destinataire : <strong>{{ partnerName }}</strong>.
            </span>
            Voir la
            <NuxtLink
                to="/privacy-security"
                class="text-primary underline"
                target="_blank"
            >
                politique de confidentialité
            </NuxtLink>.
        </span>
    </label>
</template>

<script setup lang="ts">
import { PARTNER_SHARE_CONSENT_LABEL } from '~/utils/partnerConsent';

defineProps<{
    modelValue: boolean;
    partnerName?: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
}>();

function onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
}
</script>
