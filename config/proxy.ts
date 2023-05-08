/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
    dev: {
        // localhost:8000/api_data/** -> http://172.16.0.16:82/api_data/**
        '/api_data/': {
            target: 'http://172.16.0.16:82/',
            changeOrigin: false,
        },
        '/pms/': {
            target: 'http://pms-test.huaweicloud.plus/', // @ts-nocheck
            changeOrigin: true,
        },
    },
};
