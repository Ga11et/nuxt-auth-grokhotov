import { useState } from 'nuxt/app';

export const useAuth = () => {
  const token = useState('auth:token', () => undefined);
  const data = useState('auth:data', () => undefined);

  function login(credentials) {
    return $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    }).then((r) => {
      token.value = r.token;
      get_user();
      return r;
    });
  }
  function logout() {
    return $fetch('/api/auth/logout', {
      method: 'POST',
    }).then((r) => {
      token.value = undefined;
      data.value = undefined;
      return r;
    });
  }
  function refresh() {
    if (!token.value) return;

    return $fetch('/api/auth/refresh').then((r) => {
      token.value = r.token;

      return r;
    });
  }
  function get_user() {
    if (!token.value) return;

    return $fetch('/api/auth/user', {
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
