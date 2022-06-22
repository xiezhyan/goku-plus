import { TOKEN_NAME, TOKEN_VALUE } from '@/store/modules/user/types'

const isLogin = () => {
  return !!sessionStorage.getItem(TOKEN_VALUE);
};

const getToken = () => {
  return sessionStorage.getItem(TOKEN_VALUE);
};

const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_VALUE, token);
};

const clearToken = () => {
  sessionStorage.removeItem(TOKEN_VALUE);
  sessionStorage.removeItem(TOKEN_NAME);
};

const getTokenName = () => {
  return sessionStorage.getItem(TOKEN_NAME);
}

const setTokenName = (tokenName: string) => {
  sessionStorage.setItem(TOKEN_NAME || "token", tokenName);
};


export { isLogin, getToken, setToken, clearToken, getTokenName, setTokenName };
