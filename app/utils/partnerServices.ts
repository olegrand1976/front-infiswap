export function isPartnerProductActive(flag: boolean | number | undefined | null): boolean {
    return flag === true || flag === 1;
}

export type PartnerProduct = 'nurstech' | 'nursassur';

export type PartnerCampaign = {
    featured: PartnerProduct;
    headline: string;
    banner_copy: string;
    period: string;
    cta_path: string;
};
