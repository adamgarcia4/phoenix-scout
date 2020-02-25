const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

const modeConfig = (env) => require(`./build-utils/webpack.${env.mode}.js`)(env)

module.exports = ({ mode }) => {
	return webpackMerge(
		{
			entry: path.join(__dirname, '/src/index.tsx'),
			mode,
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
							sourceMap: true,
						},
					},
					{
						test: /\.css$/i,
						use: [MiniCssExtractPlugin.loader, 'css-loader'],
					},
					{
						test: /\.(woff|woff2|eot|ttf|svg)$/,
						loader: 'file-loader?name=fonts/[name].[ext]',
					},
				],
			},
			plugins: [
				new CleanWebpackPlugin(),
				new webpack.ProgressPlugin(),
				new HtmlWebpackPlugin({
					template: './public/index.html',
				}),
				new MiniCssExtractPlugin(),
				new webpack.EnvironmentPlugin({
					...process.env,
				}),
				// new WorkboxWebpackPlugin.GenerateSW({
				// 	swDest: 'sw.js',
				// 	clientsClaim: true,
				// 	skipWaiting: true,
				// 	maximumFileSizeToCacheInBytes: 7000000,
				// }),
				// new WorkboxWebpackPlugin.InjectManifest({
				// 	swSrc: './src/sw.js',
				// 	swDest: 'sw.js',
				// 	maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
				// 	// clientsClaim: true,
				// 	// skipWaiting: true,
				// }),
			],
		},
		modeConfig({ mode }),
	)
}
