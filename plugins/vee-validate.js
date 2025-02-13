import { defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';

// Définition des règles globales
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

// Configuration des règles de validation
configure({
    generateMessage: localize({
        fr: {
            ...fr,
            messages: {
                ...fr.messages,
                required: 'Ce champ est obligatoire',
                email: 'Veuillez entrer une adresse e-mail valide',
                min: 'Ce champ doit contenir au moins {length} caractères',
            },
        },
    }),
    validateOnBlur: true, // Valide lorsque l'utilisateur quitte le champ
    validateOnChange: false, // Optionnel: vous pouvez désactiver la validation à chaque changement si vous le souhaitez
    validateOnInput: false, // Vous pouvez ajuster cette option selon vos besoins
    validateOnSubmit: true, // Validation au moment de la soumission
});

export default defineNuxtPlugin((nuxtApp) => {
    // Vous pouvez rendre cette configuration globale accessible ici
    nuxtApp.provide('veeValidate', {
        defineRule,
        configure,
    });
});
