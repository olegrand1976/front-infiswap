<template>
    <div
        class="flex items-center justify-center gap-1.5"
        :title="hint"
    >
        <span
            class="tabular-nums text-sm font-semibold text-gray-900 min-w-[1.25rem] text-center"
            aria-label="Total cette semaine"
        >
            {{ value }}
        </span>
        <Button
            type="button"
            size="sm"
            variant="outline"
            class="h-7 shrink-0 gap-1 px-2 text-xs border-primary/30 text-primary hover:bg-primary/5"
            :disabled="loading"
            :in-progress="loading"
            :aria-label="`Ajouter ${actionLabel}`"
            @click="emit('add')"
        >
            <Plus class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Ajouter</span>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import { Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

withDefaults(defineProps<{
    value: number;
    actionLabel: string;
    loading?: boolean;
    hint?: string;
}>(), {
    loading: false,
    hint: 'Total de la semaine en cours. Cliquez sur Ajouter pour enregistrer une action.',
});

const emit = defineEmits<{
    add: [];
}>();
</script>
