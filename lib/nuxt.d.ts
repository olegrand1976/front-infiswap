import type { $fetch } from 'ofetch';
import type { Toast } from './../.nuxt/components.d';

declare module '#app' {
    interface NuxtApp {
        $apifetch: typeof $fetch;
        $user: User;
        $toast: Toast;
    }
}

interface User {
    id: number;
    firstname: string;
    lastname: string;
    nurse: Nurse;
}

interface Nurse {
    id: number;
    user_id: string;
}
