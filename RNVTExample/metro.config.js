/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
  resolver: {
    blacklistRE: blacklist([]),
    extraNodeModules: {
      'react-native-visibility-tracker': path.resolve(__dirname, '..')
    }
  },
  watchFolders: [path.resolve(__dirname, '..')],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
