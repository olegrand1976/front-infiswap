<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

await navigateTo('/dashboard/admin/institution-crm-settings?tab=periods', { replace: true });
</script>
