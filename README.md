# nuxt-auth-grokhotov

## Quick Start

```sh
npx nuxt-auth-grokhotov
```

## Features

`nuxt-auth-grokhotov` это библиотека, которая реализует базовый функционал авторизации

### Функционал включает в себя:

- ✔️ Composable `useAuth`:
  - actions: `login`, `logout`, `refresh`, `get_user`
  - getters: `token`, `data`
- ✔️ Application-side middleware, которая автоматически делает запрос refresh и get_user, по истечению настраимового интервала
- ✔️ Server-side middleware, которая авторизует пользователя, при существовании refresh токен в куках
- ✔️ Жизненный цикл сессии:
  - Перезагрузка сессии с настраиваемой периодичностью
  - Перезагрузка сессии, при активации вкладки браузера
  - Получение сессии при начальной загрузке приложения server-side
- ✔️ REST API:
  - `POST /login`,
    - Запрос на аутентификацию, используя `cridentials` (логин, пароль)
    - Устанавливает `refresh` `cookie` и возвращает `access` токен в респонсе
  - `POST /logout`,
    - Удаляет `refresh` `cookie` и возвращает `{ status: 'OK' }` в респонсе
  - `GET /refresh`,
    - Запрос на авторизацию пользователя при помощи `refresh` токена в `cookie`
    - Устанавливает `refresh` `cookie` и возвращает `access` токен в респонсе
  - `GET /user`
    - Запрос на получение пользователя из `access` токена при помощи расшифровки `jsonwebtoken`

## Configuration

```sh
# В примере приведены значения по умолчанию
export default defineNuxtConfig({
  auth: {
    # Управление методоами и путями, на которые уходит запрос при вызове соответствующих функций
    endpoints: {
      login: { path: '/auth/login', method: 'post' },
      logout: { path: '/auth/logout', method: 'post' },
      refresh: { path: '/auth/refresh', method: 'get' },
      user: { path: '/auth/user', method: 'get' },
    },
    # Управление названием куки, которую ждем с бека для refresh токена
    cookieName: 'refresh_token',
    # Управление названием и типом заголовка, который посылаем для расшифровки пользователя по access токену
    # headerName: headerType token
    headerName: 'authorization',
    headerType: 'Bearer',
    # Управление названиями полей в глобальном объекте Nuxt 3
    state: {
      tokenName: 'auth:token',
      dataName: 'auth:data',
    },
    # Управление интервалом обновления сессии
    session: {
      maxAge: 1000 * 60 * 10,
    },
  },
});
```

## Альтернативный Quick Start

```sh
yarn add nuxt-auth-grokhotov
```

**Добавить в nuxt.config.js**

```sh
export default defineNuxtConfig({
  modules: ['nuxt-auth-grokhotov'],
});
```

**Создать 6 файлов в папке с проектом**
**Пример заполнения файлов привезен ниже в блоке _Начальная настройка_**

```sh
/server/api/auth/login.post.js
/server/api/auth/logout.post.js
/server/api/auth/refresh.get.js
/server/api/auth/user.get.js

# Эти два файла создаются как моковые эндпоинты, которые будут находиться на бэке
/server/api/php-login.js
/server/api/php-refresh.js
```

### Начальная настройка

_/server/api/auth/login.post.js_

```
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
```

_/server/api/auth/logout.post.js_

```
export default eventHandler((event) => {
  deleteCookie(event, 'refresh_token');
  return { status: 'OK' };
});
```

_/server/api/auth/refresh.get.js_

```
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
        Cookie: `refresh_token=${cookie_refresh}`,
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
```

_/server/api/auth/user.get.js_

```
import jwt from 'jsonwebtoken';

const extractToken = (authorization) => {
  const [, token] = authorization.split(`Bearer `);
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
```

_/server/api/php-login.js_

```
const accessToken
  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwicGljdHVyZSI6Imh0dHBzOi8vZ2l0aHViLmNvbS9udXh0LnBuZyIsIm5hbWUiOiJVc2VyIHVzZXJuYW1lIn0sImlhdCI6MTUxNjIzOTAyMn0.7TFU_1A10fXh0u2Hn7UZ0XXZTL_A0O2dNBpzUFeCIEk';
const refreshToken = 'refresh_token';

export default eventHandler(async (event) => {
  const body = await readBody(event);

  if (body.name === 'name' && body.pass === 'pass') {
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
    statusCode: 422,
    statusMessage: 'Wrong credentials',
  });
});
```

_/server/api/php-refresh.js_

```
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
    statusMessage: 'Unauthorized, refreshToken can`t be verified',
  });
});
```
