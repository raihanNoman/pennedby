// Learn more https://docs.expo.io/guides/customizing-metro
// npx expo customize metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
// const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const ALIASES = { tslib: require.resolve("tslib/tslib.es6.js") };
config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform,
  );
};

// config.resolver.extraNodeModules = {
// Alias tslib to the ES6 version for web
//   'tslib': path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
// };

config.transformer.getTransformOptions = async () => ({
  transform: { experimentalImportSupport: true },
});

config.resolver.assetExts.push("m4a");

config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer/expo");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts.push("svg");
config.resolver.sourceExts.push("mjs");

[("js", "jsx", "json", "ts", "tsx", "cjs", "mjs")].forEach((ext) => {
  if (config.resolver.sourceExts.indexOf(ext) === -1) {
    config.resolver.sourceExts.push(ext);
  }
});

["glb", "gltf", "png", "jpg"].forEach((ext) => {
  if (config.resolver.assetExts.indexOf(ext) === -1) {
    config.resolver.assetExts.push(ext);
  }
});

config.transformer.unstable_allowRequireContext = true;
config.transformer.unstable_allowModuleTranspilation = ["svg-path-properties"];

module.exports = config;
