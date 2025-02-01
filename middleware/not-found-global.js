import { defineNuxtRouteMiddleware, useRouter, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;

    // Vérifier si la page existe
    const routeExists = useRouter().resolve(to.fullPath).name;

    if (!routeExists) {
        return navigateTo('/404', { redirectCode: 302 });
    }
  });

