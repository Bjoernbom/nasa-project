module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "amd": true,
        "node": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
