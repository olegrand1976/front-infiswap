<script setup lang="ts">
const props = defineProps<{
    replacementId: number | string;
    title?: string;
}>();

const { t } = useI18n();
const config = useRuntimeConfig();
const shareUrl = computed(() => {
    const base = config.public.FRONT_END_URL ?? '';
    return `${base}/dashboard/replacements/detail/${props.replacementId}`;
});

const shareText = computed(() => props.title ?? t('replacements.shareButtons.defaultShareText'));

async function shareNative() {
    if (!import.meta.client || !navigator.share) {
        return false;
    }

    try {
        await navigator.share({
            title: t('common.brand'),
            text: shareText.value,
            url: shareUrl.value,
        });
        useProductAnalytics().trackEvent('email_cta_clicked', { action: 'share_native' });
        return true;
    }
    catch {
        return false;
    }
}

function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText.value} ${shareUrl.value}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    useProductAnalytics().trackEvent('email_cta_clicked', { action: 'share_whatsapp' });
}

function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    useProductAnalytics().trackEvent('email_cta_clicked', { action: 'share_linkedin' });
}

async function handleShare() {
    const shared = await shareNative();
    if (!shared) {
        shareWhatsApp();
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <Button
            type="button"
            variant="outline"
            size="sm"
            @click="handleShare"
        >
            {{ t('replacements.shareButtons.partager') }}
        </Button>
        <Button
            type="button"
            variant="outline"
            size="sm"
            @click="shareWhatsApp"
        >
            WhatsApp
        </Button>
        <Button
            type="button"
            variant="outline"
            size="sm"
            @click="shareLinkedIn"
        >
            LinkedIn
        </Button>
    </div>
</template>
