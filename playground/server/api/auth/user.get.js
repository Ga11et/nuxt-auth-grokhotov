import jwt from 'jsonwebtoken';

const extractToken = (authorization) => {
  const [, token] = authorization.split('Bearer ');
  return token;
};

export default eventHandler((event) => {
  const authorization = getRequestHeader(event, 'authorization');
  if (!authorization) {
    throw createError({
      statusCode: 403,
      statusMessage: 'authorization header is required',
    });
  }

  const token = extractToken(authorization);

  return jwt.decode(token);
});
