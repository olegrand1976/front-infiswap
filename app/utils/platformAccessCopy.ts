export type PlatformAccessModalTrigger = 'create' | 'apply' | string;

export type PlatformAccessModalCopy = {
    title: string;
    lead: string;
    priceLabel: string;
};

/** Copy paywall contextuelle (titulaire vs remplacante). */
export function platformAccessModalCopy(trigger: PlatformAccessModalTrigger | null | undefined): PlatformAccessModalCopy {
    if (trigger === 'apply') {
        return {
            title: 'Un accès unique pour envoyer votre candidature',
            lead: 'Pour vous positionner sur ce remplacement, activez votre accès réseau.',
            priceLabel: 'Accès réseau — paiement unique, à vie',
        };
    }

    return {
        title: 'Un accès unique pour publier votre besoin',
        lead: 'Pour publier votre annonce sur le réseau, activez votre accès réseau.',
        priceLabel: 'Accès réseau — paiement unique, à vie',
    };
}

const ALLOWED_TRIGGERS = new Set([
    'create',
    'apply',
    'banner',
    'header',
    'settings',
    'onboarding_banner',
    'quest',
    'direct',
]);

/** Normalise le trigger analytics (query / API). */
export function sanitizePlatformAccessTrigger(trigger: unknown): string {
    if (typeof trigger === 'string' && ALLOWED_TRIGGERS.has(trigger)) {
        return trigger;
    }

    return 'direct';
}

export const PLATFORM_ACCESS_HINT_PUBLISH
    = 'Accès réseau — paiement unique 9,90 €, à vie — requis pour publier.';

export const PLATFORM_ACCESS_HINT_APPLY
    = 'Accès réseau — paiement unique 9,90 €, à vie — requis pour candidater.';
