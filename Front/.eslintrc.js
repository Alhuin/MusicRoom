module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'env': {
        'jest': true,
    },
    'rules': {
        'no-use-before-define': 'off',
        'react/jsx-filename-extension': 'off',
        'react/prop-types': 'off',
        'react/prefer-stateless-function': 'off',
        'no-console': 'off',
        'no-alert': 'off',
        'no-underscore-dangle': 'off',
    },
    'globals': {
        "fetch": false
    }
};
