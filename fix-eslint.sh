#!/bin/bash

# Navigate to frontend
cd frontend

# Install ESLint if not already installed
npm install eslint --save-dev
npm install eslint-plugin-react --save-dev
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-jsx-a11y --save-dev
npm install eslint-plugin-react-hooks --save-dev

# Create ESLint config if it doesn't exist
if [ ! -f .eslintrc.json ]; then
  echo '{
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "react",
      "react-hooks"
    ],
    "rules": {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "no-console": "warn"
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  }' > .eslintrc.json
  echo "Created ESLint config file"
fi

# Run ESLint fix command
echo "Fixing ESLint issues..."
npx eslint --fix src/

echo "ESLint fixes applied. Please commit the changes and redeploy." 