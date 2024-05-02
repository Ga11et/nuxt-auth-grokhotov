import { defineNuxtPlugin, useCookie } from 'nuxt/app';
import { useAuth } from '../composables/useAuth';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const { token, get_user } = useAuth();
  const cookie_refresh = useCookie(config.public.auth.cookieName);

  if (!cookie_refresh.value) return;

  const { refresh } = config.public.auth.endpoints;

  await $fetch
    .raw('/api' + refresh.path, {
      method: refresh.method,
      headers: {
        Cookie: `${config.public.auth.cookieName}=${cookie_refresh.value}`,
      },
    })
    .then((resp) => {
      let new_cookie_refresh = '';

      for (const iterator of resp.headers) {
        if (iterator[0] === 'set-cookie') {
          const cookieParts = iterator[1].split(';')[0].split('=');
          if (cookieParts[0] === config.public.auth.cookieName) {
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
