import { $fetch } from "ofetch";
import { parseCookies } from "h3";
import { AUTH_TOKEN } from "~/lib/constants";
import {
  useCookie,
  useRuntimeConfig,
  useNuxtApp,
  useRequestEvent,
  useRequestHeaders,
  defineNuxtPlugin,
} from "#app";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $csrf } = useNuxtApp(); // Si nécessaire, vérifie la définition de $csrf
  const { API_URL, FRONT_END_URL } = useRuntimeConfig().public;

  const apifetch = $fetch.create({
    credentials: "include",
    baseURL: API_URL,
    async onRequest({ request, options }) {
      const event = typeof useEvent === "function" ? useRequestEvent() : null;
      // Récupérer le CSRF Token depuis les cookies ou autre source appropriée
      let token = event
        ? parseCookies(event)[CSRF_COOKIE] // Récupération depuis les cookies si l'événement est défini
        : useCookie(CSRF_COOKIE).value; // Sinon, utiliser le cookie côté client

      if (
        import.meta.client &&
        ["post", "delete", "put", "patch"].includes(
          options?.method?.toLowerCase() ?? "",
        )
      ) {
        // Si $csrf est censé être un jeton de cookie, on peut vérifier sa présence ici sans l'appeler comme une fonction
        if ($csrf) {
          token = $csrf; // Assurer que $csrf n'est pas une fonction, mais la valeur du token
        }
      }

      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${useCookie(AUTH_TOKEN).value ?? ""}`,
        ...options?.headers,
        ...(token && { [CSRF_HEADER]: token }), // Ajouter le CSRF Token aux headers si disponible
      };

      if (import.meta.server) {
        const cookieString = event
          ? event.headers.get("cookie")
          : useRequestHeaders(["cookie"]).cookie;

        headers = {
          ...headers,
          ...(cookieString && { cookie: cookieString }),
          referer: FRONT_END_URL,
        };
      }

      options.headers = headers;
    },

    async onResponseError({ response }) {
      const status = response.status;
      if ([500].includes(status)) {
        console.error("[Error]", response.statusText, response._data);
      }
    },
  });

  nuxtApp.provide("apifetch", apifetch);
});
