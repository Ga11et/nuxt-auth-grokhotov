export default eventHandler((event) => {
  const config = useRuntimeConfig();

  deleteCookie(event, config.public.auth.cookieName);
  return { status: 'OK' };
});
