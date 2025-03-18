<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QzllsGhmRlizdmdd6yvpInKXkwAjOg8Wabal5k14V89bRSyZmiU1nXLZDSLWtK8QM5LQdbFcvMagvmLdOQ1gw3k00uj5OZTOe');

const elements = ref(null);
const cardElement = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const { create } = useSubscription();

onMounted(async () => {
    const stripe = await stripePromise;
    elements.value = stripe.elements();
    cardElement.value = elements.value.create('card');
    cardElement.value.mount('#card-element');
});

const handleSubmit = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const stripe = await stripePromise;
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement.value,
        });

        if (error) {
            errorMessage.value = error.message;
            loading.value = false;
            return;
        }

        // await create(paymentMethod.id).then((response) => {
        // });
    }
    catch (err) {
        console.log(err);
        errorMessage.value = 'Une erreur est survenue.';
    }
    finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 class="text-xl font-bold mb-4">
            Souscrire à un abonnement
        </h2>

        <form @submit.prevent="handleSubmit">
            <div
                id="card-element"
                class="p-3 border border-gray-300 rounded-md"
            />

            <button
                type="submit"
                :disabled="loading"
                class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
            >
                {{ loading ? 'Traitement...' : 'Payer' }}
            </button>
        </form>

        <p
            v-if="errorMessage"
            class="text-red-500 mt-2"
        >
            {{ errorMessage }}
        </p>
        <p
            v-if="successMessage"
            class="text-green-500 mt-2"
        >
            {{ successMessage }}
        </p>
    </div>
</template>

<style scoped>
#card-element {
  background-color: white;
}
</style>
