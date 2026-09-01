<script setup lang="ts">
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface ReplacementsFilters {
    topReplacements: boolean;
    days: string[];
    province: string;
    showReplacements: boolean;
    showMissions: boolean;
    zipCode: string;
    city: string;
}

defineProps<{
    days: string[];
}>();

const emit = defineEmits<{
    'toggle-day': [day: string, checked: boolean];
    'reset': [];
}>();

const filters = defineModel<ReplacementsFilters>('filters', { required: true });
</script>

<template>
    <div>
        <label class="flex items-center justify-between mb-5 p-3 rounded-md cursor-pointer">
            <span class="text-sm font-medium text-primary-foreground">Top remplacements</span>
            <Switch
                id="top-replacements"
                :checked="filters.topReplacements"
                @update:checked="filters.topReplacements = $event"
            />
        </label>

        <div class="mb-5">
            <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                Codes postaux
            </p>
            <Input
                v-model="filters.zipCode"
                placeholder="Ajouter un code postal"
                class="rounded-md text-sm bg-surface"
            />
        </div>

        <div class="mb-5">
            <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                Ville(s)
            </p>
            <Input
                v-model="filters.city"
                placeholder="Ajouter une ville"
                class="rounded-md text-sm bg-surface"
            />
        </div>

        <div class="mb-5">
            <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
                Jours
            </p>
            <div class="grid grid-cols-2 gap-1.5">
                <label
                    v-for="day in days"
                    :key="day"
                    class="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-primary-foreground/10 select-none transition-colors text-xs font-medium text-primary-foreground"
                >
                    <Checkbox
                        :checked="filters.days.includes(day)"
                        class="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                        @update:checked="(v) => emit('toggle-day', day, v === true)"
                    />
                    {{ day }}
                </label>
            </div>
        </div>

        <div class="mb-5">
            <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                Province
            </p>
            <Select v-model="filters.province">
                <SelectTrigger class="rounded-md w-full text-sm bg-surface">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent class="rounded-md">
                    <SelectItem value="Brabant wallon">
                        Brabant wallon
                    </SelectItem>
                    <SelectItem value="Bruxelles-Capitale">
                        Bruxelles-Capitale
                    </SelectItem>
                    <SelectItem value="Liège">
                        Liège
                    </SelectItem>
                    <SelectItem value="Hainaut">
                        Hainaut
                    </SelectItem>
                    <SelectItem value="Namur">
                        Namur
                    </SelectItem>
                    <SelectItem value="Luxembourg">
                        Luxembourg
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="mb-6">
            <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                Types
            </p>
            <label class="flex items-center justify-between mb-2 p-3 rounded-md cursor-pointer">
                <span class="text-sm font-medium text-primary-foreground">Remplacements</span>
                <Switch
                    :checked="filters.showReplacements"
                    @update:checked="filters.showReplacements = $event"
                />
            </label>
            <label class="flex items-center justify-between p-3 rounded-md cursor-pointer">
                <span class="text-sm font-medium text-primary-foreground">Missions</span>
                <Switch
                    :checked="filters.showMissions"
                    @update:checked="filters.showMissions = $event"
                />
            </label>
        </div>

        <div class="flex gap-2">
            <Button
                variant="outline"
                class="flex-1 rounded-md text-xs font-semibold border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                type="button"
                @click="emit('reset')"
            >
                Réinitialiser
            </Button>
        </div>
    </div>
</template>
