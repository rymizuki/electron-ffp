webpack = require('webpack')

module.exports = {
  entry: 'app',
  output: {
    filename: 'app.js'
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.tag',
      '.css',
    ],
    modulesDirectories: [
      './view',
      './node_modules',
    ],
  },
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader' },
    ],
    loaders: [
      { test: /\.(tag|js)$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader!postcss-loader' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ]
  externals: [
  ]
  postcss: () ->
    return [
      require('postcss-simple-vars')({
        variables: () ->
          return require('./view/app/style-variables')
        unknown: (node, name, result) ->
          node.warn result, "Unknown variable '#{ name }'"
      })
      require('postcss-calc')
      require('postcss-nested')
      require('autoprefixer')
    ]
}
