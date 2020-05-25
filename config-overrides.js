const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addDecoratorsLegacy,
  disableEsLint,
  overrideDevServer,
  addPostcssPlugins,
  addWebpackPlugin
} = require('customize-cra');
const darkTheme = require('@ant-design/dark-theme');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const chalk = require('chalk');

module.exports = {
  webpack: override(
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      }),
      fixBabelImports('lodash', {
        libraryDirectory: '',
        camel2DashComponentName: false
      }),
      addPostcssPlugins([require("postcss-px2rem-exclude")({
        remUnit: 16,
        propList: ['*'],
        exclude: ''
      })]),
      addLessLoader({
        javascriptEnabled: true,
        modifyVars: darkTheme
      }),
      addWebpackAlias({ //路径别名
        '@': path.resolve(__dirname, 'src'),
      }),
      addDecoratorsLegacy(),
      disableEsLint(),
      addWebpackPlugin(new ProgressBarPlugin({
            complete: "",
            format: `${chalk.green('Building')} [ ${chalk.green(':bar')} ] ':msg:' ${chalk.bold('(:percent)')}`,
            clear: true
          }),
      ),
      (config, env) => {
        config = rewireReactHotLoader(config, env);
        return config;
      },
  ),
  devServer: overrideDevServer((config) => {
        config.disableHostCheck = true;
        return config
      }
  )
}
