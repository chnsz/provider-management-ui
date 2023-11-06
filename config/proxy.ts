/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  local: {
    '/pms/': {
      target: 'http://192.168.0.115:8080/', // @ts-nocheck
      changeOrigin: true,
    },
    '/pgs/': {
      target: 'http://192.168.0.115:8082/', // @ts-nocheck
      changeOrigin: true,
    },
    '/pgs/download/': {
      target: 'http://pms.huaweicloud.plus/download/', // @ts-nocheck
      changeOrigin: true,
    },
  },
  dev: {
    '/pms/': {
      target: 'http://192.168.0.4:30200/', // @ts-nocheck
      changeOrigin: true,
    },
    '/pgs/': {
      target: 'http://192.168.0.4:30501/', // @ts-nocheck
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
  },
};
