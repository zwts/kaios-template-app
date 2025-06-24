const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist")
    },
    host: "localhost",
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  performance: {
    hints: false
  }
});
