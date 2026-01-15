/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';

type MissionList = {
    data: any[];
    meta: any;
};

export const useMissions = () => {
    const { $apifetch } = useNuxtApp();
    const missions = useState<MissionList>('missions', () => ({ data: [], meta: {} }));
    const count = useState<number>('missionsCount', () => 0);
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function create(formData) {
        const response = await $apifetch(`/api/institution/missions`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/missions/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            missions.value = response;
        });
    }

    async function getById(id: number) {
        return await $apifetch(`api/institution/missions/${id}`);
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/missions/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    async function remove(id: number) {
        return await $apifetch(`api/institution/missions/${id}`, {
            method: 'DELETE',
        });
    }

    return {
        missions,
        count,
        create,
        getAll,
        getById,
        update,
        remove,
        error,
        loading,
    };
};

export const useMissionResponses = () => {
    const { $apifetch } = useNuxtApp();
    const responses = useState<MissionList>('missionResponses', () => ({ data: [], meta: {} }));
    const count = useState<number>('missionResponsesCount', () => 0);
    const error = useState('missionResponsesError', () => null);
    const loading = useState('missionResponsesLoading', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('/api/institution/missions/responses', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            responses.value = response;
        });
    }

    async function apply(formData) {
        const response = await $apifetch(`/api/institution/missions/responses`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getByMission(id, page = 1, perPage = 25, options = {}) {
        return await $apifetch(`/api/institution/missions/responses/${id}`, {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            responses.value = response;
        });
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/missions/responses/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        responses,
        count,
        getAll,
        getByMission,
        update,
        apply,
        error,
        loading,
    };
};
