import { useState } from 'nuxt/app';

export const useAuth = () => {
  const config = useRuntimeConfig();

  const token = useState('auth:token', () => undefined);
  const data = useState('auth:data', () => undefined);

  const {
    login: loginOption,
    logout: logoutOption,
    refresh: refreshOption,
    user: userOption,
  } = config.public.auth.endpoints;

  async function login(credentials) {
    return $fetch('/api/auth' + loginOption.path, {
      method: loginOption.method,
      body: credentials,
    }).then((r) => {
      token.value = r.token;
      get_user();
      return r;
    });
  }
  async function logout() {
    return $fetch('/api/auth' + logoutOption.path, {
      method: logoutOption.method,
    }).then((r) => {
      token.value = undefined;
      data.value = undefined;
      return r;
    });
  }
  async function refresh() {
    if (!token.value) return;

    return $fetch('/api/auth' + refreshOption.path, {
      method: refreshOption.method,
    }).then((r) => {
      token.value = r.token;

      return r;
    });
  }
  async function get_user() {
    if (!token.value) return;

    return $fetch('/api/auth' + userOption.path, {
      method: userOption.method,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).then((r) => {
      data.value = r;
      return r;
    });
  }

  return {
    data,
    token,
    login,
    logout,
    refresh,
    get_user,
  };
};
