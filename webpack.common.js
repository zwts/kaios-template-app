const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ZipFilesPlugin = require('webpack-archive-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
!fs.existsSync("./release") && fs.mkdirSync("./release");

module.exports = {
  name: "common",

  target: "web",

  entry: {
    app: "./src/App.tsx"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".json"],
    alias: {
      "@": resolveApp("./src/"),
      react: "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript"
          ]
        }
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || "development"
    }),
    new CleanWebpackPlugin({ verbose: false }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin([
      { from: "src/manifest.webapp.json", to: "manifest.webapp" },
      { from: "src/fake-data.json", to: "fake-data.json"},
      { from: "src/index.html" },
      { from: "src/locales", to: "locales" },
      { from: "assets", to: "assets" }
    ]),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new ZipFilesPlugin({
      entries: [{ src: resolveApp("./dist/"), dist: "../" }],
      output: "./release/application",
      format: "zip"
    })
  ]
};
