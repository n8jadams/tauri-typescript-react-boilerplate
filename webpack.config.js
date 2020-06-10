const path = require('path')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (_, argv) => {
	if (argv.production && argv.dev) {
		throw new Error('Cannot pass the --dev and --production flags!')
	}

	const isProd = !!argv.production

	const createConfig = (projectName) => {
		const config = {
			devtool: isProd ? false : 'source-map',
			mode: 'none',
			entry: {
				[projectName]: path.resolve(__dirname, 'src/index.tsx')
			},
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: '[name].js',
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							{
								loader: 'style-loader'
							},
							{ loader: 'css-loader' }
						]
					},
					{
						test: /\.ts$|tsx/,
						use: ['babel-loader'],
						exclude: [/node_modules/]
					}
				]
			},
			resolve: {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			},
			plugins: [
				new PurgecssPlugin({
					paths: glob.sync(`../dist/${projectName}/*`)
				}),
				new HtmlWebpackPlugin({
					filename: 'index.html',
					template: path.resolve(__dirname, 'src/template.html'),
					minify: isProd
						? {
								collapseWhitespace: true,
								removeComments: true
							}
						: false
				}),
			]
		}

		if (isProd) {
			config.mode = 'production'
			config.optimization = {
				minimizer: [new TerserPlugin()],
			}
		}

		return config
	}

	const outputConfigs = [
		createConfig('app')	
	]

	// Tack on the webserver to the first one...
	if(!isProd) {
		outputConfigs[0].devServer = {
			contentBase: path.join(__dirname, 'dist'),
			compress: true,
			port: 9000
		}
	}

	return outputConfigs
}
