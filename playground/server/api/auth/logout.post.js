export default eventHandler((event) => {
  deleteCookie(event, 'refresh_token');
  return { status: 'OK' };
});
