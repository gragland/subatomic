const webpack = require("webpack");

const config = {
  entry: {
    emotion: "./src/emotion.js",
    "styled-components": "./src/styled-components.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        include: __dirname + "/src"
      }
    ]
  },
  externals: {
    react: "react",
    "styled-components": "styled-components",
    emotion: "emotion",
    "react-emotion": "react-emotion",
    "@emotion/is-prop-valid": "@emotion/is-prop-valid"
  },
  output: {
    path: __dirname,
    filename: "[name].js",
    library: "Subatomic",
    libraryTarget: "umd"
  }
};

module.exports = config;
