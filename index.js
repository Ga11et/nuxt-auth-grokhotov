#!/usr/bin/env node

import fs from 'fs';
import cp from 'child_process';
import util from 'util';

const exec = util.promisify(cp.exec);

function createFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath} successfully.`);
  } catch (err) {
    console.error(`Error creating ${filePath}:`, err);
  }
}

function createFolder(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      console.log(`${folderPath} already exists.`);
      return;
    }

    fs.mkdirSync(folderPath);
    console.log(`Created ${folderPath} successfully.`);
  } catch (err) {
    console.error(`Error creating ${folderPath}:`, err);
  }
}

function findFileRecursively(directoryPath, fileName) {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const ignore = ['node_modules', '.git', 'dist', '.nuxt', '.output'];
      if (ignore.includes(file)) continue;

      const fullPath = `${directoryPath}/${file}`;

      if (file === fileName) {
        console.log(`${fullPath} found.`);
        return directoryPath;
      } else if (fs.statSync(fullPath).isDirectory()) {
        const path = findFileRecursively(fullPath, fileName);
        if (path) return path;
      }
    }

    console.log(`${fileName} not found in ${directoryPath}.`);
  } catch (err) {
    console.error(`Error finding ${fileName} in ${directoryPath}:`, err);
  }
}
function addModule(path, module, file = 'nuxt.config.js') {
  try {
    const configFile = fs.readFileSync(path + '/' + file, 'utf8');

    if (/modules:\s\[\D*nuxt-auth-grokhotov\D*\]/g.test(configFile)) {
      console.log(`${module} already added to nuxt.config.js.`);
      return;
    }

    const updatedConfig = configFile.replace(/modules:\s\[(\D+)\]/g, `modules: [$1, '${module}']`);
    fs.promises.writeFile(path + '/nuxt.config.js', updatedConfig);
    console.log(`${module} successfully added to nuxt.config.js.`);
  } catch (error) {
    console.error(`Error Adding ${module} to nuxt.config.js.`, error);
  }
}
async function changeDirectory(directoryPath) {
  if (directoryPath === '.') {
    console.error(`Error changing directory: cannot change "."`);
    return;
  }

  try {
    await exec(`cd ${directoryPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error changing directory: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`Error changing directory: ${stderr}`);
        return;
      }

      console.log(`Directory changed successfully to ${directoryPath}.`);
      console.log(stdout);
    });
  } catch (err) {
    console.error(`Error changing directory: ${err.message}`);
  }
}
async function runYarnAdd(packageName) {
  console.log(`Started fetching ${packageName}`);
  const command = `yarn add ${packageName}`;

  try {
    const { stdout } = await exec(command);
    console.log(`Yarn add command executed successfully.\n${stdout}`);
  } catch (error) {
    console.error(`Error running yarn add: ${error.message}`);
  }
}

const login = `export default eventHandler(async (event) => {
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
`;
const logout = `export default eventHandler((event) => {
  deleteCookie(event, 'refresh_token');
  return { status: 'OK' };
});
`;
const refresh = `export default eventHandler(async (event) => {
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
`;
const user = `import jwt from 'jsonwebtoken';

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
`;
const php_login = `const accessToken =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwicGljdHVyZSI6Imh0dHBzOi8vZ2l0aHViLmNvbS9udXh0LnBuZyIsIm5hbWUiOiJVc2VyIHVzZXJuYW1lIn0sImlhdCI6MTUxNjIzOTAyMn0.7TFU_1A10fXh0u2Hn7UZ0XXZTL_A0O2dNBpzUFeCIEk';
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
`;
const php_refresh = `const accessToken
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
`;

let path = findFileRecursively('.', 'nuxt.config.js');
let file = 'nuxt.config.js';

if (!path) {
  path = findFileRecursively('.', 'nuxt.config.ts');
  file = 'nuxt.config.ts';
}

if (path) {
  createFolder(path + '/server');
  createFolder(path + '/server/api');
  createFolder(path + '/server/api/auth');

  createFile(path + '/server/api/auth/login.post.js', login);
  createFile(path + '/server/api/auth/logout.post.js', logout);
  createFile(path + '/server/api/auth/refresh.get.js', refresh);
  createFile(path + '/server/api/auth/user.get.js', user);
  createFile(path + '/server/api/php-login.js', php_login);
  createFile(path + '/server/api/php-refresh.js', php_refresh);

  addModule(path, 'nuxt-auth-grokhotov', file);

  changeDirectory(path).then(() => {
    runYarnAdd('nuxt-auth-grokhotov').then(() => {
      runYarnAdd('jsonwebtoken').then(() => {
        console.log('Успешное завершение скрипта');
      });
    });
  });
} else {
  console.error('Ошибка исполнения скрипта, nuxt.config.js не найден');
}
