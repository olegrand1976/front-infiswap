import type { $fetch } from 'ofetch';
import type { Toast } from '../../.nuxt/components';

declare module '#app' {
    interface NuxtApp {
        $apifetch: typeof $fetch;
        $user: User;
        $toast: Toast;
        $fetchCurrentUser: () => Promise<User>;
    }
}
