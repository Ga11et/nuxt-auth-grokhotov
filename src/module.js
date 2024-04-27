import { defineNuxtModule, useLogger, createResolver, addPlugin, addImports } from '@nuxt/kit';

const PACKAGE_NAME = 'nuxt-auth-grokhotov';

export default defineNuxtModule({
  meta: {
    name: PACKAGE_NAME,
    configKey: 'auth',
  },
  defaults: {},
  setup() {
    const logger = useLogger(PACKAGE_NAME);

    logger.info('`nuxt-auth` setup starting');

    const { resolve } = createResolver(import.meta.url);

    addImports([
      {
        name: 'useAuth',
        from: resolve(`./runtime/composables/useAuth`),
      },
    ]);

    addPlugin(resolve('./runtime/plugins/auth.server.js'));
    addPlugin(resolve('./runtime/plugins/auth.client.js'));

    logger.success(`${PACKAGE_NAME} setup done`);
  },
});
