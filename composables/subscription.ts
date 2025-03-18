import { useNuxtApp } from '#app';

export const useSubscription = () => {
    const { $apifetch } = useNuxtApp();

    async function create(product: string) {
        const response = await $apifetch('api/subscription/create', { method: 'post', body: { product: product } });

        const { id } = response;

        const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
        const { error } = await stripe.redirectToCheckout({ sessionId: id });

        if (error) {
            console.error('Error redirecting to checkout:', error);
        }
    }

    return {
        create,
    };
};
