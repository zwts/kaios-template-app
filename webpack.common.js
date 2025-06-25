const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ZipFilesPlugin = require("zip-webpack-plugin");

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
      "@": path.resolve(__dirname, "src"),
      react: "preact/compat",
      "react-dom": "preact/compat",
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
        test: /\.(woff|woff2|eot|svg)$/,
        loader: "file-loader",
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
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.webapp.json", to: "manifest.webapp" },
        { from: "src/locales", to: "locales" },
        { from: "src/assets", to: "assets" },
        { from: "src/libs", to: "libs" }
      ]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "release/*")]
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new ZipFilesPlugin({
      filename: "application.zip",
      path: path.resolve(__dirname, "release"),
      archivePath: path.resolve(__dirname, "dist"),
      exclude: []    
    })
  ]
};
