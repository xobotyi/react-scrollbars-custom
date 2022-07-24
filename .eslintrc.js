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
        'react/button-has-type': 'off',
      },
    },
    {
      files: ['**/tests/**/*.js', '**/tests/**/*.ts', '**/tests/**/*.jsx', '**/tests/**/*.tsx'],
      extends: ['@react-hookz/eslint-config/react'],
    },
    {
      files: ['*.md', '*.mdx'],
      extends: ['@react-hookz/eslint-config/mdx'],
    },
  ],
};
