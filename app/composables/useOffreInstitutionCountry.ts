import {
    OFFRE_INSTITUTION_COUNTRY_STORAGE_KEY,
    parseOffreInstitutionCountry,
    type OffreInstitutionCountry,
} from '~/lib/offreInstitutionCountry';

export function useOffreInstitutionCountry() {
    const selectedCountry = ref<OffreInstitutionCountry | null>(null);
    const showCountryModal = ref(false);
    const isHydrated = ref(false);

    const isBelgium = computed(() => selectedCountry.value === 'be');
    const isFrance = computed(() => selectedCountry.value === 'fr');
    const hasSelectedCountry = computed(() => selectedCountry.value !== null);

    function readStoredCountry(): OffreInstitutionCountry | null {
        if (!import.meta.client) {
            return null;
        }

        return parseOffreInstitutionCountry(sessionStorage.getItem(OFFRE_INSTITUTION_COUNTRY_STORAGE_KEY));
    }

    function persistCountry(country: OffreInstitutionCountry) {
        if (import.meta.client) {
            sessionStorage.setItem(OFFRE_INSTITUTION_COUNTRY_STORAGE_KEY, country);
        }
    }

    function setCountry(country: OffreInstitutionCountry) {
        selectedCountry.value = country;
        persistCountry(country);
        showCountryModal.value = false;
    }

    function initializeCountrySelection() {
        const storedCountry = readStoredCountry();
        selectedCountry.value = storedCountry;
        showCountryModal.value = storedCountry === null;
        isHydrated.value = true;
    }

    onMounted(() => {
        initializeCountrySelection();
    });

    return {
        selectedCountry,
        showCountryModal,
        isHydrated,
        hasSelectedCountry,
        isBelgium,
        isFrance,
        setCountry,
    };
}
