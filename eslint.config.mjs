import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
    features: {
        stylistic: {
            semi: true,
            indent: 4,
            quotes: 'single',
        },
    },
    rules: {
        'no-unused-vars': 'on',
        'no-undef': 'on',
        'no-console': 'on',
        'vue/no-unused-vars': 'on',
        'vue/valid-v-bind': 'error',
        'vue/valid-v-if': 'error',
        'vue/valid-v-for': 'error',
        'vue/html-closing-bracket-newline': ['error', { multiline: 'always' }],
        'vue/html-indent': ['error', 4],
        'indent': ['error', 4],
    },
});
