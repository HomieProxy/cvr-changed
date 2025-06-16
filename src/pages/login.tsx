import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { BasePage } from "@/components/base";
import { showNotice } from "@/services/noticeService";
import { useAuth } from "@/hooks/use-auth";
import { importSubscribeProfile } from "@/hooks/use-user";
import {
  fetchOssConfig,
  getOssBaseUrl,
  OssConfigItem,
} from "@/services/domain_service";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<OssConfigItem[]>([]);
  const [serverUrl, setServerUrl] = useState<string>("");

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const baseUrl = await getOssBaseUrl();
        const list = await fetchOssConfig();
        setServers(list);
        setServerUrl(baseUrl);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServers();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      await importSubscribeProfile();
      showNotice("success", t("Login Successful"));
      navigate("/");
    } catch (err: any) {
      showNotice("error", err?.message || err?.toString() || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage title={t("Login")} full>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 300,
          mx: "auto",
        }}
      >
        <Typography variant="h5" textAlign="center">
          {t("Welcome Back!")}
        </Typography>
        <Typography variant="body2" textAlign="center">
          {t("Sign in to your HomieFroxy account.")}
        </Typography>
        <TextField
          label={t("Email")}
          placeholder={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t("Password")}
          type="password"
          placeholder={t("Password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Button variant="contained" type="submit" disabled={loading}>
            {t("Login")}
          </Button>
          <Button component={RouterLink} to="/signup">
            {t("Sign Up")}
          </Button>
        </Stack>
        <Select
          value={serverUrl}
          onChange={(e) => {
            const url = e.target.value as string;
            setServerUrl(url);
            localStorage.setItem("oss_base_url", url);
          }}
          displayEmpty
        >
          {servers.map((s) => (
            <MenuItem key={s.url} value={s.url}>
              {s.name}
              {s.url === serverUrl && (
                <CheckCircleOutlineRounded
                  color="success"
                  sx={{ fontSize: 18, ml: 1 }}
                />
              )}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </BasePage>
  );
};

export default LoginPage;
