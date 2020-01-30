const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	entry: './src/index.tsx',
	target: 'web',
	// externals: [nodeExternals()],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'bundle.min.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			}, 
			{
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
			{
				test: /\.(woff|woff2|eot|ttf|svg)$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html'
		}),
		new MiniCssExtractPlugin()
	]
}