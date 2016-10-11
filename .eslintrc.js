module.exports = {
  "extends": ["airbnb", "plugin:node/recommended"],
  "plugins": [
    "react",
    "import",
    "jsx-a11y",
    "node"
  ],
  "env": {
    "browser": false,
    "node": true
  },
  "rules": {
    "no-console": 0,
    "no-unused-vars": [2, { "argsIgnorePattern": "^_" }],
    "import/newline-after-import": 0,
    "react/require-extension": 0
  }
};
