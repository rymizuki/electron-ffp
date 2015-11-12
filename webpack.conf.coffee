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
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ]
  externals: [
  ]
}
