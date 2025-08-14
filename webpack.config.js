const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const HtmlWebPackPluging = require("html-webpack-plugin");
const CopyWebPackPlugin = require("copy-webpack-plugin");

//in case of single page application we don't require a multiple entry and output. react or other library or framework only needs one entry point. from there it will create a dependency graph

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js", //entry always need to be relative path
    explore: "./src/explore.js",
  },
  devServer: {
    port: 3000,
  },
  output: {
    // filename: "[name].bundle.js", //this is one way to render but not recommendable for prod
    filename: "[name].[contenthash].bundle.js", //In the video he hasn't explain this contenthash calling method
    path: path.resolve(__dirname, "dist"), // __dirname returns the current working directory & ouput always need a absolute path
    assetModuleFilename: "asset/[hash][ext]", // this will responsible for moving all the img into asset folder inside dist folder
    clean: true, // this is clean the old wanted files or assets during build
  },
  plugins: [
    new HtmlWebPackPluging({
      template: "./src/index.html", //This will copy the content from the html file and crete a new html file with all dependency
      chunks: ["index"], //the index.html requires the index.js only. so bringing the key from entry and this chunk will injected to index.html of bundle
      filename: "index.html", //here im giving the file name because by default this will create a index.html file. but incase of mutiple html file required file name is need
      inject: "body", //this will decide where to inject script tag. either body or head
      minify: true, // by default true for prod and false for development
      // also some other properties can control the page title, fav icon, meta tags and etc.
    }), //plugings always need to create a instance of it
    new HtmlWebPackPluging({
      template: "./src/explore.html",
      chunks: ["explore"],
      filename: "explore.html",
      inject: "body",
      minify: true,
    }),
    new CopyWebPackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/images"), // copy files from where
          to: path.resolve(__dirname, "dist", "assets/images"), // paste files to where. also here dist is the destination. there we are creating new folder
          // context,
          // transform,
          // Read all other options from the copywebpack plugin docs
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
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
          MiniCssExtractPlugin.loader, //Here using the extractplugin loader to extract the css. style-loader basically inject the css in head section with style tag.
          // "style-loader",
          "css-loader",
        ] /** This is a common way for process the css file in webpack but it is not extracting the css into seperate file
          The loaders run from right to left. css-loader find the css file and do process css files. style-loader is responsible for injecting styles to the dom
        */,
      },
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // sass-loader will identify scss file and convert to css. then css-loader and style-loader do their job
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
