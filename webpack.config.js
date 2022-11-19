const path = require("path");

module.exports = {
  entry: {
    build: "./src/app/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist", "src"),
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {}
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  },
  externals: { vscode: 'vscode' }
};