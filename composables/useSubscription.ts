export const useSubscription = () => {
    const { $apifetch } = useNuxtApp();
    const plan = useState('plan', () => null);

    const plans = async () => {
        return await $apifetch('api/subscription/plans');
    };

    const selectPlan = (product: string) => {
        plan.value = product;
    };

    const create = async (payment: {
        paymentMethodId: string;
        priceId: string;
    }) => {
        await $apifetch('api/subscription/create', { method: 'post', body: payment });
    };

    return {
        plans,
        create,
        selectPlan,
    };
};
