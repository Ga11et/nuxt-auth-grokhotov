export default defineNuxtConfig({
  modules: ['../src/module', 'nuxt-auth-grokhotov'],

  auth: {
    endpoints: {
      register: { path: '/auth/register', method: 'POST' },
      login: { path: '/auth/login', method: 'POST' },
      logout: { path: '/auth/logout', method: 'POST' },
      refresh: { path: '/auth/refresh', method: 'GET' },
      user: { path: '/auth/user', method: 'GET' },
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
