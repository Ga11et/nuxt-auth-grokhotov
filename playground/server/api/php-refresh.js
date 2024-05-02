const accessToken
= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwicGljdHVyZSI6Imh0dHBzOi8vZ2l0aHViLmNvbS9udXh0LnBuZyIsIm5hbWUiOiJVc2VyIHVzZXJuYW1lIn0sImlhdCI6MTUxNjIzOTAyMn0.7TFU_1A10fXh0u2Hn7UZ0XXZTL_A0O2dNBpzUFeCIEk';
const refreshToken = 'refresh_token';

export default eventHandler(async (event) => {
  const cookie_refresh = getCookie(event, 'refresh_token');

  if (cookie_refresh === 'refresh_token') {
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    return {
      accessToken,
    };
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Unauthorized, refreshToken cant be verified',
  });
});
