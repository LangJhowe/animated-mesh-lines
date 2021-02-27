module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential'
    // 'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-var-requires': [0],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': [
      'error',
      'never'
    ],
    indent: [
      'error',
      2,
      {
        VariableDeclarator: 'first',
        ObjectExpression: 1,
        SwitchCase: 1,
        flatTernaryExpressions: false
      }
    ],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
    'key-spacing': ['error', { beforeColon: false }],
    'no-unused-vars': ['off'],
    'comma-dangle': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'switch-colon-spacing': ['error', { after: true, before: false }],
    'spaced-comment': ['error', 'always'],
    'space-unary-ops': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'semi-style': ['error', 'last'],
    'semi-spacing': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'always',
      asyncArrow: 'always'
    }],
    'no-whitespace-before-property': 'error',
    'no-unneeded-ternary': 'error',
    'object-curly-newline': ['error', { multiline: true }],
    'object-curly-spacing': ['error', 'always'],
    // ES6
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-duplicate-imports': 'error',
    'no-dupe-class-members': 'off',
    // vue
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/attribute-hyphenation': ['error', 'always', { ignore: [] }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/no-multi-spaces': ['error', { ignoreProperties: true }],
    'vue/no-spaces-around-equal-signs-in-attribute': ['error']
  }
}
