const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './public/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './'
  },
  devServer: {
    static: __dirname,
    port: 3001,
    open: true,
    hot: true,
    devMiddleware: {
      publicPath: '/dist/'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Archivos JS
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/, // Procesar archivos SCSS de Bootstrap
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/, // Procesar archivos CSS
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/, // Carga fuentes de FontAwesome
        type: 'asset/resource',
      }
    ]
  }
};
