import { useState, useNuxtApp } from '#app';
import type { Product } from '~/lib/types';

export const useProduct = () => {
    const { $apifetch } = useNuxtApp();
    const products = useState('products', () => []);
    const count = useState<number>('productsCount', () => 0);
    const { $toast } = useNuxtApp();

    async function getProducts(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/products', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            products.value = response.products;
            count.value = response.count;
        });
    }

    async function createOrUpdate(product: Product) {
        const data: { name: string; description?: string } = {
            name: product.name ?? '',
            description: product.description ?? '',
        };

        const isUpdate = !!product.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate
            ? `api/products/${product.id}`
            : 'api/products';

        return await $apifetch(url, {
            method,
            body: data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async function get(product: number) {
        return await $apifetch(`api/products/${product}`);
    }

    async function getAll() {
        const response = await $apifetch(`api/products/all`);
        return response.products;
    }

    async function softDelete(product: number) {
        await $apifetch(`api/products/${product}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    return {
        products,
        count,
        getProducts,
        createOrUpdate,
        get,
        softDelete,
        getAll,
    };
};
