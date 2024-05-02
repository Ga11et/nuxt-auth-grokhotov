import jwt from 'jsonwebtoken';

const extractToken = (type, header) => {
  const [, token] = header.split(`${type} `);
  return token;
};

export default eventHandler((event) => {
  const config = useRuntimeConfig();

  const authorization = getRequestHeader(event, config.public.auth.headerName);
  if (!authorization) {
    throw createError({
      statusCode: 403,
      statusMessage: config.public.auth.headerName + ' header is required',
    });
  }

  const token = extractToken(config.public.auth.headerType, authorization);

  return jwt.decode(token);
});
