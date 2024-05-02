import { useState } from 'nuxt/app';

export const useAuth = () => {
  const config = useRuntimeConfig();

  const token = useState(config.public.auth.state.tokenName, () => undefined);
  const data = useState(config.public.auth.state.dataName, () => undefined);

  const {
    login: loginOption,
    logout: logoutOption,
    refresh: refreshOption,
    user: userOption,
  } = config.public.auth.endpoints;

  async function login(credentials) {
    return $fetch('/api' + loginOption.path, {
      method: loginOption.method,
      body: credentials,
    }).then((r) => {
      token.value = r.token;
      get_user();
      return r;
    });
  }
  async function logout() {
    return $fetch('/api' + logoutOption.path, {
      method: logoutOption.method,
    }).then((r) => {
      token.value = undefined;
      data.value = undefined;
      return r;
    });
  }
  async function refresh() {
    console.log('refresh');
    if (!token.value) return;

    return $fetch('/api' + refreshOption.path, {
      method: refreshOption.method,
    }).then((r) => {
      token.value = r.token;

      return r;
    });
  }
  async function get_user() {
    if (!token.value) return;

    const headerName = config.public.auth.headerName;
    const headerType = config.public.auth.headerType;

    const headers = {};
    headers[headerName] = `${headerType} ${token.value}`;

    return $fetch('/api' + userOption.path, {
      method: userOption.method,
      headers,
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
