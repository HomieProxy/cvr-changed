import axios, { AxiosInstance } from "axios";
import { getOssBaseUrl } from "./domain_service";

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
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(BEARER_KEY, bearer);
  instancePromise = null;
}

export function getShortToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getBearerToken() {
  return localStorage.getItem(BEARER_KEY);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(BEARER_KEY);
  instancePromise = null;
}

export async function login(payload: LoginPayload): Promise<LoginResponseData> {
  const ins = await getAxios();
  const res = await ins.post<
    ApiResponse<LoginResponseData>,
    ApiResponse<LoginResponseData>
  >("/globalize/v1/passport/auth/login", payload);
  const data = res.data;
  saveTokens(data.token, data.auth_data);
  return data;
}

export async function signup(
  payload: SignupPayload,
): Promise<LoginResponseData> {
  const ins = await getAxios();
  const res = await ins.post<
    ApiResponse<LoginResponseData>,
    ApiResponse<LoginResponseData>
  >("/globalize/v1/passport/auth/register", payload);
  const data = res.data;
  saveTokens(data.token, data.auth_data);
  return data;
}

export async function logout() {
  clearTokens();
}
