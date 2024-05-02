export default defineNuxtConfig({
  modules: ['../src/module'],

  auth: {
    endpoints: {
      login: { path: '/login', method: 'post' },
      logout: { path: '/logout', method: 'post' },
      refresh: { path: '/refresh', method: 'get' },
      user: { path: '/user', method: 'get' },
    },
  },
});
