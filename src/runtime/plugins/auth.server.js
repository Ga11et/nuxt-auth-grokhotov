import { defineNuxtPlugin, useCookie } from 'nuxt/app';
import { useAuth } from '../composables/useAuth.js';

export default defineNuxtPlugin(async () => {
  const { token, get_user } = useAuth();
  const cookie_refresh = useCookie('refresh_token');

  if (!cookie_refresh.value) return;

  await $fetch
    .raw('/api/auth/refresh', {
      headers: {
        Cookie: `refresh_token=${cookie_refresh.value}`,
      },
    })
    .then((resp) => {
      let new_cookie_refresh = '';

      for (const iterator of resp.headers) {
        if (iterator[0] === 'set-cookie') {
          const cookieParts = iterator[1].split(';')[0].split('=');
          if (cookieParts[0] === 'refresh_token') {
            new_cookie_refresh = cookieParts[1];
          }
        }
      }

      token.value = resp._data.token;
      cookie_refresh.value = new_cookie_refresh;

      return resp._data;
    })
    .catch((err) => {
      console.error(err.message);
      return;
    });

  await get_user();
});
