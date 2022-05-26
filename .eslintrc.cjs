module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:import/errors',
        'plugin:import/typescript',
    ],
    globals: {
        globalThis: true,
        window: false,
        global: false,
        process: true,
    },
    settings: {
        react: {
            version: '18',
        },
    },

    rules: {
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/quotes': ['error', 'single', 'avoid-escape'],
        '@typescript-eslint/no-explicit-any': 'off',

        'eqeqeq': ['error', 'always'],
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-eval': 'error',
        'no-loop-func': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-wrappers': 'error',
        'no-param-reassign': 'error',
        'no-shadow': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'no-console': 'off',
    },
};
