export default eventHandler(async (event) => {
  const body = await readBody(event);

  return $fetch
    .raw('/api/php-login', {
      method: 'POST',
      body,
    })
    .then((resp) => {
      for (const iterator of resp.headers) {
        if (iterator[0] === 'set-cookie') {
          appendResponseHeader(event, 'set-cookie', iterator[1]);
        }
      }

      return {
        token: resp._data.accessToken,
      };
    })
    .catch((err) => {
      throw createError({
        statusCode: 422,
        statusMessage: 'login failed, check cridentials',
      });
    });
});
