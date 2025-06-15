import { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BasePage } from "@/components/base";
import {
  useUserInfo,
  useUserSubscribe,
  saveUserSettings,
  updateUserPassword,
} from "@/hooks/use-user";
import dayjs from "dayjs";
import { showNotice } from "@/services/noticeService";

const UserInfoPage = () => {
  const { t } = useTranslation();
  const { userInfo, mutateUserInfo } = useUserInfo();
  const { data: subResp } = useUserSubscribe();
  const subscribe = subResp?.data.data;

  const [remindExpire, setRemindExpire] = useState<number>(0);
  const [remindTraffic, setRemindTraffic] = useState<number>(0);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    if (userInfo) {
      setRemindExpire(userInfo.remind_expire ?? 0);
      setRemindTraffic(userInfo.remind_traffic ?? 0);
    }
  }, [userInfo]);

  const onSaveSettings = async () => {
    try {
      await saveUserSettings(
        { remind_expire: remindExpire, remind_traffic: remindTraffic },
        mutateUserInfo,
      );
      showNotice("success", t("Save"));
    } catch (err: any) {
      showNotice("error", err?.message || err.toString());
    }
  };

  const onChangePassword = async () => {
    try {
      await updateUserPassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      showNotice("success", t("Password Updated"));
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      showNotice("error", err?.message || err.toString());
    }
  };

  const formatDate = (ts?: number | null) => {
    if (!ts) return "-";
    return dayjs.unix(ts).format("YYYY-MM-DD HH:mm");
  };

  return (
    <BasePage title={t("User Info")}>
      <Stack spacing={2} sx={{ maxWidth: 480, mx: "auto" }}>
        <Typography variant="h6">{t("Account")}</Typography>
        <Typography>
          {t("Email")}: {userInfo?.email}
        </Typography>
        <Typography>
          {t("Balance")}: {userInfo?.balance ?? 0}
        </Typography>
        <Typography>
          {t("Current Plan")}: {subscribe?.plan?.name ?? "-"}
        </Typography>
        <Typography>
          {t("Expires")}: {formatDate(subscribe?.expired_at)}
        </Typography>
        <Typography>
          {t("Traffic Resets On")}: {subscribe?.reset_day ?? "-"}
        </Typography>
        <Typography>
          {t("Data Usage")}:{" "}
          {subscribe
            ? `${subscribe.u + subscribe.d} / ${subscribe.transfer_enable}`
            : "-"}
        </Typography>
        <Typography>
          {t("Quick Invite Codes")}: {userInfo?.uuid}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Update Settings")}
        </Typography>
        <TextField
          label={t("Remind Expire")}
          type="number"
          value={remindExpire}
          onChange={(e) => setRemindExpire(Number(e.target.value))}
        />
        <TextField
          label={t("Remind Traffic")}
          type="number"
          value={remindTraffic}
          onChange={(e) => setRemindTraffic(Number(e.target.value))}
        />
        <Button variant="contained" onClick={onSaveSettings}>
          {t("Save")}
        </Button>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Change Password")}
        </Typography>
        <TextField
          label={t("Current Password")}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label={t("New Password")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button variant="contained" onClick={onChangePassword}>
          {t("Change Password")}
        </Button>
      </Stack>
    </BasePage>
  );
};

export default UserInfoPage;
