<template>
    <!-- ═══ DESKTOP ══════════════════════════════════════════════════════════ -->
    <TableRow :class="['overflow-x-hidden gap-2 grid rounded-t-lg border-none', gridClass]">
        <TableHead v-if="type === ''" :class="headerClass">{{ col1Label }}</TableHead>
        <TableHead v-if="type === ''" :class="headerClass">{{ col2Label }}</TableHead>
        <TableHead :class="headerClass">Dates</TableHead>
        <TableHead :class="[headerClass, 'grid grid-cols-3']">
            <div class="text-center">Matin</div>
            <div class="text-center">Midi</div>
            <div class="text-center">Soir</div>
        </TableHead>
        <TableHead :class="headerClass">Codes postaux</TableHead>
        <TableHead :class="headerClass">Ville(s)</TableHead>
        <TableHead :class="headerClass">{{ col7Label }}</TableHead>
        <TableHead v-if="type === 'groups'" :class="headerClass">{{ col8Label }}</TableHead>
        <TableHead v-if="type === 'groups'" :class="headerClass">{{ col9Label }}</TableHead>
        <TableHead v-if="type === ''" :class="headerClass">Catégorie</TableHead>
        <TableHead v-if="type === ''" :class="headerClass">Institution</TableHead>
        <TableHead :class="headerClass">Action</TableHead>
    </TableRow>
</template>

<script lang="ts" setup>
const props = defineProps<{
    type?: string;
    gridClass?: string;
    variant?: 'replacement' | 'mission'; // primary vs blue-600
}>();

const headerClass = computed(() =>
    `w-full flex justify-center items-center text-white text-xs ${
        props.variant === 'mission' ? 'bg-blue-600' : 'bg-primary'
    }`
);

// Labels qui changent selon replacement vs mission
const col1Label = computed(() => props.variant === 'mission' ? 'Institution' : 'Nom complet');
const col2Label = computed(() => props.variant === 'mission' ? '—' : 'Téléphone');
const col7Label = computed(() => props.variant === 'mission' ? 'Diplôme requis' : 'Types de soins');
const col8Label = computed(() => props.variant === 'mission' ? '—' : 'Créateur');
const col9Label = computed(() => props.variant === 'mission' ? '—' : 'Groupe');
</script>