/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';

type TimesheetList = {
    data: any[];
    meta: any;
};

export const useTimesheets = () => {
    const { $apifetch } = useNuxtApp();
    const timesheets = useState<TimesheetList>('timesheets', () => ({ data: [], meta: {} }));
    const error = useState('timesheetError', () => null);
    const loading = useState('timesheetLoading', () => false);

    async function getAll(missionId: number, page = 1, perPage = 5, options = {}) {
        return await $apifetch(`api/institution/timesheets/${missionId}`, {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            timesheets.value = response;
        });
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/timesheets/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        timesheets,
        getAll,
        update,
        error,
        loading,
    };
};
