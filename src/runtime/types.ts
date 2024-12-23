export type moduleOptions = {
  endpoints: {
    register: { path: string; method: HTTP_Method };
    login: { path: string; method: HTTP_Method };
    logout: { path: string; method: HTTP_Method };
    refresh: { path: string; method: HTTP_Method };
    user: { path: string; method: HTTP_Method };
  };
  cookieName: string;
  headerName: string;
  headerType: string;
  state: {
    tokenName: string;
    dataName: string;
  };
  session: {
    maxAge: number;
  };
};

export type Credentials = { username?: string; email?: string; password?: string } & Record<string, any>;

export type TokenResponse = {
  token: string | undefined;
};
export type UserResponse = any;
export type LogoutResponse = {
  status: string;
};

export type HTTP_Method = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE';
