const { nextI18NextRewrites } = require("next-i18next/rewrites");

const localeSubpaths = {
  en: "en",
  ko: "ko",
};

// /* eslint-disable */
// const withLess = require("@zeit/next-less");
const lessToJS = require("less-vars-to-js");
// const withCSS = require("@zeit/next-css");

const fs = require("fs");
const path = require("path");

// // Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./assets/antd-custom.less"), "utf8")
);

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer(
//   withCSS(
//     withLess({
//       lessLoaderOptions: {
//         javascriptEnabled: true,
//         modifyVars: themeVariables, // make your antd custom effective
//       },
//       webpack: (config, { isServer }) => {
//         if (isServer) {
//           const antStyles = /antd\/.*?\/style.*?/;
//           const origExternals = [...config.externals];
//           config.externals = [
//             (context, request, callback) => {
//               if (request.match(antStyles)) return callback();
//               if (typeof origExternals[0] === "function") {
//                 origExternals[0](context, request, callback);
//               } else {
//                 callback();
//               }
//             },
//             ...(typeof origExternals[0] === "function" ? [] : origExternals),
//           ];

//           config.module.rules.unshift({
//             test: antStyles,
//             use: "null-loader",
//           });
//         }
//         return config;
//       },
//       //i18n below
//       rewrites: async () => nextI18NextRewrites(localeSubpaths),
//       publicRuntimeConfig: {
//         localeSubpaths,
//       },
//     })
//   )
// );

const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },

  //i18n below
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },

  webpack5: false,
});
