module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@next/next/no-img-element': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/no-children-prop': 'off',
    'import/no-unresolved': 'off',
    'import/named': 'off'
  }
};
