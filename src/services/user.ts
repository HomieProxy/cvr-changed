// User-related API helpers

import { getAuthAxios } from "./auth";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: any;
}

// Types based on documentation
export interface UserCommConfigData {
  is_telegram: number;
  telegram_discuss_link?: string;
  stripe_pk?: string;
  withdraw_methods?: string[];
  withdraw_close: number;
  currency: string;
  currency_symbol: string;
  commission_distribution_enable: number;
  commission_distribution_l1: string;
  commission_distribution_l2: string;
  commission_distribution_l3: string;
  configs?: Record<string, any>;
  customFooterHtml?: string;
}

export interface UserInfoData {
  email: string;
  transfer_enable: number;
  last_login_at: number | null;
  created_at: number;
  banned: number;
  remind_expire: number;
  remind_traffic: number;
  expired_at: number | null;
  balance: number;
  commission_balance: number;
  plan_id: number | null;
  discount: number | null;
  commission_rate: number | null;
  telegram_id: number | null;
  uuid: string;
  avatar_url?: string;
}

export interface UserUpdateRequest {
  remind_expire?: number;
  remind_traffic?: number;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface PlanInfo {
  id: number;
  group_id: number;
  transfer_enable: number;
  name: string;
  prices: {
    month_price: number;
  };
  [key: string]: any;
}

export interface UserSubscribeData {
  plan_id: number;
  token: string;
  expired_at: number | null;
  u: number;
  d: number;
  transfer_enable: number;
  email: string;
  uuid: string;
  plan: PlanInfo;
  subscribe_url: string;
  reset_day: number;
}

export interface TelegramBotInfo {
  username: string;
}

export interface TransferRequest {
  transfer_amount: number;
}

export interface InviteCodeItem {
  user_id: number;
  code: string;
  pv: number;
  status: number;
  created_at: number;
  updated_at: number;
}

export interface InviteDetailsData {
  codes: InviteCodeItem[];
  stat: [number, number, number, number, number];
}

export interface CommissionRecord {
  id: number;
  order_amount: number;
  trade_no: string;
  get_amount: number;
  created_at: number;
}

export interface CommissionRecordsResponse {
  data: CommissionRecord[];
  total: number;
}

export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  created_at: number | string;
  img_url?: string;
  tags?: string[];
}

export interface NoticeFetchResponse {
  data: NoticeItem[];
  total: number;
}

export const fetchUserCommConfig = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<UserCommConfigData>>(
    "/globalize/v1/user/comm/config",
  );
};

export const fetchUserInfo = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<UserInfoData>>("/globalize/v1/user/info");
};

export const updateUserSettings = async (payload: UserUpdateRequest) => {
  const ins = await getAuthAxios();
  return ins.post<ApiResponse<true>, UserUpdateRequest>(
    "/globalize/v1/user/update",
    payload,
  );
};

export const changePassword = async (payload: ChangePasswordRequest) => {
  const ins = await getAuthAxios();
  return ins.post<ApiResponse<true>, ChangePasswordRequest>(
    "/globalize/v1/user/changePassword",
    payload,
  );
};

export const fetchUserSubscribe = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<UserSubscribeData>>(
    "/globalize/v1/user/getSubscribe",
  );
};

export const fetchTelegramBotInfo = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<TelegramBotInfo>>(
    "/globalize/v1/user/telegram/getBotInfo",
  );
};

export const resetSubscription = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<string>>("/globalize/v1/user/resetSecurity");
};

export const transferCommission = async (payload: TransferRequest) => {
  const ins = await getAuthAxios();
  return ins.post<ApiResponse<true>, TransferRequest>(
    "/globalize/v1/user/transfer",
    payload,
  );
};

export const fetchInviteDetails = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<InviteDetailsData>>(
    "/globalize/v1/user/invite/fetch",
  );
};

export const createInviteCode = async () => {
  const ins = await getAuthAxios();
  return ins.get<ApiResponse<true>>("/globalize/v1/user/invite/save");
};

export const fetchCommissionRecords = async () => {
  const ins = await getAuthAxios();
  return ins.get<CommissionRecordsResponse>(
    "/globalize/v1/user/invite/details",
  );
};

export const fetchNotices = async () => {
  const ins = await getAuthAxios();
  return ins.get<NoticeFetchResponse>("/globalize/v1/user/notice/fetch");
};
