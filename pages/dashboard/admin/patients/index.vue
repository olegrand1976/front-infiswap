<template>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius repudiandae qui pariatur voluptas adipisci expedita quisquam accusantium ad, laboriosam est, error eos nesciunt facere? Aspernatur voluptatum earum accusantium vel enim.</p>
</template>

<script setup lang="ts">
useHead({ title: 'Patients' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
