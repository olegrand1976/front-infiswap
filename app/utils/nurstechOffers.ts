/** Source unique des tarifs / argumentaire NursTech (landing + modal dashboard). */

export const NURSTECH_PITCH = {
    headline: 'Page web pro clé en main, visible par vos futurs patients sur InfiSwap.',
    bullets: [
        'Page professionnelle à votre image (services domicile, horaires, secteurs).',
        'Mise en ligne sous environ 15 jours après logo et photos.',
        'Contact patient facilité — plus de demandes de soins à domicile.',
    ],
} as const;

export const NURSTECH_OFFERS = {
    starters: {
        title: 'Formule STARTERS',
        subtitle: 'pour bien débuter',
        creation: 450,
        maintenanceYear1Month: 25,
        maintenanceYear1Year: 250,
        maintenanceAfterMonth: 50,
        maintenanceAfterYear: 500,
    },
    monthly: {
        title: 'Option paiement mensuel',
        creationMonth: 45,
        creationMonths: 12,
        maintenanceYear1Month: 25,
        totalYear1Month: 70,
        afterYear1Month: 50,
    },
    standard: {
        title: 'Formule STANDARD',
        subtitle: 'présence digitale professionnelle',
        creation: 900,
        maintenanceMonth: 50,
        maintenanceYear: 500,
    },
    domain: {
        title: 'Option domaine',
        setup: 25,
        month: 10,
    },
} as const;
