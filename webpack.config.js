const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/app.jsx',
  module: {
    rules: [
      {
        test: /\.(tsx|jsx)?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: false
    // port: 9000
  },
  plugins: [
    // Copy all from src/ to dist/
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ]
}
