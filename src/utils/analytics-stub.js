// Stub module for @metamask/sdk-analytics to avoid openapi-fetch ESM/CJS interop issues
// This provides a no-op analytics object that satisfies the MetaMask SDK interface

const noopAnalytics = {
  setGlobalProperty: () => {},
  track: () => {},
  trackEvent: () => {},
  identify: () => {},
  reset: () => {},
  flush: () => {},
  setEnabled: () => {},
  isEnabled: () => false,
  enable: () => {},
  disable: () => {},
  send: () => {},
  init: () => {},
};

module.exports = {
  analytics: noopAnalytics,
};

// Also export as default and named for ESM compatibility
module.exports.default = module.exports;
module.exports.analytics = noopAnalytics;

