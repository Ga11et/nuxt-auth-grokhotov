export default eventHandler(async (event) => {
  const cookie_refresh = getCookie(event, 'refresh_token');

  if (!cookie_refresh) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized, refreshToken is undefined',
    });
  }

  return $fetch
    .raw('/api/php-refresh', {
      headers: {
        Cookie: 'refresh_token=' + cookie_refresh,
      },
    })
    .then(async (resp) => {
      for (const iterator of resp.headers) {
        if (iterator[0] === 'set-cookie') {
          appendResponseHeader(event, 'set-cookie', iterator[1]);
        }
      }

      return {
        token: resp._data.accessToken,
      };
    })
    .catch(() => {
      throw createError({
        statusCode: 422,
        statusMessage: 'refresh failed, check token',
      });
    });
});
