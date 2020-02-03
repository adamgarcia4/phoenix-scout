const path = require('path');
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' })

module.exports = () => {
	return {
		entry: path.join(__dirname, '/src/index.tsx'),
		target: 'web',
		// externals: [nodeExternals()],
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
		},
		output: {
			path: path.join(__dirname, '/dist'),
			filename: 'bundle.min.js',
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'awesome-typescript-loader',
					options: {
						sourceMap: true
					}
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
			new MiniCssExtractPlugin(),
			new webpack.DefinePlugin({
				"process.env": JSON.stringify(dotenv.parsed)
			})
		],
		devServer: {
			port: 3000,
			host: '0.0.0.0',
			historyApiFallback: true,
		}
	}
}