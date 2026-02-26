import { useState, useNuxtApp } from '#app';

export const useMail = () => {
    const { $apifetch } = useNuxtApp();
    const { $toast } = useNuxtApp();

    const mail = useState('mail', () => []);
    const error = useState('mailError', () => null);
    const loading = useState('mailLoading', () => false);
    const success = useState('mailSuccess', () => false);

    // const user = useState('user');

    const getMailSend = async () => {
        return await $apifetch('api/admin/mails').then((response) => {
            mail.value = response.mails;
        });
    };

    const sendMail = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            await $apifetch('/api/admin/mails', {
                method: 'POST',
                body: formData,
                headers: {
                },
            });

            success.value = true;
            return true;
        }
        catch (err) {
            if (err.data && err.data.errors) {
                const backendErrors = err.data.errors;
                const firstField = Object.keys(backendErrors)[0];
                const firstMessage = backendErrors[firstField][0];

                $toast({
                    description: firstMessage,
                    status: 'error',
                    variant: 'destructive',
                });
            }

            error.value = err;
            throw err;
        }
        finally {
            loading.value = false;
        }
    };

    const reportProblem = async (formData) => {
        await $apifetch('/api/contact/problem', {
            method: 'POST',
            body: formData,
        });

        return true;
    };

    const reportErrorUser = async (formData) => {
        return await $apifetch(`/api/report-error/${formData.token}`, {
            method: 'POST',
            body: {
                message: formData.message,
            },
        });
    };

    const getUserNameReport = async (token) => {
        return await $apifetch(`/api/report-error/name/${token}`);
    };

    return {
        error,
        loading,
        success,
        mail,
        getMailSend,
        sendMail,
        reportProblem,
        reportErrorUser,
        getUserNameReport,
    };
};
