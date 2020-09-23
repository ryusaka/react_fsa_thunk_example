const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')

const webpackConfig = {
  mode: 'production',
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
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env', {
                    targets: {
                      browsers: ['last 2 versions', '> 1%'],
                    },
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                '@loadable/babel-plugin',
              ],
            },
          },
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
    ],
  },
  plugins: [
    // for typecheck
    new ForkTsCheckerWebpackPlugin(),
    new LoadablePlugin(),
  ]
}

module.exports = webpackConfig
