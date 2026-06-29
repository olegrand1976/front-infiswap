<template>
    <div
        class="flex flex-col items-center justify-center gap-1 py-0.5"
        :title="hint"
    >
        <span
            class="tabular-nums text-sm font-bold min-w-[1.5rem] text-center"
            :class="value > 0 ? 'text-gray-900' : 'text-gray-400'"
            aria-label="Total cette semaine"
        >
            {{ value }}
        </span>
        <span class="text-[10px] leading-none text-gray-500 hidden lg:block">
            sem.
        </span>
        <Button
            type="button"
            size="sm"
            variant="outline"
            class="h-7 shrink-0 gap-1 px-2 text-[11px] border-primary/30 text-primary hover:bg-primary/5"
            :disabled="loading"
            :in-progress="loading"
            :aria-label="`Ajouter ${actionLabel}`"
            @click="emit('add')"
        >
            <Plus class="w-3.5 h-3.5 shrink-0" />
            <span class="hidden xl:inline">Ajouter</span>
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
