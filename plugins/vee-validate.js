import { defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

configure({
    generateMessage: localize({
        fr: {
            ...fr,
            messages: {
                ...fr.messages,
                email: 'Veuillez entrer une adresse e-mail valide',
                min: 'Ce champ doit contenir au moins {length} caractères',
            },
        },
    }),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: false,
    validateOnSubmit: true,
});

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('veeValidate', {
        defineRule,
        configure,
    });
});
