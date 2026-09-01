export interface ReplacementInstitution {
    initial: string;
    name: string;
    contract: string;
}

export interface ReplacementListing {
    id: number;
    type: 'replacement' | 'mission';
    date: string;
    city: string;
    zipCodes: string[];
    careTypes: string[];
    slots: string[];
    description?: string;
    isBoosted?: boolean;
    isUrgent?: boolean;
    isNew?: boolean;
    patientsPerDay?: number;
    institution?: ReplacementInstitution;
}

// Mock data shared by the /replacements list and detail pages — not yet
// wired to the API (see [id].vue).
export const replacementListings: ReplacementListing[] = [
    {
        id: 1,
        type: 'replacement',
        date: '03/07 → 15/07/2026',
        city: 'Wavre',
        zipCodes: ['1300', '1301'],
        careTypes: ['Soins généraux'],
        slots: ['Matin', 'Après-midi'],
        description: 'Remplacement suite à un congé maternité, service de médecine interne, équipe de 6 infirmiers.',
    },
    {
        id: 2,
        type: 'mission',
        date: '10/07 → 31/07/2026',
        city: 'Liège',
        zipCodes: ['4000'],
        careTypes: ['Soins intensifs', 'Réanimation', 'Ventilation assistée'],
        slots: ['Matin', 'Après-midi'],
        isBoosted: true,
        patientsPerDay: 8,
        institution: { initial: 'CH', name: 'CHU Liège', contract: 'Contrat CDI · Infirmier(e) en soins intensifs' },
        description: 'Le service de soins intensifs du CHU Liège recherche un(e) infirmier(e) pour renforcer son équipe de 12 soignants sur une mission longue durée. Vous interviendrez auprès de patients polytraumatisés et post-opératoires, en horaires alternés matin / après-midi. Une première expérience en réanimation ou soins critiques est souhaitée. Encadrement assuré par une infirmière référente durant les deux premières semaines.',
    },
    {
        id: 3,
        type: 'replacement',
        date: '17/07 → 24/07/2026',
        city: 'Bierges +6 autres',
        zipCodes: ['1301', '1300', '1340', '1341', '1342', '1348', '1367'],
        careTypes: ['Gériatrie', 'Soins palliatifs', 'Pansements', 'Toilette', 'Aide au repas', 'Kinésithérapie', 'Suivi médical', 'Prise de sang', 'Diabétologie', 'Cardiologie'],
        slots: ['Matin', 'Après-midi'],
        isUrgent: true,
        description: 'Remplacement suite à un arrêt maladie en maison de repos, sur plusieurs sites de la région de Wavre. Ambiance calme et familiale, équipe stable et bienveillante. Soins généraux et gériatriques auprès de résidents en perte d\'autonomie, aide aux gestes du quotidien et suivi médical courant. Véhicule personnel utile pour les déplacements entre sites.',
    },
    {
        id: 4,
        type: 'mission',
        date: '01/08 → 30/09/2026',
        city: 'Nivelles',
        zipCodes: ['1400'],
        careTypes: ['Maternité'],
        slots: ['Après-midi'],
        patientsPerDay: 5,
        institution: { initial: 'CS', name: 'Clinique Saint-Pierre', contract: 'Contrat CDD 6 mois · Sage-femme' },
    },
    {
        id: 5,
        type: 'replacement',
        date: '05/08 → 12/08/2026',
        city: 'Namur +9 autres',
        zipCodes: ['5000', '5001', '5002', '5003', '5004', '5010', '5020', '5024', '5030', '5031'],
        careTypes: ['Pédiatrie', 'Néonatologie', 'Vaccination', 'Suivi de croissance', 'Urgences pédiatriques'],
        slots: ['Matin', 'Après-midi'],
        description: 'Service de pédiatrie générale, plusieurs implantations, ambiance familiale et bienveillante.',
    },
    {
        id: 6,
        type: 'replacement',
        date: '20/08 → 27/08/2026',
        city: 'Arlon',
        zipCodes: ['6700', '6717', '6721'],
        careTypes: ['Soins à domicile', 'Pansements', 'Injections'],
        slots: ['Matin'],
        isNew: true,
        description: 'Tournée de soins à domicile, patientèle fidélisée, véhicule non fourni.',
    },
];
