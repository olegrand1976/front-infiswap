<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    {{ title }}
                </DialogTitle>
                <DialogDescription class="text-sm text-gray-600">
                    {{ typeLabel }}
                </DialogDescription>
            </DialogHeader>

            <div class="mt-4 min-h-0 flex-1 overflow-y-auto">
                <p
                    v-if="loading"
                    class="text-sm text-gray-500"
                    aria-busy="true"
                >
                    Chargement…
                </p>
                <p
                    v-else-if="error"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ error }}
                </p>
                <p
                    v-else-if="items.length === 0"
                    class="text-sm text-gray-500"
                >
                    Aucun résultat pour ce code postal.
                </p>
                <ul
                    v-else
                    class="divide-y divide-gray-100 border border-gray-100 rounded-md"
                >
                    <li
                        v-for="item in items"
                        :key="item.id"
                        class="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                                {{ item.label }}
                            </p>
                            <p
                                v-if="item.subtitle"
                                class="text-xs text-gray-500 truncate"
                            >
                                {{ item.subtitle }}
                            </p>
                        </div>
                        <NuxtLink
                            :to="item.href"
                            class="shrink-0 text-sm font-medium text-primary hover:underline"
                            @click="emit('update:open', false)"
                        >
                            Voir la fiche
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <DialogFooter class="mt-4">
                <Button
                    type="button"
                    variant="ghost"
                    @click="emit('update:open', false)"
                >
                    Fermer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import type {
    NursesMapPointType,
    NursesMapZipInstitutionItem,
    NursesMapZipNurseItem,
} from '@/composables/useNursesMap';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ListRow = {
    id: number;
    label: string;
    subtitle?: string;
    href: string;
};

const props = defineProps<{
    open: boolean;
    zip: string;
    city: string;
    type: NursesMapPointType;
    loading: boolean;
    error: string | null;
    nurseItems: NursesMapZipNurseItem[];
    institutionItems: NursesMapZipInstitutionItem[];
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const title = computed(() => {
    const city = props.city.trim();
    return city ? `${props.zip} — ${city}` : props.zip;
});

const typeLabel = computed(() => {
    switch (props.type) {
        case 'institutions':
            return 'Prospects institutions';
        case 'nurses':
            return 'Soignants';
        default: {
            const _exhaustive: never = props.type;
            return _exhaustive;
        }
    }
});

const items = computed((): ListRow[] => {
    switch (props.type) {
        case 'institutions':
            return props.institutionItems.map((item) => ({
                id: item.id,
                label: item.name,
                href: `/dashboard/admin/institutions/${item.id}/show`,
            }));
        case 'nurses':
            return props.nurseItems.map((item) => ({
                id: item.id,
                label: `${item.firstname} ${item.lastname}`.trim(),
                subtitle: item.email ?? undefined,
                href: `/dashboard/admin/users/${item.id}`,
            }));
        default: {
            const _exhaustive: never = props.type;
            return _exhaustive;
        }
    }
});
</script>
