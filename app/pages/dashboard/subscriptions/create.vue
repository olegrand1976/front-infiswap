<script setup lang="ts">
definePageMeta({
    middleware: [
        defineNuxtRouteMiddleware(() => navigateTo('/acces-plan', { replace: true })),
    ],
});
</script>
