export const useSubscription = () => {
    const { $apifetch } = useNuxtApp();

    const create = async (payment: {
        paymentMethodId: string;
        priceId: string;
    }) => {
        await $apifetch('api/subscription/create', { method: 'post', body: payment });
    };

    return {
        create,
    };
};
