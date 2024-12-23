import { useRuntimeConfig, useState } from 'nuxt/app';
import { type Credentials, type LogoutResponse, type TokenResponse, type UserResponse } from '../types';

export const useAuth = () => {
  const config = useRuntimeConfig();

  const token = useState<string | undefined>(config.public.auth.state.tokenName, () => undefined);
  const data = useState(config.public.auth.state.dataName, () => undefined);

  const {
    register: registerOption,
    login: loginOption,
    logout: logoutOption,
    refresh: refreshOption,
    user: userOption,
  } = config.public.auth.endpoints;

  async function register(payload: Credentials): Promise<TokenResponse> {
    return $fetch<TokenResponse>('/api' + registerOption.path, {
      method: registerOption.method,
      body: payload,
    }).then((r) => {
      token.value = r.token;
      get_user();
      return r;
    });
  }
  async function login(credentials: Credentials): Promise<TokenResponse> {
    return $fetch<TokenResponse>('/api' + loginOption.path, {
      method: loginOption.method,
      body: credentials,
    }).then((r) => {
      token.value = r.token;
      get_user();
      return r;
    });
  }
  async function logout(): Promise<LogoutResponse> {
    return $fetch<LogoutResponse>('/api' + logoutOption.path, {
      method: logoutOption.method,
    }).then((r) => {
      token.value = undefined;
      data.value = undefined;
      return r;
    });
  }
  async function refresh(): Promise<TokenResponse> {
    if (!token.value) return { token: undefined };

    return $fetch<TokenResponse>('/api' + refreshOption.path, {
      method: refreshOption.method,
    }).then((r) => {
      token.value = r?.token;

      return r;
    });
  }
  async function get_user(): Promise<UserResponse> {
    if (!token.value) return;

    const headerName = config.public.auth.headerName;
    const headerType = config.public.auth.headerType;

    const headers: HeadersInit = {};
    headers[headerName] = `${headerType} ${token.value}`;

    return $fetch<UserResponse>('/api' + userOption.path, {
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
    register,
    login,
    logout,
    refresh,
    get_user,
  };
};
