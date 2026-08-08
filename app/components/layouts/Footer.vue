<template>
    <footer class="bg-canvas-dark">
        <div class="container flex flex-col items-center gap-10 py-10 text-center md:flex-row md:items-start md:justify-between md:gap-8 md:py-14 md:text-start">
            <div class="flex flex-col items-center gap-4 md:items-start">
                <LayoutsLogo class="w-64" />
                <div class="flex flex-row gap-4 mt-2 ml-4 lg:ml-7">
                    <NuxtLink to="https://web.facebook.com/profile.php?viewas=100000686899395&id=61572833867576">
                        <LayoutsAppImage
                            src="icons/facebook.png"
                            title="Facebook"
                            class="w-5"
                        />
                    </NuxtLink>
                    <NuxtLink to="https://www.instagram.com/infiswapsoins/">
                        <LayoutsAppImage
                            src="icons/instagram.png"
                            title="Instagram"
                            class="w-5"
                        />
                    </NuxtLink>
                    <NuxtLink to="https://www.linkedin.com/company/infiswap-vos-soins-sans-interruption/?viewAsMember=true">
                        <LayoutsAppImage
                            src="icons/linkedin.png"
                            title="Linkedin"
                            class="w-5"
                        />
                    </NuxtLink>
                </div>
            </div>

            <div class="lg:ml-25 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
                <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-white">
                        {{ t('footer.navigation') }}
                    </h3>
                    <ul class="mt-4 flex flex-col gap-3">
                        <li
                            v-for="item in navigationLinks"
                            :key="item.route"
                        >
                            <NuxtLink
                                :to="localePath(item.route)"
                                class="text-sm text-on-canvas-dark hover:text-primary"
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-white">
                        {{ t('footer.legal') }}
                    </h3>
                    <ul class="mt-4 flex flex-col gap-3">
                        <li
                            v-for="item in legalLinks"
                            :key="item.label"
                        >
                            <NuxtLink
                                v-if="item.route"
                                :to="localePath(item.route)"
                                class="text-sm text-on-canvas-dark hover:text-primary"
                            >
                                {{ item.label }}
                            </NuxtLink>
                            <button
                                v-else
                                type="button"
                                class="text-sm text-on-canvas-dark hover:text-primary"
                                @click="openCookiePreferences"
                            >
                                {{ item.label }}
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-white">
                        {{ t('footer.partners') }}
                    </h3>
                    <div class="mt-4 flex flex-col items-center gap-3 md:items-start">
                        <div
                            class="cursor-pointer rounded-md p-2 transition hover:opacity-90"
                            @click="onPartnerClick('nurstech')"
                        >
                            <LayoutsNursTech class="w-20" />
                        </div>
                        <div
                            class="cursor-pointer rounded-md p-2 transition hover:opacity-90"
                            @click="onPartnerClick('nursassur')"
                        >
                            <LayoutsNursAssur class="w-20" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-white">
                        {{ t('footer.contact') }}
                    </h3>
                    <ul class="mt-4 flex flex-col gap-3">
                        <li>
                            <a
                                href="tel:0478023377"
                                class="flex items-center justify-center gap-2 text-sm text-on-canvas-dark hover:text-primary md:justify-start"
                            >
                                <Phone class="size-4 shrink-0 text-primary" />
                                0478.02.33.77
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:info@infiswap.be"
                                class="flex items-center justify-center gap-2 text-sm text-on-canvas-dark hover:text-primary md:justify-start"
                            >
                                <Mail class="size-4 shrink-0 text-primary" />
                                info@infiswap.be
                            </a>
                        </li>
                        <li>
                            <span class="flex items-center justify-center gap-2 text-sm text-on-canvas-muted md:justify-start">
                                <MapPin class="size-4 shrink-0 text-primary" />
                                Rue de la Résistance, 92/A 7131 WAUDREZ
                            </span>
                        </li>
                        <li>
                            <a
                                href="https://www.ll-it-sc.be"
                                target="_blank"
                                rel="noopener"
                                class="flex items-center justify-center gap-2 text-sm text-on-canvas-dark hover:text-primary md:justify-start"
                            >
                                <Globe class="size-4 shrink-0 text-primary" />
                                {{ t('contact.site') }}: ll-it-sc.be
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="border-t border-on-canvas-dark/10 bg-primary text-center text-white p-4 hover">
            <NuxtLink
                to="https://www.ll-it-sc.be"
                target="_blank"
                class="block md:text-xs"
            >
                © {{ currentYear }} InfiSwap — Site par LL-IT Software & Computer - Tous droits réservés
            </NuxtLink>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { Globe, Mail, MapPin, Phone } from 'lucide-vue-next';
import type { PartnerProduct } from '~/utils/partnerServices';

const { t } = useI18n();
const { openPreferences: openCookiePreferences } = useCookieConsent();
const localePath = useLocalePath();
const { trackPartnerCtaClick, registerPartnerClickFromProduct } = usePartnerServices();

const currentYear = new Date().getFullYear();

function onPartnerClick(product: PartnerProduct) {
    trackPartnerCtaClick(product, 'footer', 'discover', 'footer');
    registerPartnerClickFromProduct(product, 'footer', 'footer');
}

const navigationLinks = computed(() => [
    { label: t('nav.aboutNav'), route: '/about' },
    { label: t('nav.services'), route: '/services' },
    { label: t('nav.institutionOffer'), route: '/offre-institution' },
    { label: t('nav.career'), route: '/carriere' },
    { label: t('nav.pricingNav'), route: '/pricing' },
    { label: t('nav.contactNav'), route: '/contact' },
]);

const legalLinks = computed(() => [
    { label: t('footer.legalNotice'), route: '/legal-notice' },
    { label: t('footer.privacy'), route: '/privacy-security' },
    { label: t('footer.terms'), route: '/terms' },
    { label: t('footer.cookies'), route: null },
]);
</script>
