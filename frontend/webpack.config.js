const path = require('path');
// const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = () => {
	return {
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
			new MiniCssExtractPlugin(),
			new Dotenv({
				path: path.resolve(__dirname, '../.env')
			})
		],
		devServer: {
			port: 9000
		}
	}
}