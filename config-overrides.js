const path = require('path');

module.exports = function override(config, env) {
  // Add webpack alias to resolve React Native packages to empty modules for browser builds
  config.resolve.alias = {
    ...config.resolve.alias,
    '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/utils/empty-module.js'),
    // Stub @metamask/sdk-analytics to avoid openapi-fetch ESM/CJS interop issues
    '@metamask/sdk-analytics': path.resolve(__dirname, 'src/utils/analytics-stub.js'),
  };

  return config;
};

