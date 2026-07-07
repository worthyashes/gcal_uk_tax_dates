/**
 * GAS-visible function declarations.
 *
 * Google Apps Script only recognises top-level `function` declarations for menus,
 * triggers, and the Run dropdown. Webpack bundles everything inside an IIFE, so
 * this file bridges the gap: it calls into the bundle (exported as UkTaxBundle)
 * using plain function declarations that GAS can see and call.
 *
 * Execution order: bundle.js runs first (alphabetically) → UkTaxBundle is defined
 * → gas-declarations.js runs → these functions are now callable from GAS.
 */

// eslint-disable-next-line no-undef
function onOpen() { UkTaxBundle.onOpen(); }

// eslint-disable-next-line no-undef
function calculateCurrentYear() { UkTaxBundle.calculateCurrentYear(); }

// eslint-disable-next-line no-undef
function generateReport() { UkTaxBundle.generateReport(); }

// eslint-disable-next-line no-undef
function openSettings() { UkTaxBundle.openSettings(); }
