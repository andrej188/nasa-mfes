const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;
const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';
  const envFile = isProduction ? '.env.production' : '.env';

  require('dotenv').config({ path: envFile });

  console.log(`envFile: ${envFile}`);
  console.log(`isProduction: ${isProduction}`);
  console.log(`env variables: \n${process.env.DETAIL_REMOTE_ENTRY_URL}`);

  return {
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: "auto",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3002,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src')],
      onListening: function (devServer) {
        const port = devServer.server.address().port;

        printCompilationMessage('compiling', port);

        devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
          setImmediate(() => {
            if (stats.hasErrors()) {
              printCompilationMessage('failure', port);
            } else {
              printCompilationMessage('success', port);
            }
          });
        });
      }
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "list_mf",
        filename: "remoteEntry.js",
        remotes: {
          details: `detail_mf@${process.env.DETAIL_REMOTE_ENTRY_URL}`
        },
        exposes: {
          "./List": "./src/List.tsx",
          "./listWrapper": "./src/listWrapper.tsx",
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: envFile })
    ],
  };
};
