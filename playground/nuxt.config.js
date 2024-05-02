export default defineNuxtConfig({
  modules: ['../src/module'],

  auth: {
    endpoints: {
      login: { path: '/auth/login', method: 'post' },
      logout: { path: '/auth/logout', method: 'post' },
      refresh: { path: '/auth/refresh', method: 'get' },
      user: { path: '/auth/user', method: 'get' },
    },
    cookieName: 'refresh_token',
    headerName: 'authorization',
    headerType: 'Bearer',
    state: {
      tokenName: 'auth:token',
      dataName: 'auth:data',
    },
    session: {
      maxAge: 1000 * 10,
    },
  },
});
