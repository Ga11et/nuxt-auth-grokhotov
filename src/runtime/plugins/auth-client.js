import { defineNuxtPlugin } from 'nuxt/app';
import { useAuth } from '../composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
  let interval;

  nuxtApp.hook('app:mounted', () => {
    document.addEventListener('visibilitychange', visibilityHandler, false);

    interval = setInterval(refresh, 10000);
  });

  nuxtApp.vueApp.unmount = function () {
    document.removeEventListener('visibilitychange', visibilityHandler, false);

    clearInterval(interval);
  };

  const visibilityHandler = () => {
    if (document.visibilityState === 'visible') {
      refresh();
    }
  };
});

const refresh = async () => {
  const { refresh, get_user } = useAuth();

  await refresh();
  await get_user();
};
