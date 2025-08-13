const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js", //entry always need to be relative path
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"), // __dirname returns the current working directory & ouput always need a absolute path
    assetModuleFilename: "asset/[hash][ext]", // this will responsible for moving all the img into asset folder inside dist folder
    clean: true, // this is clean the old wanted files or assets during build
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      // }, //This is one way of using the post css and extract css from the main js file
      {
        test: /\.(css)$/,
        use: [
          "style-loader",
          "css-loader",
        ] /** This is a common way for process the css file in webpack but it is not extracting the css into seperate file
          The loaders run from right to left. css-loader find the css file and do process css files. style-loader is responsible for injecting styles to the dom
        */,
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"], // sass-loader will identify scss file and convert to css. then css-loader and style-loader do their job
      },
      {
        test: /.(avif|png|jpg|jpeg|svg|webp)$/,
        type: "asset/resource", // For loaders which is part of webpack will use type key name. external loaders use "use" key name.
      },
      {
        test: /.(ttf)$/,
        type: "asset/resource",
      },
    ],
  },
};
