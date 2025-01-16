/**
 * @fileoverview ESLint configuration for the Job Tracker frontend application.
 * Implements React-specific rules and modern JavaScript features.
 */

import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"

// Configuration array using the new flat config format
export default [
  // Ignore build output directory
  { ignores: ["dist"] },

  // Main configuration object
  {
    // Apply these rules to all JavaScript and JSX files
    files: ["**/*.{js,jsx}"],

    // Language options configuration
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Include browser globals
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: "module",
      },
    },

    // React-specific settings
    settings: { react: { version: "18.3" } },

    // Configure ESLint plugins
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // Combine rule sets from multiple sources
    rules: {
      // Include recommended JavaScript rules
      ...js.configs.recommended.rules,
      // Include recommended React rules
      ...react.configs.recommended.rules,
      // Include React JSX runtime rules
      ...react.configs["jsx-runtime"].rules,
      // Include React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Custom rule overrides
      "react/jsx-no-target-blank": "off", // Disable target="_blank" warnings
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }, // Allow constant exports with Fast Refresh
      ],
    },
  },
]
