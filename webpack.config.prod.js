const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const HtmlWebPackPluging = require("html-webpack-plugin");
const CopyWebPackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebPackPlugin = require("css-minimizer-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob");

const PATHS = {
  src: path.join(__dirname, "src"),
};

//in case of single page application we don't require a multiple entry and output. react or other library or framework only needs one entry point. from there it will create a dependency graph

/**
 * TREE SHAKING:
 * tree shaking is webpack inbuild optimization used by treaserer optimizer. It will use the dependancy graph and do static analysis to identify dead code. Based on the analysis the unused codes are removed from the final bundle. this is called tree shaking or dead code elimination
 * tree shaking only works if es6 import and export added.
 * by defualt enabled for production mode
 * try to minimize ur dependencies
 * use dynamic imports whenever possible to reduce the initial bundle size.
 */

/**
 * Content hashing:
 * Content hashing is very usefull long term caching.
 * webpack only updates hash of the file when the content of the file is changed. other wise it brings from the cache.
 * Same cache will happen in browser also. so the performance of the app will increase
 *
 */

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js", //entry always need to be relative path
    explore: "./src/explore.js",
  },
  output: {
    // filename: "[name].bundle.js", //this is one way to render but not recommendable for prod
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"), // __dirname returns the current working directory & ouput always need a absolute path
    assetModuleFilename: "asset/[hash][ext]", // this will responsible for moving all the img into asset folder inside dist folder
    clean: true, // this is clean the old wanted files or assets during build
  },
  optimization: {
    minimizer: [
      `...`, // here spreding the default optimization. otherwise the default treasurer optimzation will overwritten by the minimizer array. so js and html code won't be optimized
      new CssMinimizerWebPackPlugin({}), // internally it uses nanocss to optimize and remove duplicate css
    ], // cssMinimizer plugin will minimize the css. it is only required in prod mode so that im adding in prod config file

    splitChunks: {
      chunks: "all", // this split chunks will split the common modules which used across the code. due to this the redundent code will removed.
    },
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
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }), // here glob.sync is match the given path syncronosly. for that the path need to given dynamically. also ** means folder and * means file.
      // only: ["explore"], //using only property will run this purge css on that particular chunk. example here im using explore chnunk
      // safelist: [".unused-css"], //safelist is a class array where purge css don't apply for those classes.
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
