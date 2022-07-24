module.exports = {
  root: true,

  ignorePatterns: [
    'node_modules',
    'coverage',
    'dist',
    '.github/workflows',
    '.husky',
    'CHANGELOG.md',
  ],

  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.mdx', '.md'],
  },

  overrides: [
    {
      files: ['*.js', '*.ts', '*.jsx', '*.tsx'],
      extends: ['@react-hookz/eslint-config/react'],
      rules: {
        // ToDo: remove below after refactoring
        'no-underscore-dangle': 'off',
        'import/no-default-export': 'off',
        'no-bitwise': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'react/destructuring-assignment': 'off',
        'unicorn/consistent-destructuring': 'off',
        'react/no-unused-class-component-methods': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['tests/*.js', 'tests/*.ts', 'tests/*.jsx', 'tests/*.tsx'],
      extends: ['@react-hookz/eslint-config/react'],
      rules: {
        // ToDo: remove below after refactoring
        'no-underscore-dangle': 'off',
        'import/no-default-export': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-bitwise': 'off',
        'func-names': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        'react/jsx-no-bind': 'off',
        'react/no-unused-state': 'off',
        'react/destructuring-assignment': 'off',
        'unicorn/consistent-destructuring': 'off',
        'react/no-unused-class-component-methods': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      extends: ['@react-hookz/eslint-config/mdx'],
    },
  ],
};
