// composables/useOpenai.ts

import OpenAI from 'openai';

export const useOpenai = () => {
    const config = useRuntimeConfig();
    const client = new OpenAI({
        apiKey: config.public.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    async function ask(prompt: string, role: 'developer' | 'user' | 'assistant' = 'developer') {
        // const response = await client.responses.create({
        //     model: 'gpt-4o-mini',
        //     input: [
        //         {
        //             role: role,
        //             content: prompt,
        //         },
        //     ],
        // });

        const response = await client.responses.create({
            model: 'gpt-4',
            instructions: 'You are a coding assistant that talks like a pirate',
            input: 'Are semicolons optional in JavaScript?',
        });

        return response;
    }

    return {
        ask,
    };
};
