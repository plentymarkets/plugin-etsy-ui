const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});

module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}), {

        // devtool: 'source-map',
        devtool: 'cheap-module-source-map',

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
        },

        plugins: [

            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk5ODRkOGYzYzBiOTRmY2E0ODRmZjMxZjM4N2IwN2Y0NDA0ZjlmOGE1OTNmN2Q2MjRhNTk0N2ZiNGY4OGI4NTU3OTM4ZmM2OWMzMzYyNDZkIn0.eyJhdWQiOiIxIiwianRpIjoiOTk4NGQ4ZjNjMGI5NGZjYTQ4NGZmMzFmMzg3YjA3ZjQ0MDRmOWY4YTU5M2Y3ZDYyNGE1OTQ3ZmI0Zjg4Yjg1NTc5MzhmYzY5YzMzNjI0NmQiLCJpYXQiOjE1MTAxNjkxMTYsIm5iZiI6MTUxMDE2OTExNiwiZXhwIjoxNTEwMjU1NTE1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.I1KxXNNKIyfMSBBNcxe2xSa1DWacMMI2lqhQuB9fcV9CD4cp1DuDd4UunrQ6AV8wDoT5YTigvodL-iXnqL98mF7xfGbAPvmiRt669VjUzG5pR3F2kLcB22S7WCMOQSM1HNOPUnz9E_ddxceG2TgXuZuN4m_BJtGWypflIZELpa_qu_gPETB9KME6c8jscp-aBow7E1gyKWEKalj8GDsotmElAQ2zq_dFhCGEe59W_FyGc_se6R2Bxxo_e8RYheWSEibSTV0FeO6ca5ergYN5fDvGkLuLeZChzckjy9_Ovyw645PVdm3sZlZHJZ_xxsZuSy1YA681ayMpzQQjB3m0D1ifRhamXwS4aUu8CgmEFW6UsQr6hEx64q1O9ooOBtrDqLjPVgI5Ou8scikxQNplrZHu6Q0KeYwcX2vBcPFW6BE9USM-tMuAdePp0nDQ1K2sKjoq0oPc1dNDJwG9F0T_6KSOKOrdEtnFNq2SAhhI5eQTelxKwx5kaKLRbZA7qVjPBgAhEXYq1JhERTi3Ea67262lDe7r_XkF0LFql5uFl4o11s6FQ7swuhiDn2HaMSiOgxRqeVV-AsUO__YfpfjIpQdQSAIeCaXZt22De6QPYcPtmEescwoGc3XbvagPuT6wOVSx9MGWUT2-C5DgFU9UoRaHV_s6-etlsYuzgJO-M_s'),
                    'BASE_URL': JSON.stringify('http://master.login.plentymarkets.com')
                }
            })
        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        }

    });
};