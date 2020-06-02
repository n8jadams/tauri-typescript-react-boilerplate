const path = require('path')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const tauriWebpack = require('@tauri-apps/tauri-webpack')
const webpackMerge = require('webpack-merge')
const fs = require('fs')

// A custom plugin to actually inline the outputted javascript into the index html
// I might add some arguments and make this a bit more extensible
function InjectInlineScriptToHtmlPlugin({
	projectName
}) {
	return {
		apply: compiler => {
			compiler.hooks.done.tap('InjectInlineScript', () => {
				const indexPath = path.resolve(__dirname, 'dist/index.html')
				const outputJs = fs.readFileSync(path.resolve(__dirname, `dist/${projectName}.js`), 'utf-8')
				const indexHtml = fs.readFileSync(indexPath, 'utf-8')
				const splitHtml = indexHtml.split('</body>')
				const outputHtml = splitHtml.map((part, i) => {
					if(i !== splitHtml.length - 2) {
						return part
					}
					return `${part}<script>${outputJs}</script>`
				}).join('</body>')
				fs.writeFileSync(indexPath, outputHtml, 'utf-8')
				return false;
			})
		}
	}
}

module.exports = (_, argv) => {
	if (argv.production && argv.dev) {
		throw new Error('Cannot pass the --dev and --production flags!')
	}

	const tauriMode = !!process.env.TAURI
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
					hash: true,
					template: path.resolve(__dirname, 'src/template.html'),
					minify: isProd
						? {
								collapseWhitespace: true,
								removeComments: true
							}
						: false,
					inject: !isProd
				}),
			]
		}

		if (isProd) {
			config.mode = 'production'
			config.optimization = {
				minimizer: [new TerserPlugin()],
			}
			config.plugins.push(new InjectInlineScriptToHtmlPlugin({ projectName }))
		}

		if (tauriMode) {
			webpackMerge(webpackConfig, tauriWebpack.config())
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
