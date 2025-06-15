import useSWR from "swr";
import {
  fetchUserCommConfig,
  fetchUserInfo,
  updateUserSettings,
  changePassword,
  fetchUserSubscribe,
  fetchTelegramBotInfo,
  resetSubscription,
  transferCommission,
  fetchInviteDetails,
  createInviteCode,
  fetchCommissionRecords,
  fetchNotices,
  UserCommConfigData,
  UserInfoData,
  UserUpdateRequest,
  ChangePasswordRequest,
  TransferRequest,
} from "@/services/user";

export const useUserInfo = () => {
  const { data, mutate } = useSWR("userInfo", fetchUserInfo);
  return {
    userInfo: data?.data as UserInfoData | undefined,
    mutateUserInfo: mutate,
  };
};

export const useUserCommConfig = () => {
  const { data, mutate } = useSWR("userCommConfig", fetchUserCommConfig);
  return {
    userCommConfig: data?.data as UserCommConfigData | undefined,
    mutateUserCommConfig: mutate,
  };
};

export const useUserSubscribe = () =>
  useSWR("userSubscribe", fetchUserSubscribe);

export const useTelegramBotInfo = () =>
  useSWR("telegramBotInfo", fetchTelegramBotInfo);

export const useInviteDetails = () =>
  useSWR("inviteDetails", fetchInviteDetails);

export const useCommissionRecords = () =>
  useSWR("commissionRecords", fetchCommissionRecords);

export const useNotices = () => useSWR("notices", fetchNotices);

export const saveUserSettings = async (
  payload: UserUpdateRequest,
  mutateFn?: () => Promise<any>,
) => {
  await updateUserSettings(payload);
  if (mutateFn) await mutateFn();
};

export const updateUserPassword = async (payload: ChangePasswordRequest) => {
  await changePassword(payload);
};

export const resetUserSubscription = async () => {
  await resetSubscription();
};

export const sendTransferCommission = async (payload: TransferRequest) => {
  await transferCommission(payload);
};

export const generateInviteCode = async () => {
  await createInviteCode();
};

export const useUser = () => {
  const { userInfo, mutateUserInfo } = useUserInfo();
  const { userCommConfig, mutateUserCommConfig } = useUserCommConfig();

  const updateSettings = async (payload: UserUpdateRequest) => {
    await saveUserSettings(payload, mutateUserInfo);
  };

  return {
    userInfo,
    userCommConfig,
    mutateUserInfo,
    mutateUserCommConfig,
    updateSettings,
  };
};
