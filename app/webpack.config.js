const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const webpackConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  cache: true,
  stats: 'errors-only',
  context: __dirname, // to automatically find tsconfig.json
  entry: './src/index.tsx',
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve('app/dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              configFile: 'app/tsconfig.json',
            },
          },
        ],
      },
      {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
      }
    ],
  },
  plugins: [
    // for typecheck
    new ForkTsCheckerWebpackPlugin(),
  ]
}

module.exports = webpackConfig
