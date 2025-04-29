import { fetchGet, fetchPost } from "../util/fetch";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BACKEND_URL_AUTH = `${BACKEND_URL}/auth`;
const BACKEND_URL_USERS = `${BACKEND_URL}/users`;

const testApi = async () => {
  const response = await fetchGet(`${BACKEND_URL_USERS}`);
  console.log(response);
  return response;
};

// --- auth endpoints ---

const register = async (credentials) => {
  console.log("const register called");
  const response = await fetchPost(`${BACKEND_URL_AUTH}/register`, credentials);

  return {
    ...response,
    success: true,
  };
};

const login = async (credentials) => {
  console.log("const login called");
  const response = await fetchPost(`${BACKEND_URL_AUTH}/login`, credentials);
  return {
    ...response,
    success: true,
  };
};

// --- export ---
const authApi = {
  testApi,
  register,
  login,
};

export default authApi;
