import { describe, expect, it } from 'vitest';
import fr from '../../i18n/locales/fr.json';
import nl from '../../i18n/locales/nl.json';

describe('premiumMarketing control (replacement premium highlight)', () => {
    it('exposes member label and visibility benefit in FR', () => {
        expect(fr.premiumMarketing.memberLabel).toBe('Membre premium');
        expect(fr.premiumMarketing.benefits.visibility.title).toContain('Mise en valeur');
        expect(fr.premiumMarketing.benefits.visibility.description).toContain('Membre premium');
        expect(fr.pricing.pro.features.p4).toContain('Membre premium');
    });

    it('exposes member label and visibility benefit in NL', () => {
        expect(nl.premiumMarketing.memberLabel).toBe('Premiumlid');
        expect(nl.premiumMarketing.benefits.visibility.title).toContain('Uitgelicht');
        expect(nl.premiumMarketing.benefits.visibility.description).toContain('Premiumlid');
        expect(nl.pricing.pro.features.p4).toContain('Premiumlid');
    });
});
