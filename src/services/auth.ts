import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { getOssBaseUrl, switchOssBaseUrl } from "./domain_service";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: any;
}

interface LoginResponseData {
  token: string;
  auth_data: string;
  is_admin: number;
}

interface SignupPayload {
  email: string;
  password: string;
  email_code?: string;
  invite_code?: string;
  recaptcha_data?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const TOKEN_KEY = "auth_token";
const BEARER_KEY = "auth_bearer";

let instancePromise: Promise<AxiosInstance> | null = null;
async function getAxios(): Promise<AxiosInstance> {
  if (!instancePromise) {
    instancePromise = (async () => {
      const baseURL = await getOssBaseUrl();
      const authHeader = getBearerToken();
      const ins = axios.create({
        baseURL,
        headers: authHeader ? { Authorization: authHeader } : {},
        timeout: 15000,
      });
      ins.interceptors.response.use((r) => r.data);
      return ins;
    })();
  }
  return instancePromise;
}

function saveTokens(token: string, bearer: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 30 });
  Cookies.set(BEARER_KEY, bearer, { expires: 30 });
  instancePromise = null;
}

export function getShortToken(): string | null {
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function getBearerToken(): string | null {
  return Cookies.get(BEARER_KEY) ?? null;
}

export function clearTokens() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(BEARER_KEY);
  instancePromise = null;
}

export async function login(payload: LoginPayload): Promise<LoginResponseData> {
  let ins = await getAxios();
  try {
    const res = await ins.post<
      ApiResponse<LoginResponseData>,
      ApiResponse<LoginResponseData>
    >("/globalize/v1/passport/auth/login", payload);
    const data = res.data;
    saveTokens(data.token, data.auth_data);
    return data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && !err.response) {
      await switchOssBaseUrl();
      instancePromise = null;
      ins = await getAxios();
      const res = await ins.post<
        ApiResponse<LoginResponseData>,
        ApiResponse<LoginResponseData>
      >("/globalize/v1/passport/auth/login", payload);
      const data = res.data;
      saveTokens(data.token, data.auth_data);
      return data;
    }
    throw err;
  }
}

export async function signup(
  payload: SignupPayload,
): Promise<LoginResponseData> {
  let ins = await getAxios();
  try {
    const res = await ins.post<
      ApiResponse<LoginResponseData>,
      ApiResponse<LoginResponseData>
    >("/globalize/v1/passport/auth/register", payload);
    const data = res.data;
    saveTokens(data.token, data.auth_data);
    return data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && !err.response) {
      await switchOssBaseUrl();
      instancePromise = null;
      ins = await getAxios();
      const res = await ins.post<
        ApiResponse<LoginResponseData>,
        ApiResponse<LoginResponseData>
      >("/globalize/v1/passport/auth/register", payload);
      const data = res.data;
      saveTokens(data.token, data.auth_data);
      return data;
    }
    throw err;
  }
}

export async function logout() {
  clearTokens();
}

export { getAxios as getAuthAxios };
