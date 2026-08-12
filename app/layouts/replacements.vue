<template>
    <div class="bg-background flex flex-col min-h-screen font-light text-foreground">
        <header class="bg-background z-50 h-20 flex items-center">
            <div class="container flex justify-between items-center w-full">
                <div class="shrink-0">
                    <LayoutsLogo class="h-10 lg:h-12" />
                </div>

                <nav class="hidden lg:flex items-center">
                    <ul class="flex gap-8 text-lg font-semibold tracking-wide">
                        <li
                            v-for="(item, index) in navigationItems"
                            :key="index"
                            class="relative group"
                        >
                            <NuxtLink
                                :to="item.route"
                                :class="[
                                    'transition-colors duration-200 py-2 block text-foreground/70',
                                    isActiveRoute(item.route) ? 'text-primary' : 'hover:text-primary',
                                ]"
                            >
                                {{ item.label }}
                            </NuxtLink>
                            <span
                                :class="[
                                    'absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-sm transition-all duration-200 transform scale-x-0 group-hover:scale-x-100',
                                    isActiveRoute(item.route) ? 'scale-x-100' : '',
                                ]"
                            />
                        </li>
                    </ul>
                </nav>

                <div class="flex items-center gap-3">
                    <Button
                        v-if="!isLoggedIn"
                        href="/register"
                        class="rounded-md font-bold text-sm gap-2"
                    >
                        <User class="w-4 h-4 shrink-0" />
                        S'inscrire
                    </Button>
                    <Button
                        v-else
                        href="/dashboard"
                        class="rounded-md font-bold text-sm"
                    >
                        Tableau de bord
                    </Button>
                    <LayoutsDropdownLang />
                </div>
            </div>
        </header>

        <main class="grow pt-20">
            <slot />
        </main>

        <footer class="bg-canvas-dark text-on-canvas-dark border-t border-border/10 pt-10 pb-8">
            <div class="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                <div class="space-y-4">
                    <div class="inline-block">
                        <LayoutsLogo class="h-10" />
                    </div>
                    <p class="text-xs font-light text-on-canvas-muted leading-relaxed">
                        InfiSwap connecte les professionnels de santé pour simplifier et sécuriser la gestion des remplacements de manière immédiate et transparente.
                    </p>
                    <div class="flex items-center gap-2 pt-1">
                        <NuxtLink
                            to="https://web.facebook.com/profile.php?viewas=100000686899395&id=61572833867576"
                            target="_blank"
                            class="w-8 h-8 rounded-md bg-surface border border-border/10 flex items-center justify-center text-on-canvas-dark hover:text-primary-foreground hover:bg-primary transition-all"
                        >
                            <Facebook class="w-3.5 h-3.5" />
                        </NuxtLink>
                        <NuxtLink
                            to="https://www.instagram.com/infiswapsoins/"
                            target="_blank"
                            class="w-8 h-8 rounded-md bg-surface border border-border/10 flex items-center justify-center text-on-canvas-dark hover:text-primary-foreground hover:bg-primary transition-all"
                        >
                            <Instagram class="w-3.5 h-3.5" />
                        </NuxtLink>
                        <NuxtLink
                            to="https://www.linkedin.com/company/infiswap-vos-soins-sans-interruption/?viewAsMember=true"
                            target="_blank"
                            class="w-8 h-8 rounded-md bg-surface border border-border/10 flex items-center justify-center text-on-canvas-dark hover:text-primary-foreground hover:bg-primary transition-all"
                        >
                            <Linkedin class="w-3.5 h-3.5" />
                        </NuxtLink>
                    </div>
                </div>

                <div class="space-y-3">
                    <h5 class="text-xs font-extrabold text-primary-foreground tracking-widest uppercase">
                        Navigation
                    </h5>
                    <ul class="space-y-2 text-sm font-light">
                        <li>
                            <NuxtLink
                                to="/"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Accueil</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/replacements"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Remplacements</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/contact"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Contact</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/offre-institution"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Offre Institution</NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="space-y-3">
                    <h5 class="text-xs font-extrabold text-primary-foreground tracking-widest uppercase">
                        Découvrir
                    </h5>
                    <ul class="space-y-2 text-sm font-light">
                        <li>
                            <NuxtLink
                                to="/about"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >A Propos</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/services"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Nos Services</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/carriere"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Carrière</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/pricing"
                                class="hover:text-primary transition-colors text-on-canvas-dark"
                            >Nos Tarifs</NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="space-y-3">
                    <h5 class="text-xs font-extrabold text-primary-foreground tracking-widest uppercase">
                        Contact
                    </h5>
                    <ul class="space-y-3 text-xs font-light text-on-canvas-muted">
                        <li class="flex items-center gap-2.5">
                            <Phone class="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>0478.02.33.77</span>
                        </li>
                        <li class="flex items-start gap-2.5">
                            <MapPin class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span class="leading-relaxed">Rue de la Résistance, 92/A<br>7131 WAUDREZ</span>
                        </li>
                        <li class="flex items-center gap-2.5">
                            <Mail class="w-3.5 h-3.5 text-primary shrink-0" />
                            <a
                                href="mailto:info@infiswap.be"
                                class="hover:text-on-canvas-dark transition-colors"
                            >info@infiswap.be</a>
                        </li>
                        <li class="flex items-center gap-2.5">
                            <Globe class="w-3.5 h-3.5 text-primary shrink-0" />
                            <a
                                href="https://www.infiswap.be"
                                target="_blank"
                                class="hover:text-on-canvas-dark transition-colors"
                            >www.infiswap.be</a>
                        </li>
                    </ul>
                </div>

                <div class="space-y-3">
                    <h5 class="text-xs font-extrabold text-primary-foreground tracking-widest uppercase">
                        Newsletter
                    </h5>
                    <p class="text-xs font-light text-on-canvas-muted leading-relaxed">
                        Inscrivez-vous pour recevoir nos communications.
                    </p>
                    <form
                        class="flex flex-col gap-2"
                        @submit.prevent="subscribeNewsletter"
                    >
                        <div class="relative flex items-center">
                            <Mail class="absolute left-3 w-3.5 h-3.5 text-on-surface-subtle pointer-events-none" />
                            <Input
                                v-model="email"
                                type="email"
                                placeholder="Votre email"
                                class="pl-9 bg-surface border-border/30 text-on-canvas-dark placeholder:text-on-canvas-muted focus-visible:border-primary rounded-md text-xs"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            :disabled="isLoading"
                            class="rounded-md text-xs font-bold w-full"
                        >
                            {{ isLoading ? 'Envoi...' : "S'enregistrer" }}
                        </Button>
                    </form>
                </div>
            </div>

            <div class="border-t border-border/10 pt-8 text-center text-xs text-on-canvas-muted">
                <div class="flex flex-wrap justify-center gap-4 mb-3">
                    <NuxtLink
                        to="/legal-notice"
                        class="hover:text-on-canvas-dark transition-colors"
                    >Mentions légales</NuxtLink>
                    <span>·</span>
                    <NuxtLink
                        to="/privacy-security"
                        class="hover:text-on-canvas-dark transition-colors"
                    >Politique de Protection des données</NuxtLink>
                    <span>·</span>
                    <NuxtLink
                        to="/terms"
                        class="hover:text-on-canvas-dark transition-colors"
                    >CGU</NuxtLink>
                </div>
                <a
                    href="https://www.ll-it-sc.be"
                    target="_blank"
                    class="hover:text-on-canvas-dark transition-colors"
                >
                    @2025 LL-IT Software & Computer - Tous droits réservés
                </a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
    Phone,
    MapPin,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Linkedin,
    User,
} from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
import { useNewsletter } from '~/composables/useNewsletter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const { isLoggedIn } = useAuth();
const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;
const { email, isLoading, subscribeNewsletter } = useNewsletter();

const navigationItems = [
    { label: 'Accueil', route: '/' },
    { label: 'Remplacements', route: '/replacements' },
    { label: 'Contact', route: '/contact' },
    { label: 'Offre Institution', route: '/offre-institution' },
    { label: 'Comment ça marche ?', route: '#' },
];
</script>
