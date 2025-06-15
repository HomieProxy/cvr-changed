import { useState, useCallback } from "react";
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  getShortToken,
  getBearerToken,
} from "@/services/auth";

interface LoginArgs {
  email: string;
  password: string;
}

interface SignupArgs {
  email: string;
  password: string;
  email_code?: string;
  invite_code?: string;
  recaptcha_data?: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => getShortToken());
  const [bearer, setBearer] = useState<string | null>(() => getBearerToken());
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(async (args: LoginArgs) => {
    const data = await loginApi(args);
    setToken(data.token);
    setBearer(data.auth_data);
    setIsAdmin(!!data.is_admin);
    return data;
  }, []);

  const signup = useCallback(async (args: SignupArgs) => {
    const data = await signupApi(args);
    setToken(data.token);
    setBearer(data.auth_data);
    setIsAdmin(!!data.is_admin);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    setToken(null);
    setBearer(null);
    setIsAdmin(false);
  }, []);

  return {
    token,
    bearerToken: bearer,
    isLoggedIn: !!token,
    isAdmin,
    login,
    signup,
    logout,
  };
}
