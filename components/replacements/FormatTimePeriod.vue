<template>
    <div class="flex flex-col items-center text-sm">
        <template v-if="slots.length > 0">
            <div class="flex gap-2 justify-center items-center">
                <span>{{ formatTime(slots[0].start_at) }}</span> -
                <span>{{ formatTime(slots[0].end_at) }}</span>
            </div>
            <div
                v-if="slots.length > 1"
                class="mt-1 text-xs text-primary font-semibold cursor-pointer"
                @click="dialogOpen = true"
            >
                Voir tout
            </div>
        </template>
        <template v-else>
            <span>-</span>
        </template>

        <Dialog v-model:open="dialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle class="text-base font-semibold text-primary">
                        Détails des horaires
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-3 grid grid-cols-2 text-sm font-semibold text-gray-700">
                    <span>Début</span><span>Fin</span>
                </div>
                <div
                    v-for="(slot, index) in slots"
                    :key="index"
                    class="grid grid-cols-2 mt-1 text-sm"
                >
                    <span v-show="slot.start_at">{{ formatTime(slot.start_at) }}</span>
                    <span v-show="slot.end_at">{{ formatTime(slot.end_at) }}</span>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    replacement: any;
}>();

const dialogOpen = ref(false);

const slots = computed(() => {
    const rep = props.replacement;
    const result: { start_at: string; end_at: string }[] = [];

    try {
        let ts = rep.timeSlot;
        if (typeof ts === 'string') ts = JSON.parse(ts);

        if (ts?.start_at && ts?.end_at) {
            result.push(ts);
        }
        else {
            if (ts?.morning) result.push(ts.morning);
            if (ts?.evening) result.push(ts.evening);
        }
    }
    catch (e) {
        console.warn('Erreur parsing timeSlot:', e);
    }

    if (result.length === 0 && Array.isArray(rep.details) && rep.details.length > 0) {
        const d = rep.details[0];
        if (d.start_at && d.end_at) {
            result.push({ start_at: d.start_at, end_at: d.end_at });
        }
    }

    return result;
});

const formatTime = (time: string) => time?.slice(0, 5) || '-';
</script>
